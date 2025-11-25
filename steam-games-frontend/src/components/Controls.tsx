interface ControlsProps {
  limit: string;
  onLimitChange: (value: string) => void;
  onFetch: () => void;
  loading: boolean;
}

const Controls = ({
  limit,
  onLimitChange,
  onFetch,
  loading,
}: ControlsProps) => {
  // Predefined limits from 50 to 500
  const options = Array.from({ length: 10 }, (_, i) => (i + 1) * 50);

  return (
    <div className="flex flex-row gap-4 items-center justify-center p-4 bg-base-200 rounded-lg shadow-md">
      <div className="form-control">
        <select
          defaultValue="Limit"
          className="select"
          value={limit}
          onChange={(e) => onLimitChange(e.target.value)}
        >
          <option disabled={true}>Limit</option>
          {options.map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={onFetch}
        disabled={loading}
        className="btn btn-soft btn-primary"
      >
        {loading ? "Loading..." : "Fetch Games"}
      </button>
    </div>
  );
};

export default Controls;
