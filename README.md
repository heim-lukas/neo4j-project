# Neo4j - Steam Games Project

This project demonstrates importing a subset of the **Steam Games dataset** into a **Neo4j graph database** and utilizes a **Python (FastAPI) backend API** to serve data for visualization on a **React frontend**.

## Project Overview

The core goal is to model the relationships between games, publishers, genres, and tags using a graph database. The project includes:

- **Backend**: FastAPI REST API that queries Neo4j database
- **Frontend**: React + TypeScript application with search and filtering capabilities
- **Database**: Neo4j graph database storing game data and relationships

**Dataset Source:** [Steam Games Dataset on Kaggle](https://www.kaggle.com/datasets/fronkongames/steam-games-dataset)

---

## Project Structure

| Directory/File                      | Description                           | Type           |
| :---------------------------------- | :------------------------------------ | :------------- |
| `backend/`                          | Python backend (FastAPI)              | Source         |
| `backend/app.py`                    | FastAPI application with endpoints    | Source         |
| `backend/database.py`               | Neo4j connection handling             | Script         |
| `backend/load_data.py`              | Import script for games data          | Script         |
| `backend/requirements.txt`          | Python dependencies                   | Config         |
| `backend/.env`                      | Neo4j credentials                     | Ignored        |
| `steam-games-frontend/`             | React frontend application            | Source         |
| `steam-games-frontend/src/`         | React source code                     | Source         |
| `steam-games-frontend/package.json` | Frontend dependencies                 | Config         |
| `data/`                             | Steam dataset CSV (`steam_games.csv`) | Source/Ignored |
| `.gitignore`                        | Git exclusion rules                   | Config         |

---

## 🛠️ Setup Instructions

Follow these steps to set up the project environment and database connection.

### Prerequisites

- Python 3.8+ installed
- Node.js 18+ and npm installed
- Neo4j Aura account (free tier available) or local Neo4j instance
- Steam Games dataset CSV file

### 1. Clone the Repository

Clone the project repository and navigate into the directory.

```bash
git clone https://github.com/heim-lukas/neo4j-project.git
cd neo4j-project
```

### 2. Setup Backend

Navigate to the backend directory and create a virtual environment:

```bash
cd backend
python -m venv venv
```

**Activate the virtual environment:**

- **Linux / Mac**: `source venv/bin/activate`
- **Windows (PowerShell)**: `.\venv\Scripts\Activate.ps1`
- **Windows (CMD)**: `venv\Scripts\activate.bat`

**Install dependencies:**

```bash
pip install -r requirements.txt
```

### 3. Configure Neo4j

1. Create a free Neo4j Aura instance at [neo4j.com/cloud/aura](https://neo4j.com/cloud/aura/)
2. Create a `.env` file in the `backend/` directory with your credentials:

```env
NEO4J_URI=neo4j+s://<YOUR_AURA_URI>
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=<YOUR_PASSWORD>

# API Authentication (optional, defaults shown)
API_USERNAME=admin
API_PASSWORD=password
```

**Note**: For local Neo4j instances, use:

```env
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=<YOUR_PASSWORD>

# API Authentication (optional, defaults shown)
API_USERNAME=admin
API_PASSWORD=password
```

**Security Note**: Change the `API_USERNAME` and `API_PASSWORD` to secure values in production!

### 4. Add Dataset

1. Download the Steam Games dataset from [Kaggle](https://www.kaggle.com/datasets/fronkongames/steam-games-dataset)
2. Place `steam_games.csv` in the `data/` folder at the project root

### 5. Import Data

Import the games data into Neo4j. This creates Game nodes with properties like name, release_date, price, etc.

```bash
cd backend
python load_data.py
```

**Note**: The import script may take some time depending on the dataset size.

### 6. Run the Backend API

Start the FastAPI server:

```bash
cd backend
uvicorn app:app --reload
```

The `--reload` flag enables auto-reload on code changes (useful for development).

The API will be available at `http://localhost:8000`

- **API Base URL**: `http://localhost:8000`
- **Interactive API docs**: `http://localhost:8000/docs`
- **Alternative docs**: `http://localhost:8000/redoc`
- **Games endpoint**: `http://localhost:8000/games?limit=25`

### 7. Setup Frontend

Open a new terminal window and navigate to the frontend directory:

```bash
cd steam-games-frontend
```

**Install dependencies:**

```bash
npm install
```

### 8. Run the Frontend

Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (Vite's default port)

The frontend is configured to proxy API requests to the backend automatically.

---

## 🚀 Usage

### Backend API

The FastAPI backend provides the following endpoint:

#### `GET /games`

Returns a list of games from the Neo4j database.

**Authentication**: This endpoint requires HTTP Basic Authentication. Credentials are configured via `API_USERNAME` and `API_PASSWORD` environment variables (defaults: `admin`/`password`).

**Query Parameters:**

- `limit` (optional): Number of games to return (default: 25)

**Example:**

```bash
# Using curl with Basic Auth
curl -u admin:password http://localhost:8000/games?limit=50

# Or with explicit header
curl -H "Authorization: Basic $(echo -n 'admin:password' | base64)" http://localhost:8000/games?limit=50
```

**Response:**

```json
{
  "games": [
    {
      "id": 1,
      "name": "Game Name",
      "release_date": "2023-01-01",
      "estimated_owners": "1000000 - 2000000",
      "required_age": 0,
      "price": 9.99
    }
  ]
}
```

### Frontend Features

The React frontend provides:

- **Authentication**: Login form with username/password authentication
- **Game List Display**: Table view showing all game information
- **Client-Side Search**: Real-time search filtering by game name
- **Limit Control**: Adjust the number of games fetched from the API
- **Responsive Design**: Works on desktop and mobile devices
- **Logout**: Secure logout functionality

**Features:**

- Search games by name (client-side filtering)
- Adjust fetch limit with validation
- Refresh button to reload data
- Loading and error states
- Clean, modern UI

---

## 🛠️ Development

### Backend Development

The backend uses:

- **FastAPI**: Modern Python web framework
- **Neo4j**: Graph database driver
- **Uvicorn**: ASGI server

To run with auto-reload:

```bash
uvicorn app:app --reload
```

### Frontend Development

The frontend uses:

- **React 19**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server

Available scripts:

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

---

## 📝 Notes

- The backend CORS is configured to allow all origins for development. For production, restrict this to specific domains.
- The frontend uses a Vite proxy to forward `/api/*` requests to the backend at `http://localhost:8000`
- Make sure both backend and frontend are running for the full application to work
- The search functionality is client-side only and filters the currently loaded games

---

## 🔧 Troubleshooting

### Backend Issues

- **Connection Error**: Verify your Neo4j credentials in `backend/.env`
- **Port Already in Use**: Change the port with `uvicorn app:app --reload --port 8001`
- **Module Not Found**: Ensure virtual environment is activated and dependencies are installed

### Frontend Issues

- **API Not Found**: Ensure backend is running on `http://localhost:8000`
- **CORS Errors**: Check that CORS middleware is properly configured in `backend/app.py`
- **Build Errors**: Run `npm install` to ensure all dependencies are installed

---

## 📄 License

This project is for educational purposes. The Steam Games dataset is from Kaggle.
