import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [view, setView] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState({ type: 'daily', id: new Date().toISOString().split('T')[0] });
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('tracker_goals_multi');
    return saved ? JSON.parse(saved) : {
      daily: {}, // YYYY-MM-DD -> { goals: [] }
      weekly: { 1: { goals: [] }, 2: { goals: [] }, 3: { goals: [] } },
      yearly: { 2026: { goals: [] } }
    };
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('tracker_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('tracker_goals_multi', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('tracker_history', JSON.stringify(history));
  }, [history]);

  const calculateStreak = () => {
    if (history.length === 0) return 0;
    const sortedDates = [...new Set(history)].sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    let streak = 0;
    let expectedDate = today;
    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) return 0;
    if (sortedDates[0] === yesterday) expectedDate = yesterday;

    for (let i = 0; i < sortedDates.length; i++) {
      if (sortedDates[i] === expectedDate) {
        streak++;
        expectedDate = new Date(new Date(expectedDate).getTime() - 86400000).toISOString().split('T')[0];
      } else break;
    }
    return streak;
  };

  const addGoal = (type, id, text) => {
    setGoals(prev => {
      const periodData = prev[type][id] || { goals: [] };
      return {
        ...prev,
        [type]: {
          ...prev[type],
          [id]: {
            ...periodData,
            goals: [...periodData.goals, { id: Date.now(), text, completed: false, createdAt: new Date().toISOString() }]
          }
        }
      };
    });
  };

  const toggleGoal = (type, id, goalId) => {
    const today = new Date().toISOString().split('T')[0];
    setGoals(prev => {
      const newGoals = {
        ...prev,
        [type]: {
          ...prev[type],
          [id]: {
            ...prev[type][id],
            goals: prev[type][id].goals.map(g => g.id === goalId ? { ...g, completed: !g.completed, completedAt: !g.completed ? new Date().toISOString() : null } : g)
          }
        }
      };

      // Streak logic: check if any goal across all periods is completed today
      const anyCompletedToday = Object.values(newGoals).some(periods => 
        Object.values(periods).some(p => p.goals.some(g => g.completed && g.completedAt?.startsWith(today)))
      );

      if (anyCompletedToday && !history.includes(today)) {
        setHistory(h => [...h, today]);
      } else if (!anyCompletedToday && history.includes(today)) {
        setHistory(h => h.filter(d => d !== today));
      }

      return newGoals;
    });
  };

  const deleteGoal = (type, id, goalId) => {
    setGoals(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [id]: {
          ...prev[type][id],
          goals: prev[type][id].goals.filter(g => g.id !== goalId)
        }
      }
    }));
  };

  return (
    <AppContext.Provider value={{ 
      view, setView, 
      selectedPeriod, setSelectedPeriod,
      isDarkMode, setIsDarkMode,
      goals, addGoal, toggleGoal, deleteGoal,
      streak: calculateStreak(),
      history
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
