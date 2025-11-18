from fastapi import FastAPI
from database import get_session

app = FastAPI(title="Steam Games API")

@app.get("/games")
def get_games(limit: int = 25):
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
