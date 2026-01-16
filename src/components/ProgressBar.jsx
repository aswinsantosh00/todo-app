function ProgressBar({ completed, total, isDarkMode }) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className={`text-sm font-bold transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-black/70'
        }`}>
          Progress
        </span>
        <span className={`text-sm font-black transition-colors duration-300 ${
          isDarkMode ? 'text-yellow-400' : 'text-black'
        }`}>
          {percentage}%
        </span>
      </div>
      <div className={`h-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-700' : 'bg-white'
      }`}>
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
