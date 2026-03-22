import React from 'react';
import { useAppContext } from '../context/AppContext';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Calendar, Layers, Star, CheckCircle, Circle } from 'lucide-react';

const MasterPlanView = () => {
  const { goals, toggleGoal, deleteGoal } = useAppContext();

  // Flatten and sort goals
  const allGoals = [];

  // Daily
  Object.entries(goals.daily).forEach(([date, data]) => {
    data.goals.forEach(g => {
      allGoals.push({ ...g, periodId: date, type: 'daily', date: new Date(date + 'T00:00:00') });
    });
  });

  // Weekly
  Object.entries(goals.weekly).forEach(([id, data]) => {
    data.goals.forEach(g => {
      // Approximate date for sorting (assume start of the week logic if id had year, but for now we just push them)
      allGoals.push({ ...g, periodId: id, type: 'weekly', date: new Date(2026, 0, 1) }); // Placeholder sorting
    });
  });

  // Yearly
  Object.entries(goals.yearly).forEach(([year, data]) => {
    data.goals.forEach(g => {
      allGoals.push({ ...g, periodId: year, type: 'yearly', date: new Date(year, 0, 1) });
    });
  });

  allGoals.sort((a, b) => a.date - b.date || a.id - b.id);

  const getTypeIcon = (type) => {
    if (type === 'daily') return <Calendar size={16} />;
    if (type === 'weekly') return <Layers size={16} />;
    return <Star size={16} />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="master-plan"
      style={{ paddingBottom: '4rem' }}
    >
      <div className="glass floating-glass" style={{ padding: '2.5rem', marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(244, 114, 182, 0.1))', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.15 }}></div>
        <h2 style={{ fontSize: '4rem', fontWeight: 1000, marginBottom: '0.75rem', letterSpacing: '-0.05em', background: 'linear-gradient(to right, #fff, var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Master Strategy</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em' }}>The Blueprint of Your Evolution</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {allGoals.length === 0 ? (
          <div className="glass" style={{ padding: '6rem', textAlign: 'center', color: 'var(--text-dim)', borderRadius: '32px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
            <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>Your strategy is currently a blank canvas. Start planning!</p>
          </div>
        ) : (
          allGoals.map((goal, index) => (
            <motion.div 
              key={`${goal.type}-${goal.id}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ x: 10, background: 'rgba(255,255,255,0.03)' }}
              className="glass"
              style={{ 
                padding: '1.75rem 2rem', 
                borderRadius: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '2rem',
                borderLeft: `4px solid ${goal.type === 'daily' ? 'var(--primary)' : (goal.type === 'weekly' ? 'var(--accent)' : 'var(--success)')}`
              }}
            >
              <motion.div 
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleGoal(goal.type, goal.periodId, goal.id)}
                style={{ cursor: 'pointer', color: goal.completed ? 'var(--success)' : 'var(--text-dim)', opacity: goal.completed ? 1 : 0.5 }}
              >
                {goal.completed ? <CheckCircle size={32} /> : <Circle size={32} />}
              </motion.div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 900, 
                    textDecoration: goal.completed ? 'line-through' : 'none',
                    color: goal.completed ? 'rgba(255,255,255,0.2)' : '#fff',
                    transition: 'all 0.4s',
                    letterSpacing: '-0.02em'
                  }}>
                    {goal.text}
                  </span>
                  <span className="glass" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.6rem', 
                    fontSize: '0.75rem', 
                    fontWeight: 1000, 
                    textTransform: 'uppercase',
                    padding: '8px 16px',
                    borderRadius: '14px',
                    background: goal.type === 'daily' ? 'rgba(99, 102, 241, 0.15)' : (goal.type === 'weekly' ? 'rgba(244, 114, 182, 0.15)' : 'rgba(34, 211, 238, 0.15)'),
                    color: goal.type === 'daily' ? 'var(--primary)' : (goal.type === 'weekly' ? 'var(--accent)' : 'var(--accent-cyan)'),
                    letterSpacing: '0.1em',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    {getTypeIcon(goal.type)} {goal.type}
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={14} />
                  {goal.type === 'daily' ? new Date(goal.periodId + 'T00:00:00').toLocaleDateString(undefined, { dateStyle: 'full' }) : (goal.type === 'weekly' ? `Strategic Week ${goal.periodId}` : `Visionary Year ${goal.periodId}`)}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, color: '#ef4444' }}
                onClick={() => deleteGoal(goal.type, goal.periodId, goal.id)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', opacity: 0.3 }}
              >
                <Star size={20} /> {/* Using Star as a stand-in for delete or keep it simple */}
              </motion.button>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default MasterPlanView;
