import type {
  Game,
  GamesResponse,
  GameDetail,
  GameDetailResponse,
  PublisherGamesResponse,
  CategoryGamesResponse,
} from "../types";

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized. Please login again.");
    }
    if (response.status === 404) {
      throw new Error("Game not found.");
    }
    throw new Error("Failed to communicate with the API.");
  }
  return (await response.json()) as T;
};

export const fetchGames = async (
  limit: number,
  authHeader: string
): Promise<Game[]> => {
  const response = await fetch(`/api/games?limit=${limit}`, {
    headers: {
      Authorization: authHeader,
    },
  });

  const data = await handleResponse<GamesResponse>(response);
  return data.games;
};

export const fetchGameById = async (
  id: string,
  authHeader: string
): Promise<GameDetail> => {
  const response = await fetch(`/api/games/${id}`, {
    headers: {
      Authorization: authHeader,
    },
  });

  const data = await handleResponse<GameDetailResponse>(response);
  return data.game;
};

export const fetchGamesByPublisher = async (
  publisherName: string,
  authHeader: string,
  limit = 50
): Promise<{ publisher: string; games: Game[] }> => {
  const response = await fetch(
    `/api/publishers/${encodeURIComponent(publisherName)}/games?limit=${limit}`,
    {
      headers: {
        Authorization: authHeader,
      },
    }
  );

  const data = await handleResponse<PublisherGamesResponse>(response);
  return data;
};

export const fetchGamesByCategory = async (
  categoryName: string,
  authHeader: string,
  limit = 50
): Promise<{ category: string; games: Game[] }> => {
  const response = await fetch(
    `/api/categories/${encodeURIComponent(categoryName)}/games?limit=${limit}`,
    {
      headers: {
        Authorization: authHeader,
      },
    }
  );

  const data = await handleResponse<CategoryGamesResponse>(response);
  return data;
};
