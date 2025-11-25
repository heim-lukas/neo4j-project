import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchGamesByPublisher } from "../services/api";
import GamesTable from "../components/GamesTable";
import type { Game } from "../types";

const PublisherPage = () => {
  const { name } = useParams<{ name: string }>();
  const publisherName = decodeURIComponent(name ?? "");
  const navigate = useNavigate();
  const { isAuthenticated, getAuthHeader, logout } = useAuth();

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const loadGames = useCallback(async () => {
    const authHeader = getAuthHeader();
    if (!authHeader || !publisherName) {
      setError("Please login again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchGamesByPublisher(publisherName, authHeader);
      setGames(data.games);
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
  }, [publisherName, getAuthHeader, logout]);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  const handleSelectGame = (game: Game) => {
    navigate(`/games/${game.id}`, { state: { game } });
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <p className="text-sm uppercase text-gray-500">Publisher</p>
          <h1 className="text-3xl font-bold text-indigo-600">
            {publisherName}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            to="/"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded font-medium transition-colors hover:bg-gray-200"
          >
            Back to list
          </Link>
          {publisherName && (
            <button
              onClick={loadGames}
              className="px-4 py-2 bg-indigo-600 text-white rounded font-medium transition-colors hover:bg-indigo-700"
            >
              Refresh
            </button>
          )}
        </div>
      </div>

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
        <GamesTable
          games={games}
          onSelectGame={handleSelectGame}
          emptyMessage="No games found for this publisher."
        />
      )}
    </div>
  );
};

export default PublisherPage;

