import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

interface AuthContextValue {
  username: string;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearAuthError: () => void;
  getAuthHeader: () => string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const buildAuthToken = (username: string, password: string) =>
  `Basic ${btoa(`${username}:${password}`)}`;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const login = useCallback(async (user: string, pass: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const credentials = buildAuthToken(user, pass);
      const response = await fetch("/api/games?limit=1", {
        headers: {
          Authorization: credentials,
        },
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      setUsername(user);
      setPassword(pass);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      setIsAuthenticated(false);
      setAuthError(
        error instanceof Error ? error.message : "Failed to authenticate"
      );
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = () => {
    setUsername("");
    setPassword("");
    setIsAuthenticated(false);
    setAuthError(null);
  };

  const clearAuthError = () => setAuthError(null);

  const getAuthHeader = useCallback(() => {
    if (!isAuthenticated || !username || !password) return null;
    return buildAuthToken(username, password);
  }, [isAuthenticated, username, password]);

  return (
    <AuthContext.Provider
      value={{
        username,
        isAuthenticated,
        authLoading,
        authError,
        login,
        logout,
        clearAuthError,
        getAuthHeader,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
