interface ErrorCardProps {
  error: string;
}

const ErrorCard = ({ error }: ErrorCardProps) => {
  return (
    <div className="bg-red-100 text-red-700 px-4 py-3 rounded text-sm">
      {error}
    </div>
  );
};

export default ErrorCard;
