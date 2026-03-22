import React from 'react';
import { useAppContext } from '../context/AppContext';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

const Timeline = () => {
  const { goals } = useAppContext();

  const allPeriods = [
    ...Object.entries(goals.daily).map(([id, data]) => ({ type: 'daily', id, ...data })),
    ...Object.entries(goals.weekly).map(([id, data]) => ({ type: 'weekly', id, ...data })),
    ...Object.entries(goals.yearly).map(([id, data]) => ({ type: 'yearly', id, ...data })),
  ].filter(p => p.goals.length > 0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ position: 'relative', paddingLeft: '2rem' }}
    >
      <div style={{ position: 'absolute', left: '0', top: '0', bottom: '0', width: '2px', background: 'var(--glass-border)', marginLeft: '8px' }}></div>
      
      {allPeriods.length > 0 ? allPeriods.map((period) => (
        <div key={`${period.type}-${period.id}`} style={{ position: 'relative', marginBottom: '3rem' }}>
          <div style={{ 
            position: 'absolute', left: '-2rem', top: '4px', width: '18px', height: '18px', borderRadius: '50%', 
            background: 'var(--primary)', boxShadow: '0 0 12px var(--primary)', zIndex: 1
          }}></div>
          
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--primary)' }}>
            {period.type.charAt(0).toUpperCase() + period.type.slice(1)} - {period.id}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {period.goals.map(goal => (
              <div key={goal.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: goal.completed ? '#10b981' : '#94a3b8' }}>
                {goal.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                <span style={{ fontSize: '1rem', fontWeight: 500 }}>{goal.text}</span>
              </div>
            ))}
          </div>
        </div>
      )) : (
        <div style={{ color: '#64748b', textAlign: 'center', padding: '4rem' }}>No goals recorded yet. Start planning!</div>
      )}
    </motion.div>
  );
};

export default Timeline;
