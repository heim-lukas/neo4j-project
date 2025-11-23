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
