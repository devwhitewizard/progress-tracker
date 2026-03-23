import React from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { TrendingUp, Award, AlertTriangle, Activity } from 'lucide-react';

const CATEGORIES = [
  { id: 'health',       label: 'Health',       emoji: '🏃', color: '#10B981' },
  { id: 'productivity', label: 'Productivity',  emoji: '💼', color: '#6366F1' },
  { id: 'learning',     label: 'Learning',      emoji: '📚', color: '#F43F5E' },
  { id: 'mindfulness',  label: 'Mindfulness',   emoji: '🧘', color: '#06B6D4' },
  { id: 'other',        label: 'Other',         emoji: '⚙️', color: '#94A3B8' },
];

const getCat = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[4];

const StatCard = ({ label, value, icon, color = 'var(--primary)' }) => (
  <div className="saas-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: `${color}10`, border: `1px solid ${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{value}</div>
      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  </div>
);

const AnalyticsView = () => {
  const { goals, habits, streak, history, getDatesForWeek } = useAppContext();

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
  const totalDone = goalStats.reduce((a, s) => a + s.completed, 0);

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

  const historySet = new Set(history || []);
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        <StatCard label="Current Streak" value={streak} icon={<TrendingUp size={20} />} color="#F97316" />
        <StatCard label="Total Goals" value={totalDone} icon={<Award size={20} />} color="var(--primary)" />
        <StatCard label="Active Habits" value={habits.length} icon={<Activity size={20} />} color="#10B981" />
        <StatCard label="Completion" value={Math.round(goalStats.reduce((a,b)=>a+b.pct,0)/3) + '%'} icon={<Activity size={20} />} color="var(--primary)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.25rem' }}>
        <div className="saas-card">
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', fontWeight: 700 }}>Performance Metrics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {goalStats.map(s => (
              <div key={s.type}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize' }}>{s.type} Objectives</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.completed}/{s.total}</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.pct}%`, background: 'var(--primary)', transition: 'width 1s ease-out' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="saas-card">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 700 }}>Activity Matrix</h3>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {last30.map((dateStr) => (
              <div
                key={dateStr}
                style={{
                  width: '12px', height: '12px', borderRadius: '2px',
                  background: historySet.has(dateStr) ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)'
                }}
                title={dateStr}
              />
            ))}
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '1px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }} />
              Inactive
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '1px', background: 'var(--primary)', border: '1px solid var(--border-color)' }} />
              Productive
            </div>
          </div>
        </div>
      </div>

      <div className="saas-card">
        <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', fontWeight: 700 }}>Habit Consistency</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {habitAnalytics.map(h => {
             const cat = getCat(h.category);
             return (
               <div key={h.id} style={{ padding: '1rem', background: 'var(--bg-obsidian)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                   <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{h.name}</span>
                   <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{Math.round(h.pct)}%</span>
                 </div>
                 <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                   <div style={{ height: '100%', width: `${h.pct}%`, background: cat.color }} />
                 </div>
               </div>
             )
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
