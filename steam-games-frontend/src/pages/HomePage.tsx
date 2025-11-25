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
    if (!isAuthenticated) return;

    const fetchInitialGames = async () => {
      await handleFetchGames();
    };

    fetchInitialGames();
  }, [isAuthenticated]);

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
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-4xl font-bold">Steam Games</h1>
        <button
          onClick={() => {
            logout();
            setAllGames([]);
            setFilteredGames([]);
            setSearchQuery("");
          }}
          className="btn btn-neutral"
        >
          Logout
        </button>
      </div>

      <div className="card bg-base-100 mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <Controls
          limit={limit}
          onLimitChange={setLimit}
          onFetch={handleFetchGames}
          loading={loading}
        />

        <SearchBar query={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Error message */}
      {(error || authError) && (
        <div className="alert alert-error mb-4">
          <span>{error || authError}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-ring loading-xl"></span>
        </div>
      ) : (
        <div className="card bg-base-100 shadow">
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

export default HomePage;
