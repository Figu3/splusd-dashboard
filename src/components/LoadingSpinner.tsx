export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-16 h-16 border-4 border-plasma-border border-t-plasma-accent rounded-full animate-spin" />
      <p className="text-gray-400 mt-4">Loading distribution data...</p>
    </div>
  );
};
