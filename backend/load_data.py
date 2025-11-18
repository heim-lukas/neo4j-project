import csv
from database import get_session
import re
import sys

csv.field_size_limit(10_000_000)
csv_file_path = "data/steam_games.csv"

# Maximal importierte Spiele
MAX_ROWS = 1000

def parse_estimated_owners(owners_str):
    """
    Estimated owners ist im Format '0 - 20000' als String.
    Wir extrahieren die obere Grenze als Integer für Sortierung.
    """
    match = re.search(r'(\d+)\s*-\s*(\d+)', owners_str)
    if match:
        return int(match.group(2))
    try:
        return int(owners_str)
    except:
        return 0

def load_relevant_games():
    # --------------------------
    # CSV einlesen und sortieren nach estimated owners (absteigend)
    # --------------------------
    with open(csv_file_path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

        # Sortieren: höchste estimated owners zuerst
        rows.sort(key=lambda r: parse_estimated_owners(r["Estimated owners"]), reverse=True)

        # Nur die ersten MAX_ROWS
        rows = rows[:MAX_ROWS]

    # --------------------------
    # Daten in Neo4j importieren
    # --------------------------
    with get_session() as session:
        for i, row in enumerate(rows):
            # --------------------------
            # 1. Game Node
            # --------------------------
            session.run("""
                MERGE (g:Game {name: $name})
                SET g.release_date = $release_date,
                    g.estimated_owners = $estimated_owners,
                    g.required_age = toInteger($required_age),
                    g.price = toFloat($price)
            """,
            name=row["Name"],
            release_date=row["Release date"],
            estimated_owners=parse_estimated_owners(row["Estimated owners"]),
            required_age=row["Required age"] or 0,
            price=row["Price"] or 0.0
            )

            # --------------------------
            # 2. Publishers
            # --------------------------
            if row["Publishers"]:
                publishers = [p.strip() for p in row["Publishers"].split(",")]
                for pub in publishers:
                    session.run("""
                        MERGE (p:Publisher {name: $pub_name})
                        MERGE (g:Game {name: $game_name})
                        MERGE (p)-[:PUBLISHED]->(g)
                    """, pub_name=pub, game_name=row["Name"])

            # --------------------------
            # 3. Genres
            # --------------------------
            if row["Genres"]:
                genres = [g.strip() for g in row["Genres"].split(",")]
                for genre in genres:
                    session.run("""
                        MERGE (gen:Genre {name: $genre_name})
                        MERGE (g:Game {name: $game_name})
                        MERGE (g)-[:HAS_GENRE]->(gen)
                    """, genre_name=genre, game_name=row["Name"])

            # --------------------------
            # 4. Tags
            # --------------------------
            if row["Tags"]:
                tags = [t.strip() for t in row["Tags"].split(",")]
                for tag in tags:
                    session.run("""
                        MERGE (tg:Tag {name: $tag_name})
                        MERGE (g:Game {name: $game_name})
                        MERGE (g)-[:HAS_TAG]->(tg)
                    """, tag_name=tag, game_name=row["Name"])

            # Fortschritt ausgeben
            if (i+1) % 50 == 0:
                print(f"{i+1} Games imported ...")

if __name__ == "__main__":
    print("Data import started")
    load_relevant_games()
    print("Data import finished")
