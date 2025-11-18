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

### 2. Setup Backend

```bash
cd backend
python -m venv venv
```

**Activate the virtual environment:**

Linux / Mac: `source venv/bin/activate`
Windows: `venv\Scripts\activate`

**Install dependencies:**

```bash
pip install -r requirements.txt
```

### 3. Configure Neo4j

- Create a free Neo4j Aura instance
- add credentials to backend/.env

```
NEO4J_URI=neo4j+s://<YOUR_AURA_URI>
NEO4J_USER=neo4j
NEO4J_PASS=<YOUR_PASSWORD>
```

### 4. Add Dataset

- Place `steam_games.csv` in the `data/` folder

### 5. Import Data

- This creates Game, Publisher, Genre, and Tag nodes in Neo4j.

```bash
cd backend
python load_data_relevant.py
```

### 6. Run the Backend API

- Start the FastAPI server

```bash
uvicorn main:app --reload
```
