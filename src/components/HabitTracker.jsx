import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Trash2, ChevronLeft, ChevronRight, Flame, BarChart3, Activity } from 'lucide-react';

const CATEGORIES = [
  { id: 'health',       label: 'Health',       emoji: '🏃', color: '#10b981' },
  { id: 'productivity', label: 'Productivity',  emoji: '💼', color: '#6366F1' },
  { id: 'learning',     label: 'Learning',      emoji: '📚', color: '#6366F1' },
  { id: 'mindfulness',  label: 'Mindfulness',   emoji: '🧘', color: '#6366F1' },
  { id: 'other',        label: 'Other',         emoji: '⚙️', color: '#94A3B8' },
];

const getCat = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[4];

const HabitTracker = () => {
  const { habits, addHabit, toggleHabitDate, deleteHabit, getHabitStreak } = useAppContext();
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('health');
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekDates = (offset) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const startOfWeek = new Date(today.setDate(diff));
    startOfWeek.setDate(startOfWeek.getDate() + offset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates(weekOffset);
  const weekDays = ['M', 'T', 'W', 'W', 'F', 'S', 'S'];
  const todayStr = new Date().toISOString().split('T')[0];

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      addHabit(newHabitName.trim(), newHabitCategory);
      setNewHabitName('');
    }
  };

  const weekLabel = weekOffset === 0 ? 'Current Week' : weekOffset === -1 ? 'Last Week' : `${Math.abs(weekOffset)}w Ago`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Search & Category Filter (Mockup for SaaS feel) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '6px' }}>
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="saas-card" style={{ padding: '0' }}>
        {/* Header Section */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: 'var(--primary)' }}><Activity size={20} /></div>
            <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Habit Matrix</h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-obsidian)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <button onClick={() => setWeekOffset(p => p - 1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px' }}><ChevronLeft size={16} /></button>
            <span style={{ fontWeight: 700, minWidth: '80px', textAlign: 'center', fontSize: '0.75rem', color: '#fff' }}>{weekLabel}</span>
            <button onClick={() => setWeekOffset(p => Math.min(0, p + 1))} disabled={weekOffset === 0} style={{ background: 'transparent', border: 'none', color: weekOffset === 0 ? 'var(--text-muted)' : 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px' }}><ChevronRight size={16} /></button>
          </div>
        </div>

        {/* Matrix Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-color)' }}>Indicator</th>
                {weekDates.map((date, i) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const isToday = dateStr === todayStr;
                  return (
                    <th key={i} style={{ textAlign: 'center', padding: '1rem 0.5rem', borderBottom: '1px solid var(--border-color)', borderLeft: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <span style={{ color: isToday ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.75rem' }}>{weekDays[i]}</span>
                        <span style={{ color: isToday ? '#fff' : 'var(--text-secondary)', fontWeight: 600, fontSize: '0.65rem' }}>{date.getDate()}</span>
                      </div>
                    </th>
                  );
                })}
                <th style={{ width: '80px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', borderLeft: '1px solid var(--border-color)' }}>STREAK</th>
                <th style={{ width: '60px', borderBottom: '1px solid var(--border-color)' }} />
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => {
                const cat = getCat(habit.category);
                const habitStreak = getHabitStreak(habit.id);
                return (
                  <tr key={habit.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1rem' }}>{cat.emoji}</span>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{habit.name}</span>
                      </div>
                    </td>
                    {weekDates.map((date, i) => {
                      const dateStr = date.toISOString().split('T')[0];
                      const isCompleted = habit.completedDates.includes(dateStr);
                      const isFuture = date > new Date() && dateStr !== todayStr;
                      return (
                        <td key={i} style={{ textAlign: 'center', padding: '0', borderLeft: '1px solid var(--border-color)' }}>
                          <button
                            disabled={isFuture && !isCompleted}
                            onClick={() => toggleHabitDate(habit.id, dateStr)}
                            style={{
                              width: '100%', height: '100%', minHeight: '64px',
                              background: isCompleted ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                              color: 'var(--primary)', border: 'none', cursor: (isFuture && !isCompleted) ? 'not-allowed' : 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'all 0.1s ease',
                              opacity: (isFuture && !isCompleted) ? 0.2 : 1
                            }}
                          >
                            {isCompleted && <Check size={18} strokeWidth={3} />}
                          </button>
                        </td>
                      );
                    })}
                    
                    <td style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: habitStreak > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
                        {habitStreak > 0 ? `${habitStreak}d` : '—'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', padding: '0 0.5rem' }}>
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem', borderRadius: '4px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {habits.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No active habits. Create one below to begin tracking.
            </div>
          )}
        </div>

        {/* Input Nexus */}
        <form onSubmit={handleAddHabit} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '1rem' }}>
          <select
            value={newHabitCategory}
            onChange={e => setNewHabitCategory(e.target.value)}
            style={{ background: 'var(--bg-obsidian)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', fontSize: '0.85rem', padding: '0.5rem', outline: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id} style={{ background: 'var(--bg-card)' }}>{c.emoji} {c.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Log new performance metric..."
            value={newHabitName}
            onChange={e => setNewHabitName(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}
          />
          <button
            type="submit"
            disabled={!newHabitName.trim()}
            className="btn-primary"
            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
          >
            <Plus size={16} /> Initialize
          </button>
        </form>
      </div>
    </div>
  );
};

export default HabitTracker;
