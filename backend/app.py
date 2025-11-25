from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.middleware.cors import CORSMiddleware
from database import get_session
import os
from dotenv import load_dotenv
import secrets

load_dotenv()

app = FastAPI(title="Steam Games API")

# HTTP Basic Auth
security = HTTPBasic()

# Get credentials from environment variables
API_USERNAME = os.getenv("API_USERNAME", "admin")
API_PASSWORD = os.getenv("API_PASSWORD", "password")

def verify_credentials(credentials: HTTPBasicCredentials = Depends(security)):
    """Verify HTTP Basic Auth credentials"""
    is_correct_username = secrets.compare_digest(credentials.username, API_USERNAME)
    is_correct_password = secrets.compare_digest(credentials.password, API_PASSWORD)
    
    if not (is_correct_username and is_correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

# Add CORS middleware - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for dev
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/games")
def get_games(limit: int = 25, username: str = Depends(verify_credentials)):
    """
    Returns a list of games with basic information, including the unique ID.
    The limit can be passed as a query parameter (default is 25).
    """
    query = """
    MATCH (g:Game)
    RETURN g.id AS id, g.name AS name, g.release_date AS release_date,
           g.estimated_owners AS estimated_owners,
           g.required_age AS required_age,
           g.price AS price
    LIMIT $limit
    """
    with get_session() as session:
        results = session.run(query, limit=limit)
        games = [
            {
                "id": r["id"],
                "name": r["name"],
                "release_date": r["release_date"],
                "estimated_owners": r["estimated_owners"],
                "required_age": r["required_age"],
                "price": r["price"]
            }
            for r in results
        ]
    return {"games": games}


@app.get("/games/{game_id}")
def get_game_detail(game_id: str, username: str = Depends(verify_credentials)):
    """
    Returns detailed information for a single game by ID.
    """
    query = """
    MATCH (g:Game {id: $game_id})
    OPTIONAL MATCH (g)<-[:PUBLISHED]-(p:Publisher)
    OPTIONAL MATCH (g)-[:HAS_GENRE]->(gen:Genre)
    OPTIONAL MATCH (g)-[:HAS_TAG]->(tag:Tag)
    RETURN g.id AS id,
           g.name AS name,
           g.release_date AS release_date,
           g.estimated_owners AS estimated_owners,
           g.required_age AS required_age,
           g.price AS price,
           collect(DISTINCT p.name) AS publishers,
           collect(DISTINCT gen.name) AS genres,
           collect(DISTINCT tag.name) AS tags
    LIMIT 1
    """
    with get_session() as session:
        result = session.run(query, game_id=game_id).single()
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Game with id {game_id} not found",
            )

        game = {
            "id": result["id"],
            "name": result["name"],
            "release_date": result["release_date"],
            "estimated_owners": result["estimated_owners"],
            "required_age": result["required_age"],
            "price": result["price"],
            "publishers": [p for p in result["publishers"] if p],
            "genres": [g for g in result["genres"] if g],
            "tags": [t for t in result["tags"] if t],
        }

    return {"game": game}


@app.get("/publishers/{publisher_name}/games")
def get_games_by_publisher(
    publisher_name: str,
    limit: int = 50,
    username: str = Depends(verify_credentials)
):
    """
    Returns games published by the specified publisher name.
    """
    with get_session() as session:
        publisher = session.run(
            """
            MATCH (p:Publisher)
            WHERE toLower(p.name) = toLower($publisher_name)
            RETURN p.name AS name
            """,
            publisher_name=publisher_name,
        ).single()

        if not publisher:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Publisher '{publisher_name}' not found",
            )

        query = """
        MATCH (p:Publisher)
        WHERE toLower(p.name) = toLower($publisher_name)
        MATCH (p)-[:PUBLISHED]->(g:Game)
        RETURN g.id AS id,
               g.name AS name,
               g.release_date AS release_date,
               g.estimated_owners AS estimated_owners,
               g.required_age AS required_age,
               g.price AS price
        ORDER BY g.name
        LIMIT $limit
        """

        results = session.run(
            query, publisher_name=publisher_name, limit=limit
        )

        games = [
            {
                "id": r["id"],
                "name": r["name"],
                "release_date": r["release_date"],
                "estimated_owners": r["estimated_owners"],
                "required_age": r["required_age"],
                "price": r["price"],
            }
            for r in results
        ]

    return {"publisher": publisher["name"], "games": games}
