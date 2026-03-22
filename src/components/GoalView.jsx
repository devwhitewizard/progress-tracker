import React from 'react';
import { useAppContext } from '../context/AppContext';
import ProgressBar from './ProgressBar';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, CheckCircle, Circle, Flag, Clock } from 'lucide-react';

const PRIORITY_META = {
  high:   { color: '#ef4444', bg: 'rgba(239,68,68,0.13)',   label: 'High'   },
  medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.13)',  label: 'Medium' },
  low:    { color: '#10b981', bg: 'rgba(16,185,129,0.13)',  label: 'Low'    },
};

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

const GoalView = () => {
  const { selectedPeriod, goals, toggleGoal, deleteGoal, getDatesForWeek } = useAppContext();

  let periodGoals = [];
  if (selectedPeriod.type === 'weekly') {
    const weeklyData = goals.weekly[selectedPeriod.id] || { goals: [] };
    const datesInWeek = getDatesForWeek(selectedPeriod.id);
    const dailyGoalsInWeek = datesInWeek.flatMap(date => {
      const dayData = goals.daily[date] || { goals: [] };
      return dayData.goals.map(g => ({ ...g, periodId: date, type: 'daily', isMirrored: true }));
    });
    const mainWeeklyGoals = (weeklyData.goals || []).map(g => ({ ...g, periodId: selectedPeriod.id, type: 'weekly' }));
    periodGoals = [...mainWeeklyGoals, ...dailyGoalsInWeek];
  } else {
    const periodData = goals[selectedPeriod.type][selectedPeriod.id] || { goals: [] };
    periodGoals = periodData.goals.map(g => ({ ...g, periodId: selectedPeriod.id, type: selectedPeriod.type }));
  }

  // Sort: incomplete first by priority, then completed
  periodGoals = [...periodGoals].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1);
  });

  const completedCount = periodGoals.filter(g => g.completed).length;
  const percentage = periodGoals.length > 0 ? (completedCount / periodGoals.length) * 100 : 0;

  const getSubTitle = () => {
    if (selectedPeriod.type === 'daily') return 'Focus on what matters today';
    if (selectedPeriod.type === 'weekly') return 'Achieve your weekly objectives';
    if (selectedPeriod.type === 'yearly') return 'Focus on the big picture';
    return '';
  };

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date() && new Date(deadline).toISOString().split('T')[0] !== new Date().toISOString().split('T')[0];
  };

  return (
    <motion.div
      key={`${selectedPeriod.type}-${selectedPeriod.id}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header card */}
      <div className="glass floating-glass" style={{ padding: '1.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '150px', height: '150px', background: 'var(--primary)', filter: 'blur(60px)', opacity: 0.08, pointerEvents: 'none' }} />
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.3rem', letterSpacing: '-0.03em' }}>
            {selectedPeriod.type.charAt(0).toUpperCase() + selectedPeriod.type.slice(1)} Goals
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{getSubTitle()}</p>
        </div>
        <div style={{ fontSize: '2.5rem', fontWeight: 1000, color: 'var(--accent-cyan)', letterSpacing: '-0.05em' }}>
          {completedCount}<span style={{ fontSize: '1.2rem', opacity: 0.3 }}>/{periodGoals.length}</span>
        </div>
      </div>

      <div style={{ padding: '0 0.5rem 1.5rem' }}>
        <ProgressBar percentage={percentage} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {periodGoals.length === 0 ? (
          <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: '24px', color: 'var(--text-dim)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✨</div>
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>No goals yet. Add one above!</p>
          </div>
        ) : (
          <AnimatePresence>
            {periodGoals.map((goal, index) => {
              const pm = PRIORITY_META[goal.priority] || PRIORITY_META.medium;
              const overdue = !goal.completed && isOverdue(goal.deadline);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: index * 0.03 }}
                  key={goal.id}
                  className="glass"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1.1rem 1.5rem', borderRadius: '18px',
                    borderLeft: goal.isMirrored ? '3px solid var(--accent)' : `3px solid ${pm.color}`,
                    opacity: goal.completed ? 0.6 : 1,
                    transition: 'opacity 0.3s'
                  }}
                >
                  <motion.div
                    whileTap={{ scale: 0.88 }}
                    onClick={() => toggleGoal(goal.type, goal.periodId, goal.id)}
                    style={{ cursor: 'pointer', color: goal.completed ? 'var(--success)' : 'rgba(255,255,255,0.3)', flexShrink: 0 }}
                  >
                    {goal.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                  </motion.div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '1.05rem', fontWeight: 700,
                        textDecoration: goal.completed ? 'line-through' : 'none',
                        color: goal.completed ? 'rgba(255,255,255,0.25)' : '#fff',
                        transition: 'all 0.3s', letterSpacing: '-0.01em', wordBreak: 'break-word'
                      }}>
                        {goal.text}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                      {/* Priority badge */}
                      {goal.priority && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '3px 8px', borderRadius: '7px', background: pm.bg, color: pm.color, border: `1px solid ${pm.color}30` }}>
                          <Flag size={10} /> {pm.label}
                        </span>
                      )}
                      {/* Deadline */}
                      {goal.deadline && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', fontWeight: 800, color: overdue ? '#ef4444' : 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
                          <Clock size={10} />
                          {overdue ? 'Overdue · ' : ''}{new Date(goal.deadline + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                      {/* Mirrored tag */}
                      {goal.isMirrored && (
                        <span style={{ fontSize: '0.65rem', background: 'rgba(34,211,238,0.1)', color: 'var(--accent-cyan)', padding: '3px 8px', borderRadius: '7px', fontWeight: 900, letterSpacing: '0.08em', border: '1px solid rgba(34,211,238,0.2)' }}>
                          🛰️ Mirrored
                        </span>
                      )}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.15, color: '#ef4444' }}
                    onClick={() => deleteGoal(goal.type, goal.periodId, goal.id)}
                    style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.2)', padding: '0.4rem', cursor: 'pointer', flexShrink: 0 }}
                  >
                    <Trash2 size={17} />
                  </motion.button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default GoalView;
