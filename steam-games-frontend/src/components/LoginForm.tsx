import { useState } from "react";

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const LoginForm = ({ onLogin, loading, error }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onLogin(username, password);
  };

  return (
    <div className="max-w-md mx-auto px-8 py-16">
      <h1 className="text-center text-4xl font-bold text-indigo-600 mb-8">
        Steam Games API
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Login Required
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
};

export default LoginForm;
