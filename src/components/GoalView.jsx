import React from 'react';
import { useAppContext } from '../context/AppContext';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, CheckCircle, Circle, Flag, Clock, Target } from 'lucide-react';

const PRIORITY_META = {
  high:   { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', labeling: 'CRITICAL' },
  medium: { color: '#6366F1', bg: 'rgba(99, 102, 241, 0.1)', labeling: 'STRETCH' },
  low:    { color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.1)', labeling: 'MINOR' },
};

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

const GoalView = () => {
  const { selectedPeriod, goals, toggleGoal, deleteGoal, getDatesForWeek, briefing } = useAppContext();

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

  periodGoals = [...periodGoals].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1);
  });

  const completedCount = periodGoals.filter(g => g.completed).length;
  const percentage = periodGoals.length > 0 ? (completedCount / periodGoals.length) * 100 : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
        <div className="saas-card" style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={24} color="var(--primary)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completion Rate</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{Math.round(percentage)}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                style={{ height: '100%', background: 'var(--primary)' }}
              />
            </div>
          </div>
        </div>

        <div className="saas-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{completedCount}<span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}> / {periodGoals.length}</span></div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginTop: '0.25rem' }}>Active Tasks</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {periodGoals.length === 0 ? (
          <div className="saas-card" style={{ padding: '3rem', textAlign: 'center', borderStyle: 'dashed', color: 'var(--text-muted)' }}>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>No missions defined for this period.</p>
          </div>
        ) : (
          periodGoals.map((goal) => {
            const pm = PRIORITY_META[goal.priority] || PRIORITY_META.medium;
            const isAIModule = briefing?.priorityMission?.toLowerCase().includes(goal.text.toLowerCase()) || goal.text.toLowerCase().includes(briefing?.priorityMission?.toLowerCase());
            
            return (
              <div
                key={goal.id}
                className="saas-card"
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem 1.25rem',
                  background: goal.completed ? 'rgba(255,255,255,0.01)' : 'var(--bg-card)',
                  opacity: goal.completed ? 0.6 : 1,
                  border: isAIModule && !goal.completed ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  boxShadow: isAIModule && !goal.completed ? '0 0 15px rgba(99, 102, 241, 0.1)' : 'none'
                }}
              >
                <button
                  onClick={() => toggleGoal(goal.type, goal.periodId, goal.id)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: goal.completed ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', padding: 0 }}
                >
                  {goal.completed ? <CheckCircle size={22} strokeWidth={2.5} /> : <Circle size={22} strokeWidth={2} />}
                </button>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      fontSize: '0.95rem', fontWeight: 500,
                      textDecoration: goal.completed ? 'line-through' : 'none',
                      color: goal.completed ? 'var(--text-muted)' : '#fff',
                    }}>
                      {goal.text}
                    </span>
                    {isAIModule && !goal.completed && (
                      <Sparkles size={14} color="var(--primary)" />
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', padding: '0.2rem 0.5rem', borderRadius: '4px', background: pm.bg, color: pm.color, border: `1px solid ${pm.color}20` }}>
                      {goal.priority}
                    </span>
                    {goal.deadline && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        <Clock size={12} />
                        {new Date(goal.deadline + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                    {goal.isMirrored && (
                      <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 700, background: 'rgba(99, 102, 241, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>SYNCED</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteGoal(goal.type, goal.periodId, goal.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem', borderRadius: '4px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GoalView;
