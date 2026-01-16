function TaskStats({ tasks, isDarkMode, onClose }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  // Count tasks completed today
  const today = new Date().toDateString();
  const completedToday = tasks.filter(t => {
    if (!t.completedAt) return false;
    return new Date(t.completedAt).toDateString() === today;
  }).length;

  const stats = [
    { label: 'Total', value: total, color: 'bg-blue-400' },
    { label: 'Active', value: active, color: 'bg-yellow-400' },
    { label: 'Completed', value: completed, color: 'bg-green-400' },
    { label: 'Today', value: completedToday, color: 'bg-purple-400' },
  ];

  return (
    <div className={`border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 p-4 transition-colors duration-300 relative animate-slideIn ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-black transition-colors duration-300 ${
          isDarkMode ? 'text-gray-200' : 'text-black'
        }`}>
          📊 STATISTICS
        </h2>
        <button
          onClick={onClose}
          className={`px-3 py-1 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold ${
            isDarkMode ? 'bg-red-500 text-white' : 'bg-red-300'
          }`}
          aria-label="Close statistics"
        >
          ✕
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.color} border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 text-center`}
          >
            <div className="text-2xl sm:text-3xl font-black mb-1">{stat.value}</div>
            <div className="text-xs font-bold uppercase">{stat.label}</div>
          </div>
        ))}
      </div>
      {total > 0 && (
        <div className={`mt-4 text-center text-sm font-bold transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-black/70'
        }`}>
          Completion Rate: {completionRate}%
        </div>
      )}
    </div>
  );
}

export default TaskStats;
