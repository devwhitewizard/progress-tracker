import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [view, setView] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState({ type: 'daily', id: new Date().toISOString().split('T')[0] });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('tracker_theme');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('tracker_goals_multi');
    let data = saved ? JSON.parse(saved) : { daily: {}, weekly: {}, yearly: {} };
    
    // Sanitize and ensure structure
    if (!data.daily) data.daily = {};
    if (!data.weekly) data.weekly = { 1: { goals: [] }, 2: { goals: [] }, 3: { goals: [] } };
    if (!data.yearly) data.yearly = { 2026: { goals: [] } };
    
    // Ensure all period objects have a goals array
    Object.keys(data).forEach(type => {
      Object.keys(data[type]).forEach(id => {
        if (!data[type][id] || !Array.isArray(data[type][id].goals)) {
          data[type][id] = { goals: [] };
        }
      });
    });
    
    return data;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('tracker_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('tracker_habits');
    const parsed = saved ? JSON.parse(saved) : [];
    // Migrate old habits without category
    return parsed.map(h => ({ category: 'other', ...h }));
  });

  useEffect(() => {
    localStorage.setItem('tracker_theme', JSON.stringify(isDarkMode));
    document.documentElement.className = isDarkMode ? 'dark' : 'light';
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('tracker_goals_multi', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('tracker_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('tracker_habits', JSON.stringify(habits));
  }, [habits]);

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

  const addGoal = (type, id, text, priority = 'medium', deadline = null) => {
    setGoals(prev => {
      const periodData = prev[type][id] || { goals: [] };
      return {
        ...prev,
        [type]: {
          ...prev[type],
          [id]: {
            ...periodData,
            goals: [...periodData.goals, { id: Date.now(), text, completed: false, createdAt: new Date().toISOString(), priority, deadline }]
          }
        }
      };
    });
  };

  const toggleGoal = (type, id, goalId) => {
    setGoals(prev => {
      if (!prev[type] || !prev[type][id]) return prev;
      return {
        ...prev,
        [type]: {
          ...prev[type],
          [id]: {
            ...prev[type][id],
            goals: prev[type][id].goals?.map(g => 
              g.id === goalId ? { ...g, completed: !g.completed, completedAt: !g.completed ? new Date().toISOString() : null } : g
            ) || []
          }
        }
      };
    });
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const anyCompletedToday = Object.values(goals).some(periods => 
      periods && Object.values(periods).some(p => 
        p?.goals?.some(g => g.completed && g.completedAt?.startsWith(today))
      )
    );

    if (anyCompletedToday && !history.includes(today)) {
      setHistory(h => [...h, today]);
    } else if (!anyCompletedToday && history.includes(today)) {
      setHistory(h => h.filter(d => d !== today));
    }
  }, [goals, history]);

  const deleteGoal = (type, id, goalId) => {
    setGoals(prev => {
      if (!prev[type] || !prev[type][id]) return prev;
      return {
        ...prev,
        [type]: {
          ...prev[type],
          [id]: {
            ...prev[type][id],
            goals: prev[type][id].goals?.filter(g => g.id !== goalId) || []
          }
        }
      };
    });
  };

  const addHabit = (name, category = 'other') => {
    setHabits(prev => [...prev, { id: Date.now().toString(), name, category, completedDates: [] }]);
  };

  const getHabitStreak = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit || habit.completedDates.length === 0) return 0;
    const sorted = [...habit.completedDates].sort().reverse();
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (sorted[0] !== todayStr && sorted[0] !== yesterdayStr) return 0;
    let streak = 0;
    let expected = sorted[0];
    for (const d of sorted) {
      if (d === expected) {
        streak++;
        expected = new Date(new Date(expected).getTime() - 86400000).toISOString().split('T')[0];
      } else break;
    }
    return streak;
  };

  const toggleHabitDate = (habitId, dateStr) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const hasDate = habit.completedDates.includes(dateStr);
        return {
          ...habit,
          completedDates: hasDate 
            ? habit.completedDates.filter(d => d !== dateStr) 
            : [...habit.completedDates, dateStr]
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (habitId) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  const getDatesForWeek = (weekId, forYear = new Date().getFullYear()) => {
    // weekId is 1-52. Calculate the first Monday of the year or similar.
    // For simplicity, we'll use a fixed start of year logic or use a helper.
    const jan1 = new Date(forYear, 0, 1);
    const daysToFirstMonday = (8 - jan1.getDay()) % 7;
    const startOfWeek = new Date(forYear, 0, 1 + daysToFirstMonday + (weekId - 1) * 7);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      if (d.getFullYear() === forYear || d.getFullYear() === forYear + 1) { // allow week overlap
        dates.push(d.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  return (
    <AppContext.Provider value={{ 
      view, setView, 
      selectedPeriod, setSelectedPeriod,
      isDarkMode, setIsDarkMode,
      goals, addGoal, toggleGoal, deleteGoal,
      streak: calculateStreak(),
      history,
      habits, addHabit, toggleHabitDate, deleteHabit, getHabitStreak,
      getDatesForWeek
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
