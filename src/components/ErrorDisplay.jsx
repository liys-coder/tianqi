export default function ErrorDisplay({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-6" role="alert">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <p className="text-red-700 text-sm">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 rounded-full bg-[#0891B2] text-white text-sm font-medium cursor-pointer
          hover:bg-[#0E7490] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/40"
      >
        重新获取
      </button>
    </div>
  );
}
