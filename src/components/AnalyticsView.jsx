import React from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import ProgressBar from './ProgressBar';
import { TrendingUp, Award, AlertTriangle } from 'lucide-react';

const CATEGORIES = [
  { id: 'health',       label: 'Health',       emoji: '🏃', color: '#10b981' },
  { id: 'productivity', label: 'Productivity',  emoji: '💼', color: '#6366f1' },
  { id: 'learning',     label: 'Learning',      emoji: '📚', color: '#f472b6' },
  { id: 'mindfulness',  label: 'Mindfulness',   emoji: '🧘', color: '#22d3ee' },
  { id: 'other',        label: 'Other',         emoji: '⚙️', color: '#94a3b8' },
];

const getCat = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[4];

// Stat chip
const StatChip = ({ label, value, color, icon }) => (
  <div className="glass floating-glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div style={{ width: '44px', height: '44px', background: `${color}20`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '2rem', fontWeight: 950, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{label}</div>
    </div>
  </div>
);

const AnalyticsView = () => {
  const { goals, habits, history, streak, getDatesForWeek } = useAppContext();

  // --- Goal stats ---
  const getGoalStats = (type) => {
    let total = 0, completed = 0;
    if (type === 'weekly') {
      [1, 2, 3].forEach(wId => {
        const wg = goals.weekly?.[wId]?.goals || [];
        const dates = getDatesForWeek(wId) || [];
        const dg = dates.flatMap(d => goals.daily?.[d]?.goals || []);
        total += wg.length + dg.length;
        completed += wg.filter(g => g?.completed).length + dg.filter(g => g?.completed).length;
      });
    } else {
      const periods = goals[type] || {};
      Object.values(periods).forEach(p => {
        if (p?.goals) { total += p.goals.length; completed += p.goals.filter(g => g?.completed).length; }
      });
    }
    return { type, total, completed, pct: total > 0 ? (completed / total) * 100 : 0 };
  };

  const goalStats = ['daily', 'weekly', 'yearly'].map(getGoalStats);
  const totalGoals = goalStats.reduce((a, s) => a + s.total, 0);
  const totalDone = goalStats.reduce((a, s) => a + s.completed, 0);

  // --- Habit analytics: days completed this month ---
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = now.getMonth();
  const daysInMonth = new Date(yyyy, mm + 1, 0).getDate();
  const monthDates = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(yyyy, mm, i + 1);
    return d.toISOString().split('T')[0];
  });

  const habitAnalytics = habits.map(habit => {
    const doneInMonth = monthDates.filter(d => habit.completedDates.includes(d)).length;
    const pct = (doneInMonth / daysInMonth) * 100;
    return { ...habit, doneInMonth, pct };
  }).sort((a, b) => b.pct - a.pct);

  const topHabits = habitAnalytics.slice(0, 3);
  const strugglingHabits = habitAnalytics.filter(h => h.pct < 30 && h.doneInMonth === 0).slice(0, 3);

  // --- 30-day streak trend ---
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split('T')[0];
  });
  const historySet = new Set(history);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
    >
      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatChip label="Day Streak" value={streak} color="#f97316" icon={<TrendingUp size={20} />} />
        <StatChip label="Goals Done" value={totalDone} color="#6366f1" icon={<Award size={20} />} />
        <StatChip label="Total Goals" value={totalGoals} color="#22d3ee" icon={<TrendingUp size={20} />} />
        <StatChip label="Habits Tracked" value={habits.length} color="#f472b6" icon={<Award size={20} />} />
      </div>

      {/* Goal completion rates */}
      <div className="glass floating-glass" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Goal Completion Rates</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {goalStats.map(s => (
            <div key={s.type}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 800, textTransform: 'capitalize', fontSize: '0.95rem' }}>{s.type} Goals</span>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>{s.completed}/{s.total} · {Math.round(s.pct)}%</span>
              </div>
              <ProgressBar percentage={s.pct} />
            </div>
          ))}
        </div>
      </div>

      {/* Habit performance this month */}
      <div className="glass floating-glass" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Habit Performance This Month</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          {now.toLocaleString('default', { month: 'long', year: 'numeric' })} — {daysInMonth} days
        </p>
        {habitAnalytics.length === 0 ? (
          <div style={{ color: 'rgba(255,255,255,0.25)', textAlign: 'center', padding: '2rem', fontWeight: 600 }}>No habits tracked yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {habitAnalytics.map(h => {
              const cat = getCat(h.category);
              return (
                <div key={h.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
                      <span>{cat.emoji}</span> {h.name}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: cat.color, fontWeight: 800 }}>{h.doneInMonth}/{daysInMonth} days</span>
                  </div>
                  {/* Custom bar with category color */}
                  <div style={{ height: '6px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${h.pct}%`, background: `linear-gradient(to right, ${cat.color}, ${cat.color}aa)`, borderRadius: '999px', transition: 'width 0.8s ease', boxShadow: `0 0 8px ${cat.color}60` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 30-day activity grid */}
      <div className="glass floating-glass" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>30-Day Activity</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem' }}>Days you completed at least one goal</p>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {last30.map((dateStr, i) => {
            const active = historySet.has(dateStr);
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            return (
              <div
                key={dateStr}
                title={dateStr}
                style={{
                  width: '28px', height: '28px', borderRadius: '7px',
                  background: active ? 'var(--success)' : 'rgba(255,255,255,0.05)',
                  boxShadow: active ? '0 0 10px rgba(16,185,129,0.4)' : 'none',
                  border: isToday ? '2px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.04)',
                  transition: 'all 0.2s',
                  cursor: 'default'
                }}
              />
            );
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)' }} />
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>No activity</span>
          <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'var(--success)', marginLeft: '0.75rem' }} />
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>Active</span>
        </div>
      </div>

      {/* Top & Struggling habits */}
      {habits.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {topHabits.length > 0 && (
            <div className="glass floating-glass" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <Award size={18} color="#10b981" />
                <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#10b981' }}>Top Habits</h3>
              </div>
              {topHabits.map(h => {
                const cat = getCat(h.category);
                return (
                  <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{cat.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{h.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800 }}>{h.doneInMonth} days · {Math.round(h.pct)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {strugglingHabits.length > 0 && (
            <div className="glass floating-glass" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <AlertTriangle size={18} color="#f59e0b" />
                <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#f59e0b' }}>Needs Attention</h3>
              </div>
              {strugglingHabits.map(h => {
                const cat = getCat(h.category);
                return (
                  <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{cat.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{h.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 800 }}>0 days this month</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AnalyticsView;
