/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuthContext } from './AuthContext';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { token } = useAuthContext();
  const [view, setView] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState({ type: 'daily', id: new Date().toISOString().split('T')[0] });
  
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [goals, setGoals] = useState({ daily: {}, weekly: { 1: { goals: [] }, 2: { goals: [] }, 3: { goals: [] } }, yearly: { 2026: { goals: [] } } });
  const [history, setHistory] = useState([]);
  const [habits, setHabits] = useState([]);
  const [briefing, setBriefing] = useState(null);
  const [shields, setShields] = useState(0);
  
  const initialLoadDone = useRef(false);

  // Fetch data from backend on token change
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        // Reset to default empty state if not logged in
        setIsDarkMode(true);
        setGoals({ daily: {}, weekly: { 1: { goals: [] }, 2: { goals: [] }, 3: { goals: [] } }, yearly: { 2026: { goals: [] } } });
        setHistory([]);
        setHabits([]);
        initialLoadDone.current = false;
        return;
      }
      
      try {
        const res = await fetch('http://localhost:5000/api/data', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.isDarkMode !== undefined) setIsDarkMode(data.isDarkMode);
          if (data.goals) {
            // Guarantee structure sanity
            if (!data.goals.daily) data.goals.daily = {};
            if (!data.goals.weekly) data.goals.weekly = { 1: { goals: [] }, 2: { goals: [] }, 3: { goals: [] } };
            if (!data.goals.yearly) data.goals.yearly = { 2026: { goals: [] } };
            setGoals(data.goals);
          }
          if (data.history) setHistory(data.history);
          if (data.habits) setHabits(data.habits);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setTimeout(() => { initialLoadDone.current = true; }, 100);
      }
    };
    
    fetchData();
  }, [token]);

  // Sync data to backend
  useEffect(() => {
    if (!token || !initialLoadDone.current) return;
    
    const syncData = async () => {
      try {
        await fetch('http://localhost:5000/api/data', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ goals, habits, history, isDarkMode })
        });
      } catch (error) {
        console.error('Failed to sync data:', error);
      }
    };

    const debounceTimer = setTimeout(syncData, 500);
    return () => clearTimeout(debounceTimer);
  }, [goals, habits, history, isDarkMode, token]);

  // Theme application
  useEffect(() => {
    document.documentElement.className = isDarkMode ? 'dark' : 'light';
  }, [isDarkMode]);

  const calculateStreak = () => {
    if (history.length === 0) return 0;
    const sortedDates = [...new Set(history)].sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    let streak = 0;
    let expectedDate = today;
    
    // If today is missed but we have a shield, we can treat "yesterday" as the start
    let usedShield = false;
    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
      if (shields > 0) {
        usedShield = true;
        expectedDate = yesterday;
      } else {
        return 0;
      }
    } else if (sortedDates[0] === yesterday) {
      expectedDate = yesterday;
    }

    for (let i = 0; i < sortedDates.length; i++) {
      if (sortedDates[i] === expectedDate) {
        streak++;
        expectedDate = new Date(new Date(expectedDate).getTime() - 86400000).toISOString().split('T')[0];
      } else {
        // If there's a gap between records, check if a shield can bridge it
        // (Simplified for now: shield just allows 1 day grace at the very front)
        break;
      }
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
    if (!initialLoadDone.current) return;
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

  // Shield Earning Logic
  useEffect(() => {
    if (!initialLoadDone.current) return;
    const totalDone = Object.values(goals).reduce((acc, periods) => 
      acc + (periods ? Object.values(periods).reduce((a, p) => a + (p?.goals?.filter(g => g.completed).length || 0), 0) : 0), 0
    );
    // Earn 1 shield for every 20 completed goals
    const earnedShields = Math.floor(totalDone / 20);
    // Update state only if it changed to avoid unnecessary re-renders
    setShields(prev => prev !== earnedShields ? earnedShields : prev);
  }, [goals]);

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
    const jan1 = new Date(forYear, 0, 1);
    const daysToFirstMonday = (8 - jan1.getDay()) % 7;
    const startOfWeek = new Date(forYear, 0, 1 + daysToFirstMonday + (weekId - 1) * 7);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      if (d.getFullYear() === forYear || d.getFullYear() === forYear + 1) { 
        dates.push(d.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  const fetchBriefing = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/ai/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userData: { goals, habits, streak: calculateStreak(), history }
        })
      });
      if (response.ok) {
        const data = await response.json();
        setBriefing(data);
      }
    } catch (err) {
      console.error("Briefing Fetch Error:", err);
    }
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
      getDatesForWeek,
      briefing, fetchBriefing,
      shields, setShields
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
