import type { Game } from "../types";

interface GamesTableProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
  emptyMessage?: string;
}

const formatPrice = (price: number | null) => {
  if (price === null || price === 0) return "Free";
  return `$${price.toFixed(2)}`;
};

const formatDate = (date: string | null) => {
  if (!date) return "N/A";
  return date;
};

const GamesTable = ({
  games,
  onSelectGame,
  emptyMessage = 'No games found. Click "Fetch Games" to load data.',
}: GamesTableProps) => {
  if (games.length === 0) {
    return <p className="text-center py-8 text-gray-500">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Release Date</th>
            <th>Price</th>
            <th>Required Age</th>
            <th>Estimated Owners</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr
              key={game.id}
              className="cursor-pointer hover:bg-primary-content"
              onClick={() => onSelectGame(game)}
            >
              <td>{game.id}</td>
              <td className="max-w-xs truncate">{game.name}</td>
              <td>{formatDate(game.release_date)}</td>
              <td>{formatPrice(game.price)}</td>
              <td>{game.required_age ?? "N/A"}</td>
              <td>{game.estimated_owners ?? "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GamesTable;
