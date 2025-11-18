# Neo4j - Steam Games Project

This project demonstrates importing a subset of the **Steam Games dataset** into a **Neo4j graph database** and utilizes a **Python (FastAPI) backend API** to serve data for visualization on a **React frontend**.

## Project Overview

The core goal is to model the relationships between games, publishers, genres, and tags using a graph database.

**Dataset Source:** [Steam Games Dataset on Kaggle](https://www.kaggle.com/datasets/fronkongames/steam-games-dataset)

---

## Project Structure

| Directory/File                    | Description                            | Type           |
| :-------------------------------- | :------------------------------------- | :------------- |
| `backend/`                        | Python backend (FastAPI)               | Source         |
|   `backend/database.py`           | Neo4j connection handling              | Script         |
|   `backend/load_data_relevant.py` | Import script for top 1k games         | Script         |
|   `backend/.env`                  | Neo4j credentials                      | Ignored        |
| `frontend/`                       | React frontend for graph visualization | Source         |
| `data/`                           | Steam dataset CSV (`steam_games.csv`)  | Source/Ignored |
| `venv/`                           | Python virtual environment             | Ignored        |
| `.gitignore`                      | Git exclusion rules                    | Config         |

---

## 🛠️ Setup Instructions

Follow these steps to set up the project environment and database connection.

### 1. Clone the Repository

Clone the project repository and navigate into the directory.

```bash
git clone [https://github.com/heim-lukas/neo4j-project.git](https://github.com/heim-lukas/neo4j-project.git)
cd neo4j-project
```
