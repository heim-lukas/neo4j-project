import { useState, useEffect } from "react";

interface Game {
  id: number;
  name: string;
  release_date: string | null;
  estimated_owners: string | null;
  required_age: number | null;
  price: number | null;
}

interface GamesResponse {
  games: Game[];
}

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [allGames, setAllGames] = useState<Game[]>([]); // Store all fetched games
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<string>("25");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const fetchGames = async () => {
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1) {
      setError("Please enter a valid number greater than 0");
      return;
    }

    if (!isAuthenticated || !username || !password) {
      setError("Please login first");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Create Basic Auth header
      const credentials = btoa(`${username}:${password}`);
      const response = await fetch(`/api/games?limit=${limitNum}`, {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        setError("Invalid credentials. Please login again.");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch games");
      }

      const data: GamesResponse = await response.json();
      setAllGames(data.games);
      setGames(data.games);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    // Test credentials by making a request
    setLoading(true);
    setError(null);
    try {
      const credentials = btoa(`${username}:${password}`);
      const response = await fetch("/api/games?limit=1", {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });

      if (response.status === 401) {
        setError("Invalid username or password");
        setIsAuthenticated(false);
      } else if (response.ok) {
        setIsAuthenticated(true);
        setError(null);
      } else {
        throw new Error("Failed to authenticate");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Filter games based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setGames(allGames);
    } else {
      const filtered = allGames.filter((game) =>
        game.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setGames(filtered);
    }
  }, [searchQuery, allGames]);

  const formatPrice = (price: number | null) => {
    if (price === null || price === 0) return "Free";
    return `$${price.toFixed(2)}`;
  };

  const formatDate = (date: string | null) => {
    if (!date) return "N/A";
    return date;
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string, numbers, and validate on blur/submit
    if (value === "" || /^\d+$/.test(value)) {
      setLimit(value);
    }
  };

  const handleLimitBlur = () => {
    const limitNum = parseInt(limit, 10);
    if (limit === "" || isNaN(limitNum) || limitNum < 1) {
      setLimit("25"); // Reset to default if invalid
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-8 py-16">
        <h1 className="text-center text-4xl font-bold text-indigo-600 mb-8">
          Steam Games API
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Login Required
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter password"
                required
              />
            </div>
            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-2 bg-indigo-600 text-white rounded font-medium transition-colors hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-600">Steam Games</h1>
        <button
          onClick={() => {
            setIsAuthenticated(false);
            setUsername("");
            setPassword("");
            setGames([]);
            setAllGames([]);
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded font-medium transition-colors hover:bg-gray-600"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-4 items-center justify-center mb-8 p-4 bg-gray-100 rounded-lg">
        <label className="flex items-center gap-2 font-medium">
          Limit:
          <input
            type="text"
            value={limit}
            onChange={handleLimitChange}
            onBlur={handleLimitBlur}
            placeholder="25"
            className="w-20 px-2 py-1 border border-gray-300 rounded"
          />
        </label>
        <button
          onClick={fetchGames}
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded font-medium transition-colors hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Fetch Games"}
        </button>
      </div>

      <div className="flex gap-4 items-center justify-center mb-8 p-4 bg-blue-50 rounded-lg flex-wrap">
        <label className="flex items-center gap-2 font-medium">
          Search Games:
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by game name..."
            className="w-72 px-3 py-2 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </label>
        {searchQuery && (
          <span className="text-gray-600 text-sm italic">
            Showing {games.length} of {allGames.length} games
          </span>
        )}
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-center">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-xl text-gray-600">
          Loading games...
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          {games.length === 0 ? (
            <p className="text-center py-8 text-gray-600">
              {searchQuery
                ? "No games found matching your search"
                : 'No games found. Click "Fetch Games" to load data.'}
            </p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Release Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Price</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Required Age
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Estimated Owners
                  </th>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => (
                  <tr
                    key={game.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">{game.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">
                      {game.name}
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(game.release_date)}
                    </td>
                    <td className="px-4 py-3">{formatPrice(game.price)}</td>
                    <td className="px-4 py-3">{game.required_age ?? "N/A"}</td>
                    <td className="px-4 py-3">
                      {game.estimated_owners ?? "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
