import { useState } from 'react';

function TaskInput({ onAdd, isDarkMode, listType }) {
  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskInput, setSubtaskInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim(), subtasks);
      setInputValue('');
      setSubtasks([]);
      setSubtaskInput('');
      setShowInput(false);
    }
  };

  const addSubtask = () => {
    if (subtaskInput.trim()) {
      setSubtasks([...subtasks, { id: Date.now(), text: subtaskInput.trim(), completed: false }]);
      setSubtaskInput('');
    }
  };

  const removeSubtask = (id) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };

  const handleKeyDown = (e) => {
    // Escape key closes input
    if (e.key === 'Escape') {
      setInputValue('');
      setShowInput(false);
    }
  };

  if (!showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        className="fixed bottom-8 right-8 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-500 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:scale-110 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-105 transition-all duration-200 focus:outline-none flex items-center justify-center z-50"
        aria-label="Add new task"
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <form onSubmit={handleSubmit} className="w-full max-w-md my-8">
        <div className="flex flex-col gap-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={listType === 'grocery' ? 'What do you need to buy?' : 'What needs to be done?'}
            className={`w-full px-4 py-3 text-base sm:text-lg font-semibold border-3 border-black focus:outline-none transition-all duration-200 resize-none min-h-[80px] ${
              isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-black'
            }`}
            aria-label={listType === 'grocery' ? 'New grocery item' : 'New task'}
            autoFocus
            rows={3}
          />
          
          {/* Subtasks section - only show for todo */}
          {listType === 'todo' && (
            <div className={`p-4 border-2 border-black mt-3 ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSubtask();
                  }
                }}
                placeholder="Add subtask (optional)"
                className={`flex-1 px-3 py-2 text-sm border-2 border-black focus:outline-none ${
                  isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-black'
                }`}
              />
              <button
                type="button"
                onClick={addSubtask}
                className="px-3 py-2 text-sm font-black bg-green-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all duration-200"
              >
                +
              </button>
            </div>
            {subtasks.length > 0 && (
              <div className="space-y-1">
                {subtasks.map((st) => (
                  <div key={st.id} className={`flex items-center gap-2 p-2 border border-black ${
                    isDarkMode ? 'bg-gray-700' : 'bg-white'
                  }`}>
                    <span className="flex-1 text-sm font-medium">{st.text}</span>
                    <button
                      type="button"
                      onClick={() => removeSubtask(st.id)}
                      className="text-red-500 text-xs font-bold hover:scale-110"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}
          
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-6 py-3 text-base sm:text-lg font-black bg-blue-400 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-200 focus:outline-none"
              aria-label="Add task"
            >
              ADD
            </button>
            <button
              type="button"
              onClick={() => {
                setInputValue('');
                setShowInput(false);
              }}
              className="flex-1 px-6 py-3 text-base sm:text-lg font-black bg-gray-400 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-200 focus:outline-none"
              aria-label="Cancel"
            >
              CANCEL
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default TaskInput;
