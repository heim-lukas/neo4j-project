interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
  visibleCount: number;
  totalCount: number;
}

const SearchBar = ({
  query,
  onChange,
  visibleCount,
  totalCount,
}: SearchBarProps) => (
  <div className="flex gap-4 items-center justify-center mb-8 p-4 bg-blue-50 rounded-lg flex-wrap">
    <label className="flex items-center gap-2 font-medium">
      Search Games:
      <input
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by game name..."
        className="w-72 px-3 py-2 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </label>
    {query && (
      <span className="text-gray-600 text-sm italic">
        Showing {visibleCount} of {totalCount} games
      </span>
    )}
  </div>
);

export default SearchBar;
