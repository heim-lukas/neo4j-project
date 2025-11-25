import { useState } from "react";
import ErrorCard from "./ErrorCard";

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
    <div className="h-dvh flex justify-center items-center bg-neutral-content px-5">
      <div className="w-full max-w-[400px] bg-white card shadow-sm p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center">Steam Games</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="input w-full">
            <span className="label">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label className="input w-full">
            <span className="label">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <ErrorCard error={error} />}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-neutral w-full"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
