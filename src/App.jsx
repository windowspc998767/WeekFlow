import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Trophy, 
  Zap,
  Calendar,
  ListTodo
} from 'lucide-react';
import './App.css';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const PRIORITIES = {
  basic: { label: 'Basic', xp: 100, icon: '○' },
  need: { label: 'Need', xp: 200, icon: '◐' },
  important: { label: 'Important', xp: 300, icon: '●' }
};

const LEVEL_RANKS = [
  { level: 1, title: 'Beginner', xpRequired: 0, color: '#9ca3af', icon: '🌱' },
  { level: 2, title: 'Learner', xpRequired: 500, color: '#10b981', icon: '🌿' },
  { level: 3, title: 'Novice', xpRequired: 1200, color: '#10b981', icon: '🍀' },
  { level: 4, title: 'Apprentice', xpRequired: 2000, color: '#3b82f6', icon: '⭐' },
  { level: 5, title: 'Skilled', xpRequired: 3000, color: '#3b82f6', icon: '✨' },
  { level: 6, title: 'Adept', xpRequired: 4500, color: '#8b5cf6', icon: '💫' },
  { level: 7, title: 'Expert', xpRequired: 6500, color: '#8b5cf6', icon: '🌟' },
  { level: 8, title: 'Master', xpRequired: 9000, color: '#f59e0b', icon: '🏆' },
  { level: 9, title: 'Champion', xpRequired: 12000, color: '#f59e0b', icon: '👑' },
  { level: 10, title: 'Legend', xpRequired: 16000, color: '#ef4444', icon: '🔥' },
  { level: 11, title: 'Mythic', xpRequired: 21000, color: '#ef4444', icon: '⚡' },
  { level: 12, title: 'Divine', xpRequired: 27000, color: '#ec4899', icon: '💎' },
  { level: 13, title: 'Supreme', xpRequired: 35000, color: '#ec4899', icon: '🌠' },
  { level: 14, title: 'Ultimate', xpRequired: 45000, color: '#a855f7', icon: '🎯' },
  { level: 15, title: 'Transcendent', xpRequired: 60000, color: '#a855f7', icon: '🌌' }
];

// Function to calculate current level based on XP
function calculateLevel(xp) {
  let currentRank = LEVEL_RANKS[0];
  let nextRank = LEVEL_RANKS[1];
  
  for (let i = LEVEL_RANKS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_RANKS[i].xpRequired) {
      currentRank = LEVEL_RANKS[i];
      nextRank = LEVEL_RANKS[i + 1] || null;
      break;
    }
  }
  
  const xpInCurrentLevel = xp - currentRank.xpRequired;
  const xpNeededForNext = nextRank ? nextRank.xpRequired - currentRank.xpRequired : 0;
  const progressPercentage = nextRank ? (xpInCurrentLevel / xpNeededForNext) * 100 : 100;
  
  return {
    currentRank,
    nextRank,
    xpInCurrentLevel,
    xpNeededForNext,
    progressPercentage
  };
}

function App() {
  const [currentDay, setCurrentDay] = useState(new Date().getDay());
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('weekflow-tasks');
    return saved ? JSON.parse(saved) : initializeTasks();
  });
  const [totalXP, setTotalXP] = useState(() => {
    const saved = localStorage.getItem('weekflow-xp');
    return saved ? parseInt(saved) : 0;
  });
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('basic');
  const [lastResetDate, setLastResetDate] = useState(() => {
    const saved = localStorage.getItem('weekflow-last-reset');
    return saved ? saved : new Date().toDateString();
  });
  const [showXPNotification, setShowXPNotification] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(null);

  // Initialize tasks structure for all days
  function initializeTasks() {
    const taskStructure = {};
    DAYS_OF_WEEK.forEach((_, index) => {
      taskStructure[index] = [];
    });
    return taskStructure;
  }

  // Check if a new day has started and reset tasks
  useEffect(() => {
    const checkNewDay = () => {
      const today = new Date().toDateString();
      const currentDayOfWeek = new Date().getDay();
      
      if (today !== lastResetDate) {
        // New day detected - reset previous day's tasks to incomplete
        const previousDay = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
        
        setTasks(prevTasks => {
          const updatedTasks = { ...prevTasks };
          updatedTasks[previousDay] = updatedTasks[previousDay].map(task => ({
            ...task,
            completed: false
          }));
          return updatedTasks;
        });
        
        setLastResetDate(today);
        setCurrentDay(currentDayOfWeek);
      }
    };

    checkNewDay();
    // Check every minute for day change
    const interval = setInterval(checkNewDay, 60000);
    
    return () => clearInterval(interval);
  }, [lastResetDate]);

  // Save to localStorage whenever tasks or XP change
  useEffect(() => {
    localStorage.setItem('weekflow-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('weekflow-xp', totalXP.toString());
  }, [totalXP]);

  useEffect(() => {
    localStorage.setItem('weekflow-last-reset', lastResetDate);
  }, [lastResetDate]);

  // Add a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask = {
      id: Date.now(),
      text: newTaskText.trim(),
      priority: selectedPriority,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks(prevTasks => ({
      ...prevTasks,
      [currentDay]: [...prevTasks[currentDay], newTask]
    }));

    setNewTaskText('');
    setSelectedPriority('basic');
  };

  // Toggle task completion and award XP
  const handleToggleTask = (taskId) => {
    const task = tasks[currentDay].find(t => t.id === taskId);
    if (!task) return;

    const isCompletingTask = !task.completed;

    setTasks(prevTasks => ({
      ...prevTasks,
      [currentDay]: prevTasks[currentDay].map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    }));

    if (isCompletingTask) {
      const xpGained = PRIORITIES[task.priority].xp;
      const oldLevel = calculateLevel(totalXP).currentRank.level;
      const newXP = totalXP + xpGained;
      const newLevelData = calculateLevel(newXP).currentRank.level;
      
      setTotalXP(newXP);
      
      // Show XP notification
      setEarnedXP(xpGained);
      setShowXPNotification(true);
      setTimeout(() => setShowXPNotification(false), 600);

      // Check for level up
      if (newLevelData > oldLevel) {
        setTimeout(() => {
          setNewLevel(calculateLevel(newXP).currentRank);
          setShowLevelUp(true);
          setTimeout(() => setShowLevelUp(false), 3000);
        }, 700);
      }
    } else {
      // Deduct XP if unchecking
      const xpLost = PRIORITIES[task.priority].xp;
      setTotalXP(prev => Math.max(0, prev - xpLost));
    }
  };

  // Delete a task
  const handleDeleteTask = (taskId) => {
    const task = tasks[currentDay].find(t => t.id === taskId);
    
    // If task was completed, deduct XP
    if (task && task.completed) {
      const xpLost = PRIORITIES[task.priority].xp;
      setTotalXP(prev => Math.max(0, prev - xpLost));
    }

    setTasks(prevTasks => ({
      ...prevTasks,
      [currentDay]: prevTasks[currentDay].filter(t => t.id !== taskId)
    }));
  };

  const currentDayTasks = tasks[currentDay] || [];
  const completedCount = currentDayTasks.filter(t => t.completed).length;
  const totalCount = currentDayTasks.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Calculate current level info
  const levelInfo = calculateLevel(totalXP);

  return (
    <div className="app">
      <div className="app-container">
        {/* Header */}
        <header className="header">
          <h1 className="header-title">⚡ WeekFlow</h1>
          <p className="header-subtitle">Master your week, one task at a time</p>
        </header>

        {/* Level & XP Section */}
        <section className="xp-section">
          {/* Level Header */}
          <div className="level-header">
            <div className="level-badge" style={{ borderColor: levelInfo.currentRank.color }}>
              <span className="level-icon">{levelInfo.currentRank.icon}</span>
              <div className="level-info">
                <div className="level-number">Level {levelInfo.currentRank.level}</div>
                <div className="level-title" style={{ color: levelInfo.currentRank.color }}>
                  {levelInfo.currentRank.title}
                </div>
              </div>
            </div>
            <div className="xp-amount">{totalXP.toLocaleString()} XP</div>
          </div>

          {/* Level Progress */}
          {levelInfo.nextRank ? (
            <>
              <div className="level-progress-container">
                <div 
                  className="level-progress-bar" 
                  style={{ 
                    width: `${levelInfo.progressPercentage}%`,
                    background: `linear-gradient(90deg, ${levelInfo.currentRank.color}, ${levelInfo.nextRank.color})`
                  }}
                />
              </div>
              <div className="level-progress-text">
                <span>{levelInfo.xpInCurrentLevel} / {levelInfo.xpNeededForNext} XP</span>
                <span className="next-level-text">
                  Next: {levelInfo.nextRank.icon} {levelInfo.nextRank.title} 
                  <span style={{ color: levelInfo.nextRank.color }}> (Level {levelInfo.nextRank.level})</span>
                </span>
              </div>
            </>
          ) : (
            <div className="level-progress-text max-level">
              <span>🎉 Maximum Level Reached! 🎉</span>
            </div>
          )}
        </section>

        {/* Day Selector */}
        <section className="day-selector">
          {DAYS_OF_WEEK.map((day, index) => {
            const dayTasks = tasks[index] || [];
            const dayCompleted = dayTasks.filter(t => t.completed).length;
            const dayTotal = dayTasks.length;
            const isToday = index === new Date().getDay();

            return (
              <button
                key={day}
                className={`day-button ${currentDay === index ? 'active' : ''} ${isToday ? 'today' : ''}`}
                onClick={() => setCurrentDay(index)}
              >
                <Calendar size={20} />
                <span>{day}</span>
                <span className="day-task-count">
                  {dayTotal > 0 ? `${dayCompleted}/${dayTotal}` : 'No tasks'}
                </span>
              </button>
            );
          })}
        </section>

        {/* Task Input Section */}
        <section className="task-input-section">
          <h2 className="task-input-header">
            <Plus size={24} />
            Add New Task for {DAYS_OF_WEEK[currentDay]}
          </h2>
          <form className="task-input-form" onSubmit={handleAddTask}>
            <div className="input-group">
              <label className="input-label">Task Description</label>
              <input
                type="text"
                className="task-input"
                placeholder="What do you need to accomplish?"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                maxLength={200}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Priority Level</label>
              <div className="priority-selector">
                {Object.entries(PRIORITIES).map(([key, priority]) => (
                  <button
                    key={key}
                    type="button"
                    className={`priority-button ${key} ${selectedPriority === key ? 'active' : ''}`}
                    onClick={() => setSelectedPriority(key)}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{priority.icon}</span>
                    <span>{priority.label}</span>
                    <span className="priority-xp">+{priority.xp} XP</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="add-task-button"
              disabled={!newTaskText.trim()}
            >
              <Plus size={20} />
              Add Task
            </button>
          </form>
        </section>

        {/* Task List Section */}
        <section className="task-list-section">
          <div className="task-list-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ListTodo size={24} />
              <span>Tasks for {DAYS_OF_WEEK[currentDay]}</span>
            </div>
            <span className="task-count">
              {completedCount} of {totalCount} completed
            </span>
          </div>

          {currentDayTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-text">No tasks yet</div>
              <div className="empty-state-subtext">
                Add your first task to get started with {DAYS_OF_WEEK[currentDay]}!
              </div>
            </div>
          ) : (
            <div className="task-list">
              {currentDayTasks.map(task => (
                <div 
                  key={task.id} 
                  className={`task-item ${task.completed ? 'completed' : ''}`}
                >
                  <div className="task-checkbox-container">
                    <input
                      type="checkbox"
                      className="task-checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                    />
                  </div>

                  <div className="task-content">
                    <div className="task-text">{task.text}</div>
                    <div className="task-meta">
                      <span className={`task-priority ${task.priority}`}>
                        {PRIORITIES[task.priority].icon} {PRIORITIES[task.priority].label}
                      </span>
                      <span className="task-xp">
                        <Zap size={14} style={{ display: 'inline', marginRight: '2px' }} />
                        {PRIORITIES[task.priority].xp} XP
                      </span>
                    </div>
                  </div>

                  <button 
                    className="task-delete"
                    onClick={() => handleDeleteTask(task.id)}
                    aria-label="Delete task"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* XP Notification */}
      {showXPNotification && (
        <div className="xp-notification">
          +{earnedXP} XP!
        </div>
      )}

      {/* Level Up Notification */}
      {showLevelUp && newLevel && (
        <div className="levelup-notification">
          <div className="levelup-icon">{newLevel.icon}</div>
          <div className="levelup-text">
            <div className="levelup-title">LEVEL UP!</div>
            <div className="levelup-subtitle">Level {newLevel.level} - {newLevel.title}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
