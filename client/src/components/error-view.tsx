interface ErrorViewProps {
  error: Error;
  onRetry: () => void;
}

export function ErrorView({ error, onRetry }: ErrorViewProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex-1">
      <div className="flex flex-col items-center justify-center h-full">
        <span className="material-icons text-red-500 text-5xl mb-4">error_outline</span>
        <h3 className="text-lg font-medium text-center mb-2">Something went wrong</h3>
        <p className="text-gray-500 text-center mb-6">
          {error.message || "We couldn't process your request. Please try again."}
        </p>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition duration-200"
          onClick={onRetry}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
