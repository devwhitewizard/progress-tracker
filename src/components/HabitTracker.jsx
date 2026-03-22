import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Trash2, ChevronLeft, ChevronRight, Flame } from 'lucide-react';

const CATEGORIES = [
  { id: 'health',       label: 'Health',       emoji: '🏃', color: '#10b981' },
  { id: 'productivity', label: 'Productivity',  emoji: '💼', color: '#6366f1' },
  { id: 'learning',     label: 'Learning',      emoji: '📚', color: '#f472b6' },
  { id: 'mindfulness',  label: 'Mindfulness',   emoji: '🧘', color: '#22d3ee' },
  { id: 'other',        label: 'Other',         emoji: '⚙️', color: '#94a3b8' },
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
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayStr = new Date().toISOString().split('T')[0];

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      addHabit(newHabitName.trim(), newHabitCategory);
      setNewHabitName('');
    }
  };

  const weekLabel = weekOffset === 0 ? 'This Week' : weekOffset === -1 ? 'Last Week' : `${Math.abs(weekOffset)} Weeks Ago`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
    >
      {/* Category Legend */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.04)', border: `1px solid ${cat.color}30`, borderRadius: '10px', padding: '0.35rem 0.75rem' }}>
            <span style={{ fontSize: '0.75rem' }}>{cat.emoji}</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: cat.color, letterSpacing: '0.05em' }}>{cat.label}</span>
          </div>
        ))}
      </div>

      <div className="glass floating-glass" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '250px', height: '250px', background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.07, pointerEvents: 'none' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>Habit Tracker</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.9rem' }}>Build streaks, track your daily routines.</p>
          </div>
          {/* Week navigator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem 0.4rem 0.4rem 0.75rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <button onClick={() => setWeekOffset(p => p - 1)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.4rem', borderRadius: '8px' }} className="hover-glow"><ChevronLeft size={18} /></button>
            <span style={{ fontWeight: 800, minWidth: '100px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>{weekLabel}</span>
            <button onClick={() => setWeekOffset(p => Math.min(0, p + 1))} disabled={weekOffset === 0} style={{ background: 'transparent', border: 'none', color: weekOffset === 0 ? 'rgba(255,255,255,0.2)' : '#fff', cursor: weekOffset === 0 ? 'default' : 'pointer', padding: '0.4rem', borderRadius: '8px' }} className={weekOffset !== 0 ? 'hover-glow' : ''}><ChevronRight size={18} /></button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
          <table style={{ width: '100%', minWidth: '640px', borderCollapse: 'separate', borderSpacing: '0 0.6rem' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem 1rem', color: 'rgba(255,255,255,0.35)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Habit</th>
                {weekDates.map((date, i) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const isToday = dateStr === todayStr;
                  return (
                    <th key={i} style={{ textAlign: 'center', padding: '0.5rem', width: '52px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <span style={{ color: isToday ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.35)', fontWeight: 900, fontSize: '0.85rem' }}>{weekDays[i]}</span>
                        <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 600, fontSize: '0.65rem' }}>{date.getDate()}</span>
                      </div>
                    </th>
                  );
                })}
                <th style={{ width: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em' }}>🔥</th>
                <th style={{ width: '44px' }} />
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {habits.map((habit) => {
                  const cat = getCat(habit.category);
                  const habitStreak = getHabitStreak(habit.id);
                  return (
                    <motion.tr
                      key={habit.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.25 }}
                      style={{ background: 'rgba(255,255,255,0.025)' }}
                    >
                      <td style={{ padding: '1rem', borderRadius: '14px 0 0 14px', borderTop: `1px solid rgba(255,255,255,0.05)`, borderBottom: `1px solid rgba(255,255,255,0.05)`, borderLeft: `3px solid ${cat.color}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ fontSize: '0.9rem' }}>{cat.emoji}</span>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{habit.name}</span>
                        </div>
                      </td>
                      {weekDates.map((date, i) => {
                        const dateStr = date.toISOString().split('T')[0];
                        const isCompleted = habit.completedDates.includes(dateStr);
                        const isFuture = date > new Date() && dateStr !== todayStr;
                        return (
                          <td key={i} style={{ padding: '0.75rem 0', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <button
                              disabled={isFuture && !isCompleted}
                              onClick={() => toggleHabitDate(habit.id, dateStr)}
                              style={{
                                width: '32px', height: '32px', borderRadius: '10px',
                                border: isCompleted ? 'none' : '2px dashed rgba(255,255,255,0.13)',
                                background: isCompleted ? `linear-gradient(135deg, ${cat.color}, ${cat.color}bb)` : 'transparent',
                                color: '#fff', display: 'inline-flex', justifyContent: 'center', alignItems: 'center',
                                cursor: (isFuture && !isCompleted) ? 'not-allowed' : 'pointer',
                                opacity: (isFuture && !isCompleted) ? 0.25 : 1,
                                boxShadow: isCompleted ? `0 4px 10px ${cat.color}55` : 'none',
                                transition: 'all 0.2s'
                              }}
                              title={dateStr}
                            >
                              {isCompleted && <Check size={16} strokeWidth={3} />}
                            </button>
                          </td>
                        );
                      })}
                      {/* Streak badge */}
                      <td style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        {habitStreak > 0 ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '3px 7px' }}>
                            <Flame size={12} color="#f97316" />
                            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#f97316' }}>{habitStreak}</span>
                          </div>
                        ) : (
                          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.75rem' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', borderRadius: '0 14px 14px 0', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <button
                          onClick={() => deleteHabit(habit.id)}
                          style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.18)', cursor: 'pointer', padding: '0.4rem', borderRadius: '8px', transition: 'all 0.2s' }}
                          onMouseOver={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                          onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.18)'; e.currentTarget.style.background = 'transparent'; }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          {habits.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
              No habits yet. Add your first habit below!
            </div>
          )}
        </div>

        {/* Add form */}
        <form onSubmit={handleAddHabit} style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <select
            value={newHabitCategory}
            onChange={e => setNewHabitCategory(e.target.value)}
            style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.9rem', padding: '0.5rem 0.75rem', outline: 'none', cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}
          >
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id} style={{ background: '#020617' }}>{c.emoji} {c.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="New habit name…"
            value={newHabitName}
            onChange={e => setNewHabitName(e.target.value)}
            style={{ flex: 1, minWidth: '160px', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontWeight: 600, padding: '0.5rem' }}
          />
          <button
            type="submit"
            disabled={!newHabitName.trim()}
            style={{ background: newHabitName.trim() ? '#fff' : 'rgba(255,255,255,0.08)', color: newHabitName.trim() ? '#000' : 'rgba(255,255,255,0.3)', padding: '0.6rem 1.25rem', borderRadius: '10px', border: 'none', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: newHabitName.trim() ? 'pointer' : 'default', transition: 'all 0.3s' }}
          >
            <Plus size={16} strokeWidth={3} /> Add
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default HabitTracker;
