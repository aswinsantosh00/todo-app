import { useState, useEffect, useRef } from 'react';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import ProgressBar from './components/ProgressBar';
import Confetti from './components/Confetti';
import Auth from './components/Auth';
import { useAuth } from './hooks/useAuth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Handle old array format
      if (Array.isArray(parsed)) {
        return { todo: parsed, grocery: [] };
      }
      return parsed;
    }
    return { todo: [], grocery: [] };
  });
  const [listType, setListType] = useState(() => {
    const saved = localStorage.getItem('listType');
    return saved || 'todo';
  });
  const [showListMenu, setShowListMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [deletedTask, setDeletedTask] = useState(null);
  const [deletedTaskIndex, setDeletedTaskIndex] = useState(null);
  const [undoTimer, setUndoTimer] = useState(null);
  const [bgColor, setBgColor] = useState(() => {
    const saved = localStorage.getItem('bgColor');
    return saved || '#f3f4f6';
  });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { user } = useAuth();
  
  // Refs to prevent sync loops
  const isRemoteUpdate = useRef(false);
  const syncTimeoutRef = useRef(null);
  const lastSyncedData = useRef(null);

  // Firebase sync - load tasks from Firestore when user signs in
  useEffect(() => {
    if (!user || !db) return;

    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists() && !isRemoteUpdate.current) {
        const data = docSnapshot.data();
        if (data.tasks) {
          // Mark this as a remote update to prevent sync loop
          isRemoteUpdate.current = true;
          setTasks(data.tasks);
          if (data.listType) {
            setListType(data.listType);
          }
          lastSyncedData.current = JSON.stringify({ tasks: data.tasks, listType: data.listType });
          // Reset flag after state updates
          setTimeout(() => {
            isRemoteUpdate.current = false;
          }, 100);
        }
      }
    }, (error) => {
      console.error('Snapshot error:', error);
    });

    return () => unsubscribe();
  }, [user]);

  // Sync tasks to Firestore when they change (if user is signed in)
  useEffect(() => {
    if (!user || !db || isRemoteUpdate.current) return;

    // Check if data actually changed
    const currentData = JSON.stringify({ tasks, listType });
    if (currentData === lastSyncedData.current) return;

    const syncToFirebase = async () => {
      try {
        setIsSyncing(true);
        isRemoteUpdate.current = true;
        const { setDoc } = await import('firebase/firestore');
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          tasks: tasks,
          listType: listType,
          lastUpdated: new Date().toISOString()
        }, { merge: true });
        lastSyncedData.current = currentData;
        setIsSyncing(false);
        isRemoteUpdate.current = false;
      } catch (error) {
        console.error('Sync error:', error);
        setIsSyncing(false);
        isRemoteUpdate.current = false;
      }
    };

    // Clear previous timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(syncToFirebase, 500);
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [user, tasks, listType]);

  // Grocery categories
  const categorizeGrocery = (itemName) => {
    const categories = {
      'Fruits': ['apple', 'banana', 'orange', 'grape', 'mango', 'strawberry', 'watermelon', 'pineapple', 'peach', 'pear', 'cherry', 'blueberry', 'kiwi', 'lemon', 'lime'],
      'Vegetables': ['carrot', 'potato', 'tomato', 'onion', 'lettuce', 'cucumber', 'broccoli', 'spinach', 'pepper', 'celery', 'cabbage', 'garlic', 'mushroom', 'corn', 'peas'],
      'Dairy': ['milk', 'cheese', 'butter', 'yogurt', 'cream', 'eggs', 'egg'],
      'Meat': ['chicken', 'beef', 'pork', 'fish', 'salmon', 'turkey', 'bacon', 'ham', 'lamb', 'shrimp'],
      'Beverages': ['coffee', 'tea', 'juice', 'soda', 'water', 'beer', 'wine', 'milk'],
      'Bakery': ['bread', 'bagel', 'croissant', 'muffin', 'cake', 'cookie', 'donut'],
      'Pantry': ['rice', 'pasta', 'flour', 'sugar', 'salt', 'oil', 'sauce', 'cereal', 'beans', 'lentils'],
      'Snacks': ['chips', 'crackers', 'nuts', 'popcorn', 'candy', 'chocolate'],
      'Frozen': ['ice cream', 'frozen pizza', 'frozen vegetables', 'frozen fruit'],
      'Other': []
    };

    const itemLower = itemName.toLowerCase();
    for (const [category, items] of Object.entries(categories)) {
      if (items.some(item => itemLower.includes(item))) {
        return category;
      }
    }
    return 'Other';
  };

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('bgColor', bgColor);
  }, [bgColor]);

  useEffect(() => {
    localStorage.setItem('listType', listType);
  }, [listType]);

  useEffect(() => {
    // Cleanup undo timer on unmount
    return () => {
      if (undoTimer) clearTimeout(undoTimer);
    };
  }, [undoTimer]);

  const addTask = (text, subtasks = []) => {
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
      subtasks: subtasks,
      category: listType === 'grocery' ? categorizeGrocery(text) : null,
      type: listType
    };
    setTasks({
      ...tasks,
      [listType]: [newTask, ...tasks[listType]]
    });
  };

  const toggleTask = (id) => {
    setTasks({
      ...tasks,
      [listType]: tasks[listType].map(task => {
        if (task.id === id) {
          const wasCompleted = task.completed;
          if (!wasCompleted && listType === 'todo') {
            // Task is being completed - only show confetti for todo list
            setShowConfetti(true);
          }
          return {
            ...task,
            completed: !task.completed
          };
        }
        return task;
      })
    });
  };

  const deleteTask = (id) => {
    const taskIndex = tasks[listType].findIndex(t => t.id === id);
    const taskToDelete = tasks[listType].find(t => t.id === id);
    if (taskToDelete) {
      // Clear any existing undo timer
      if (undoTimer) clearTimeout(undoTimer);
      
      // Set deleted task, index, and remove from list
      setDeletedTask(taskToDelete);
      setDeletedTaskIndex(taskIndex);
      setTasks({
        ...tasks,
        [listType]: tasks[listType].filter(task => task.id !== id)
      });
      
      // Set timer to clear deleted task after 5 seconds
      const timer = setTimeout(() => {
        setDeletedTask(null);
        setDeletedTaskIndex(null);
      }, 5000);
      setUndoTimer(timer);
    }
  };

  const undoDelete = () => {
    if (deletedTask) {
      setTasks({
        ...tasks,
        [listType]: [deletedTask, ...tasks[listType]]
      });
      setDeletedTask(null);
      setDeletedTaskIndex(null);
      if (undoTimer) {
        clearTimeout(undoTimer);
        setUndoTimer(null);
      }
      showToast('↩️ Task restored!', 'info');
    }
  };

  const editTask = (id, newText) => {
    setTasks({
      ...tasks,
      [listType]: tasks[listType].map(task =>
        task.id === id ? { ...task, text: newText } : task
      )
    });
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks({
      ...tasks,
      [listType]: tasks[listType].map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.map(st =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            )
          };
        }
        return task;
      })
    });
  };

  const activeCount = tasks[listType].filter(t => !t.completed).length;
  const completedCount = tasks[listType].filter(t => t.completed).length;

  const bgThemes = [
    { name: 'Classic Gray', color: '#f3f4f6' },
    { name: 'Soft Yellow', color: '#fef3c7' },
    { name: 'Mint Fresh', color: '#d1fae5' },
    { name: 'Sky Blue', color: '#dbeafe' },
    { name: 'Lavender', color: '#e9d5ff' },
  ];

  return (
    <div 
      className="min-h-screen p-6 sm:p-8 transition-all duration-300 flex flex-col"
      style={{ backgroundColor: isDarkMode ? '#111827' : bgColor }}
    >
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
      
      <main className="max-w-3xl mx-auto flex-1 flex flex-col w-full">
        <div className="sticky top-0 z-40 transition-colors duration-300 pointer-events-none" style={{ backgroundColor: isDarkMode ? '#111827' : bgColor }}>
        <header className="mb-6 sm:mb-8 py-4 sm:py-4 pointer-events-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <div className="relative">
                <div 
                  onClick={() => setShowListMenu(!showListMenu)}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <h1 
                    className={`text-5xl sm:text-6xl md:text-7xl font-black tracking-tight transition-colors duration-300 group-hover:scale-105 ${
                      isDarkMode ? 'text-yellow-400' : 'text-black'
                    }`}
                  >
                    {listType === 'todo' ? 'TO-DO' : 'GROCERIES'}
                  </h1>
                  <svg 
                    className={`w-6 h-6 sm:w-8 sm:h-8 transition-transform duration-200 ${
                      showListMenu ? 'rotate-180' : ''
                    } ${
                      isDarkMode ? 'text-yellow-400' : 'text-black'
                    }`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                {showListMenu && (
                  <div className={`absolute top-full left-0 mt-2 border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-50 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    <button
                      onClick={() => {
                        setListType('todo');
                        setShowListMenu(false);
                      }}
                      className={`block w-full text-left px-6 py-3 font-black text-xl hover:bg-blue-400 transition-colors ${
                        listType === 'todo' ? 'bg-blue-400' : ''
                      }`}
                    >
                      TO-DO
                    </button>
                    <button
                      onClick={() => {
                        setListType('grocery');
                        setShowListMenu(false);
                      }}
                      className={`block w-full text-left px-6 py-3 font-black text-xl hover:bg-green-400 transition-colors border-t-3 border-black ${
                        listType === 'grocery' ? 'bg-green-400' : ''
                      }`}
                    >
                      GROCERIES
                    </button>
                  </div>
                )}
              </div>
              {listType === 'todo' && tasks[listType].length > 0 && (
                <div className={`px-3 py-1 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm font-black transition-colors duration-300 ${
                  isDarkMode ? 'bg-green-400' : 'bg-green-400'
                }`}>
                  {completedCount}/{tasks[listType].length}
                </div>
              )}
            </div>
            <p className={`text-base sm:text-lg font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-black/70'
            }`}>
              {listType === 'todo' ? 'Get things done, one task at a time' : 'Never forget what to buy'}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Auth Component */}
            <Auth isDarkMode={isDarkMode} />
            
            {/* Background Theme Picker - only in light mode */}
            {!isDarkMode && (
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="h-[42px] w-[42px] sm:h-[54px] sm:w-[54px] border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-200 font-bold text-lg sm:text-xl flex items-center justify-center bg-pink-300"
                  aria-label="Change background color"
                >
                  🎨
                </button>
              
              {showColorPicker && (
                <div className={`fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-20 sm:top-full mt-2 p-4 border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-50 animate-slideIn ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className="flex justify-between items-center mb-3 sm:hidden">
                    <h3 className={`font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>Choose Theme</h3>
                    <button 
                      onClick={() => setShowColorPicker(false)}
                      className="px-2 py-1 border-2 border-black bg-red-400 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {bgThemes.map((theme) => (
                      <button
                        key={theme.name}
                        onClick={() => {
                          setBgColor(theme.color);
                          setShowColorPicker(false);
                        }}
                        className={`w-12 h-12 rounded-full border-3 border-black hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-110 active:scale-110 transition-all relative ${
                          bgColor === theme.color ? 'ring-4 ring-black ring-offset-2' : ''
                        }`}
                        style={{ backgroundColor: theme.color }}
                        aria-label={theme.name}
                        title={theme.name}
                      >
                        {bgColor === theme.color && (
                          <span className="absolute inset-0 flex items-center justify-center text-2xl">
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              </div>
            )}

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`h-[42px] w-[42px] sm:h-[54px] sm:w-[54px] border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-200 flex items-center justify-center ${
                isDarkMode ? 'bg-yellow-400' : 'bg-white'
              }`}
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isDarkMode ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                )}
              </svg>
            </button>
          </div>
          </div>
        </header>

        {listType === 'todo' && (
        <div className="pb-4 mb-4 pointer-events-auto">
          <ProgressBar completed={completedCount} total={tasks[listType].length} isDarkMode={isDarkMode} />
        </div>
        )}
        </div>

        <TaskInput onAdd={addTask} isDarkMode={isDarkMode} listType={listType} />

        <TaskList
          tasks={[...tasks[listType]].sort((a, b) => a.completed - b.completed)}
          listType={listType}
          onToggle={toggleTask}
          onToggleSubtask={toggleSubtask}
          onDelete={deleteTask}
          onEdit={editTask}
          isDarkMode={isDarkMode}
          deletedTask={deletedTask}
          deletedTaskIndex={deletedTaskIndex}
          onUndoDelete={undoDelete}
        />

        <footer className={`mt-auto pt-6 pb-4 text-center transition-colors duration-300 border-t-2 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <p className={`text-xs font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Built with <span className="text-red-500 animate-pulse inline-block">❤️</span> by{' '}
            <span className={`font-black ${
              isDarkMode ? 'text-gray-500' : 'text-gray-600'
            }`}>Aswin</span>
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
