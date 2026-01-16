function FilterButtons({ filter, onFilterChange, activeCount, isDarkMode }) {
  const filters = [
    { value: 'all', label: 'ALL' },
    { value: 'active', label: 'ACTIVE' },
    { value: 'completed', label: 'COMPLETED' }
  ];

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-3">
        {filters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={`px-3 sm:px-5 py-2 sm:py-3 text-sm sm:text-lg font-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:scale-105 active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-200 focus:outline-none ${
              filter === value
                ? 'bg-green-400 text-black'
                : (isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black')
            }`}
            aria-pressed={filter === value}
            aria-label={`Show ${label.toLowerCase()} tasks`}
          >
            {label}
          </button>
        ))}
      </div>
      <p className={`text-sm font-bold transition-colors duration-300 ${
        isDarkMode ? 'text-gray-400' : 'text-black/70'
      }`}>
        {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
      </p>
    </div>
  );
}

export default FilterButtons;
