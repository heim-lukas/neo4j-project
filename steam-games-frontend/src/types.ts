export interface Game {
  id: number;
  name: string;
  release_date: string | null;
  estimated_owners: string | null;
  required_age: number | null;
  price: number | null;
}

export interface GameDetail extends Game {
  publishers: string[];
  genres: string[];
  tags: string[];
}

export interface GamesResponse {
  games: Game[];
}

export interface GameDetailResponse {
  game: GameDetail;
}

export interface PublisherGamesResponse {
  publisher: string;
  games: Game[];
}

export interface CategoryGamesResponse {
  category: string;
  games: Game[];
}
