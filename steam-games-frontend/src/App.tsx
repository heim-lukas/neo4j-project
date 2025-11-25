import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import GameDetailPage from "./pages/GameDetailPage";
import PublisherPage from "./pages/PublisherPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/games/:id" element={<GameDetailPage />} />
          <Route path="/publishers/:name" element={<PublisherPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
