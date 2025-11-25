import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchGameById } from "../services/api";
import type { Game, GameDetail } from "../types";

interface LocationState {
  game?: Game;
}

const GameDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, getAuthHeader, logout } = useAuth();

  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const state = location.state as LocationState | null;
    if (state?.game) {
      setGame({
        ...state.game,
        publishers: [],
        genres: [],
        tags: [],
      });
      setLoading(false);
    }
  }, [location.state]);

  useEffect(() => {
    const loadGame = async () => {
      if (!id) return;
      const authHeader = getAuthHeader();
      if (!authHeader) {
        setError("Please login again.");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchGameById(id, authHeader);
        setGame(data);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load game";
        setError(message);
        if (message.toLowerCase().includes("unauthorized")) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [id, getAuthHeader, logout]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-16 text-center text-xl text-gray-600">
        Loading game details...
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-16 text-center">
        <p className="text-red-600 mb-4">{error ?? "Game not found."}</p>
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-indigo-600 text-white rounded font-medium transition-colors hover:bg-indigo-700"
        >
          Back to games list
        </Link>
      </div>
    );
  }

  const handlePublisherClick = (publisher: string) => {
    navigate(`/publishers/${encodeURIComponent(publisher)}`);
  };

  const DetailList = ({ title, items }: { title: string; items: string[] }) =>
    items.length ? (
      <div>
        <p className="text-sm uppercase text-gray-500 mb-1">{title}</p>
        <p className="text-gray-800">{items.join(", ")}</p>
      </div>
    ) : null;

  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-600">{game.name}</h1>
        <Link
          to="/"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded font-medium transition-colors hover:bg-gray-200"
        >
          Back to list
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm uppercase text-gray-500 mb-1">Release Date</p>
            <p className="text-gray-800">
              {game.release_date ?? "Not available"}
            </p>
          </div>
          <div>
            <p className="text-sm uppercase text-gray-500 mb-1">Price</p>
            <p className="text-gray-800">
              {game.price === null || game.price === 0
                ? "Free"
                : `$${game.price.toFixed(2)}`}
            </p>
          </div>
          <div>
            <p className="text-sm uppercase text-gray-500 mb-1">Required Age</p>
            <p className="text-gray-800">{game.required_age ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-sm uppercase text-gray-500 mb-1">
              Estimated Owners
            </p>
            <p className="text-gray-800">
              {game.estimated_owners ?? "Not available"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {game.publishers.length > 0 && (
            <div>
              <p className="text-sm uppercase text-gray-500 mb-1">
                Publishers
              </p>
              <div className="flex flex-wrap gap-2">
                {game.publishers.map((publisher) => (
                  <button
                    key={publisher}
                    onClick={() => handlePublisherClick(publisher)}
                    className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors"
                  >
                    {publisher}
                  </button>
                ))}
              </div>
            </div>
          )}
          <DetailList title="Genres" items={game.genres} />
          <DetailList title="Tags" items={game.tags} />
        </div>
      </div>
    </div>
  );
};

export default GameDetailPage;
