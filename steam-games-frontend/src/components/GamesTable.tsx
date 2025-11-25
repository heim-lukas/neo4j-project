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
    return <p className="text-center py-8 text-gray-600">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-indigo-600 text-white">
            <th className="px-4 py-3 text-left font-semibold">ID</th>
            <th className="px-4 py-3 text-left font-semibold">Name</th>
            <th className="px-4 py-3 text-left font-semibold">Release Date</th>
            <th className="px-4 py-3 text-left font-semibold">Price</th>
            <th className="px-4 py-3 text-left font-semibold">Required Age</th>
            <th className="px-4 py-3 text-left font-semibold">
              Estimated Owners
            </th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr
              key={game.id}
              className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onSelectGame(game)}
            >
              <td className="px-4 py-3">{game.id}</td>
              <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">
                {game.name}
              </td>
              <td className="px-4 py-3">{formatDate(game.release_date)}</td>
              <td className="px-4 py-3">{formatPrice(game.price)}</td>
              <td className="px-4 py-3">{game.required_age ?? "N/A"}</td>
              <td className="px-4 py-3">{game.estimated_owners ?? "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GamesTable;
