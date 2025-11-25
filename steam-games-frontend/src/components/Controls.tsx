interface ControlsProps {
  limit: string;
  onLimitChange: (value: string) => void;
  onLimitBlur: () => void;
  onFetch: () => void;
  loading: boolean;
}

const Controls = ({
  limit,
  onLimitChange,
  onLimitBlur,
  onFetch,
  loading,
}: ControlsProps) => (
  <div className="flex gap-4 items-center justify-center mb-8 p-4 bg-gray-100 rounded-lg">
    <label className="flex items-center gap-2 font-medium">
      Limit:
      <input
        type="text"
        value={limit}
        onChange={(e) => onLimitChange(e.target.value)}
        onBlur={onLimitBlur}
        placeholder="25"
        className="w-20 px-2 py-1 border border-gray-300 rounded"
      />
    </label>
    <button
      onClick={onFetch}
      disabled={loading}
      className="px-6 py-2 bg-indigo-600 text-white rounded font-medium transition-colors hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {loading ? "Loading..." : "Fetch Games"}
    </button>
  </div>
);

export default Controls;
