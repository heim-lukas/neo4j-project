import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import Controls from "../components/Controls";
import SearchBar from "../components/SearchBar";
import GamesTable from "../components/GamesTable";
import { useAuth } from "../context/AuthContext";
import { fetchGames } from "../services/api";
import type { Game } from "../types";

const HomePage = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    authLoading,
    authError,
    login,
    logout,
    clearAuthError,
    getAuthHeader,
  } = useAuth();

  const [allGames, setAllGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [limit, setLimit] = useState("25");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredGames(allGames);
      return;
    }
    const lowerQuery = searchQuery.toLowerCase();
    setFilteredGames(
      allGames.filter((game) => game.name.toLowerCase().includes(lowerQuery))
    );
  }, [searchQuery, allGames]);

  const handleLimitChange = (value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      setLimit(value);
    }
  };

  const handleLimitBlur = () => {
    const limitNum = parseInt(limit, 10);
    if (!limit || isNaN(limitNum) || limitNum < 1) {
      setLimit("25");
    }
  };

  const handleFetchGames = async () => {
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1) {
      setError("Please enter a valid number greater than 0");
      return;
    }

    const authHeader = getAuthHeader();
    if (!authHeader) {
      setError("Please login first.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const games = await fetchGames(limitNum, authHeader);
      setAllGames(games);
      setFilteredGames(games);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch games");
      if (
        err instanceof Error &&
        err.message.toLowerCase().includes("unauthorized")
      ) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    clearAuthError();
    setError(null);
    await login(username, password);
  };

  const handleSelectGame = (game: Game) => {
    navigate(`/games/${game.id}`, { state: { game } });
  };

  const tableEmptyMessage = useMemo(() => {
    if (!allGames.length) {
      return 'No games found. Click "Fetch Games" to load data.';
    }
    if (!filteredGames.length) {
      return "No games found matching your search.";
    }
    return undefined;
  }, [allGames.length, filteredGames.length]);

  if (!isAuthenticated) {
    return (
      <LoginForm
        onLogin={handleLogin}
        loading={authLoading}
        error={authError}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
        <h1 className="text-4xl font-bold text-indigo-600">Steam Games</h1>
        <button
          onClick={() => {
            logout();
            setAllGames([]);
            setFilteredGames([]);
            setSearchQuery("");
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded font-medium transition-colors hover:bg-gray-600"
        >
          Logout
        </button>
      </div>

      <Controls
        limit={limit}
        onLimitChange={handleLimitChange}
        onLimitBlur={handleLimitBlur}
        onFetch={handleFetchGames}
        loading={loading}
      />

      <SearchBar
        query={searchQuery}
        onChange={setSearchQuery}
        visibleCount={filteredGames.length}
        totalCount={allGames.length}
      />

      {(error || authError) && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-center">
          {error || authError}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-xl text-gray-600">
          Loading games...
        </div>
      ) : (
        <GamesTable
          games={filteredGames}
          onSelectGame={handleSelectGame}
          emptyMessage={tableEmptyMessage}
        />
      )}
    </div>
  );
};

export default HomePage;
