from fastapi import FastAPI
from database import get_session

app = FastAPI()

@app.get("/games")
def get_games(limit: int = 20):
    with get_session() as session:
        results = session.run("""
            MATCH (g:Game)
            RETURN g
            LIMIT $limit
        """, limit=limit)
        return [record["g"] for record in results]

@app.get("/similar/{game_id}")
def get_similar_games(game_id: str):
    with get_session() as session:
        results = session.run("""
            MATCH (g:Game {id: $id})-[:HAS_TAG]->(t)<-[:HAS_TAG]-(other:Game)
            RETURN other.name AS name, COUNT(t) AS score
            ORDER BY score DESC
            LIMIT 10
        """, id=game_id)
        return [record for record in results]
