interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ query, onChange }: SearchBarProps) => (
  <div className="w-full sm:w-1/3 p-4 bg-base-200 rounded-lg shadow-md">
    <label>
      <input
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by game name..."
        className="input w-full px-3 py-2 border border-gray-300 rounded text-base"
      />
    </label>
  </div>
);

export default SearchBar;
