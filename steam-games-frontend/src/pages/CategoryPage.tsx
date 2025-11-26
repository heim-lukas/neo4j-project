import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchGamesByCategory } from "../services/api";
import GamesTable from "../components/GamesTable";
import SearchBar from "../components/SearchBar";
import type { Game } from "../types";

const CategoryPage = () => {
  const { name } = useParams<{ name: string }>();
  const categoryName = decodeURIComponent(name ?? "");
  const navigate = useNavigate();
  const { isAuthenticated, getAuthHeader, logout } = useAuth();

  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const loadGames = useCallback(async () => {
    const authHeader = getAuthHeader();
    if (!authHeader || !categoryName) {
      setError("Please login again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchGamesByCategory(categoryName, authHeader);
      setGames(data.games);
      setFilteredGames(data.games);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load games";
      setError(message);
      if (message.toLowerCase().includes("unauthorized")) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [categoryName, getAuthHeader, logout]);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredGames(games);
      return;
    }
    const lowerQuery = searchQuery.toLowerCase();
    setFilteredGames(
      games.filter((game) => game.name.toLowerCase().includes(lowerQuery))
    );
  }, [searchQuery, games]);

  const tableEmptyMessage = useMemo(() => {
    if (!games.length) {
      return "No games found for this category.";
    }
    if (!filteredGames.length) {
      return "No games match your search.";
    }
    return undefined;
  }, [games.length, filteredGames.length]);

  const handleSelectGame = (game: Game) => {
    navigate(`/games/${game.id}`, { state: { game } });
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <p className="text-sm uppercase text-gray-500">Category</p>
          <h1 className="text-4xl font-bold text-primary">{categoryName}</h1>
        </div>
        <div className="flex gap-2">
          <Link
            to="/"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded font-medium transition-colors hover:bg-gray-200"
          >
            Back to list
          </Link>
          <button onClick={loadGames} className="btn btn-soft btn-primary">
            Refresh
          </button>
        </div>
      </div>

      <SearchBar query={searchQuery} onChange={setSearchQuery} />

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-xl text-gray-600">
          Loading games...
        </div>
      ) : (
        <div className="card bg-base-100 shadow mt-6">
          <GamesTable
            games={filteredGames}
            onSelectGame={handleSelectGame}
            emptyMessage={tableEmptyMessage}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
