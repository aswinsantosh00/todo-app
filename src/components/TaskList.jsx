import { useState, useRef, useEffect } from 'react';

function TaskItem({ task, onToggle, onToggleSubtask, onDelete, onEdit, isDarkMode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.text);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const itemRef = useRef(null);

  const playPencilSound = () => {
    const audio = new Audio('/pencil-stroke.mp3');
    audio.volume = 0.3;
    audio.playbackRate = 1.5;
    audio.currentTime = 0.3;
    audio.play().catch(err => console.log('Audio play failed:', err));
  };

  const handleToggle = () => {
    if (!task.completed) {
      playPencilSound();
      // Haptic feedback - light tap
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
    onToggle(task.id);
  };

  const handleDelete = () => {
    // Haptic feedback - stronger vibration for delete
    if (navigator.vibrate) {
      navigator.vibrate([30, 50, 30]);
    }
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(task.id);
    }, 500);
  };

  const handleEdit = () => {
    if (editValue.trim() && editValue !== task.text) {
      onEdit(task.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditValue(task.text);
      setIsEditing(false);
    }
  };

  const isLongText = task.text.length > 50;
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const completedSubtasks = hasSubtasks ? task.subtasks.filter(st => st.completed).length : 0;
  const totalSubtasks = hasSubtasks ? task.subtasks.length : 0;

  // Handle touch events for swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchCurrentX.current = e.touches[0].clientX;
    const diff = touchStartX.current - touchCurrentX.current;
    
    // Allow swipe from right to left (diff > 0) for actions
    if (diff > 0 && diff <= 120) {
      setSwipeOffset(diff);
    } else if (diff < 0 && showActions) {
      // Swipe right when actions are shown - hide actions
      const newOffset = Math.max(0, 120 + diff);
      setSwipeOffset(newOffset);
    } else if (diff < 0 && !showActions && diff >= -120) {
      // Swipe right from normal position - indicate completion
      setSwipeOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchCurrentX.current;
    
    // Swipe left to right (negative diff) to complete task
    if (diff < -60 && !showActions) {
      handleToggle();
      setSwipeOffset(0);
    } else if (swipeOffset > 60) {
      // Swipe right to left - show actions
      setSwipeOffset(120);
      setShowActions(true);
    } else {
      // Snap back to normal
      setSwipeOffset(0);
      setShowActions(false);
    }
    touchCurrentX.current = 0;
  };

  // Close actions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (itemRef.current && !itemRef.current.contains(e.target)) {
        setSwipeOffset(0);
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showActions]);

  return (
    <li 
      ref={itemRef}
      className={`relative flex items-center gap-3 sm:gap-3 py-2 sm:py-2 group transition-colors duration-200 overflow-visible ${
      isDeleting ? 'animate-fadeOut' : 'animate-slideIn'
    }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="flex-1 min-w-0"
        style={{
          transform: `translateX(-${swipeOffset}px)`,
          transition: touchCurrentX.current ? 'none' : 'transform 0.3s ease'
        }}
      >
      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleEdit}
          onKeyDown={handleKeyDown}
          className={`flex-1 w-full px-2 sm:px-3 py-1.5 sm:py-2 text-base sm:text-lg font-semibold border-2 border-black focus:outline-none break-words ${
            isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'
          }`}
          autoFocus
          aria-label="Edit task"
        />
      ) : (
        <div className="flex-1 min-w-0 w-full relative">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggle}
              className="mt-1 w-5 h-5 border-3 border-black cursor-pointer accent-green-500 flex-shrink-0"
              aria-label={`Mark "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
            />
            <div className="flex-1 min-w-0">
              <div
                onClick={() => hasSubtasks && setShowSubtasks(!showSubtasks)}
                onMouseEnter={() => isLongText && setShowFullText(true)}
                onMouseLeave={() => setShowFullText(false)}
                className={`cursor-pointer py-1 transition-all duration-200 ${
                  hasSubtasks ? 'hover:pl-1' : ''
                }`}
              >
                <span 
                  className={`relative inline-block text-base sm:text-lg font-semibold break-words word-break transition-colors duration-300 ${
                    task.completed 
                      ? (isDarkMode ? 'text-gray-500' : 'text-gray-500')
                      : (isDarkMode ? 'text-gray-200' : 'text-black')
                  }`}
                  style={{
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'normal',
                    ...(task.completed ? {
                      textDecoration: 'line-through',
                      textDecorationColor: '#666',
                      textDecorationThickness: '2.5px',
                      textDecorationStyle: 'solid',
                      animation: 'fadeInStrike 0.6s ease-out'
                    } : {})
                  }}
                >
                  {task.text}
                  
                  {/* Animated strike line while swiping */}
                  {swipeOffset < 0 && !task.completed && (
                    <div 
                      className="absolute inset-0 flex items-center pointer-events-none"
                      style={{
                        width: `${Math.min(100, Math.abs(swipeOffset / 120) * 100)}%`,
                        overflow: 'hidden'
                      }}
                    >
                      <div 
                        className="absolute left-0 top-1/2 h-0.5 bg-black"
                        style={{
                          width: '100%',
                          transform: 'translateY(-50%)'
                        }}
                      />
                    </div>
                  )}
                </span>
                
                {/* Subtask count */}
                {hasSubtasks && (
                  <div className={`text-xs font-medium mt-1 flex items-center gap-1 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
                    <span className="text-xs">{showSubtasks ? '▼' : '▶'}</span>
                  </div>
                )}
              </div>
              
              {/* Subtasks list */}
              {hasSubtasks && showSubtasks && (
                <div className="mt-2 ml-4 space-y-1">
                  {task.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => onToggleSubtask(task.id, subtask.id)}
                        className="w-4 h-4 border-2 border-black cursor-pointer accent-blue-500"
                      />
                      <span className={`text-sm font-medium ${
                        subtask.completed
                          ? (isDarkMode ? 'text-gray-500 line-through' : 'text-gray-500 line-through')
                          : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                      }`}>
                        {subtask.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Hover preview for long text */}
          {showFullText && isLongText && (
            <div className={`absolute z-10 left-0 top-full mt-2 p-3 border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-sm animate-fadeIn ${
              isDarkMode ? 'bg-yellow-400' : 'bg-yellow-400'
            }`}>
              <p className="text-sm font-bold text-black">{task.text}</p>
            </div>
          )}
        </div>
      )}
      </div>

      {/* Action buttons - positioned absolutely on the right */}
      <div 
        className={`absolute right-0 flex gap-1.5 transition-opacity duration-200 ${
          showActions ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'
        }`}
      >
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs bg-purple-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-110 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:scale-105 transition-all duration-200 focus:outline-none"
            aria-label={`Edit "${task.text}"`}
          >
            ✏️
          </button>
        )}
        <button
          onClick={handleDelete}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs bg-red-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-110 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:scale-105 transition-all duration-200 focus:outline-none"
          aria-label={`Delete "${task.text}"`}
        >
          🗑️
        </button>
      </div>
    </li>
  );
}

function TaskList({ tasks, listType, onToggle, onToggleSubtask, onDelete, onEdit, isDarkMode }) {
  if (tasks.length === 0) {
    return (
      <div className="p-8 sm:p-12 text-center animate-fadeIn">
        <div className="mb-4 text-6xl">📝</div>
        <p className={`text-xl sm:text-2xl font-black mb-2 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Your {listType === 'grocery' ? 'grocery' : 'task'} list is empty!
        </p>
        <p className={`text-sm sm:text-base font-bold transition-colors duration-300 ${
          isDarkMode ? 'text-gray-600' : 'text-gray-400'
        }`}>
          Click the + button to add your first {listType === 'grocery' ? 'item' : 'task'} ✨
        </p>
      </div>
    );
  }

  // Group groceries by category
  if (listType === 'grocery') {
    const categories = {};
    tasks.forEach(task => {
      const category = task.category || 'Other';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(task);
    });

    return (
      <div className="space-y-6">
        {Object.entries(categories).map(([category, categoryTasks]) => (
          <div key={category}>
            <h3 className={`text-xl font-black mb-3 ${
              isDarkMode ? 'text-yellow-400' : 'text-black'
            }`}>
              {category}
            </h3>
            <ul className="space-y-2" role="list">
              {categoryTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onToggleSubtask={onToggleSubtask}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  isDarkMode={isDarkMode}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ul className="space-y-0.5" role="list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onToggleSubtask={onToggleSubtask}
          onDelete={onDelete}
          onEdit={onEdit}
          isDarkMode={isDarkMode}
        />
      ))}
    </ul>
  );
}

export default TaskList;
