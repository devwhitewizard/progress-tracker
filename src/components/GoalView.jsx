import React from 'react';
import { useAppContext } from '../context/AppContext';
import ProgressBar from './ProgressBar';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, CheckCircle, Circle } from 'lucide-react';

const GoalView = () => {
  const { selectedPeriod, goals, toggleGoal, deleteGoal } = useAppContext();
  const periodData = goals[selectedPeriod.type][selectedPeriod.id] || { goals: [] };
  const periodGoals = periodData.goals;
  
  const completedCount = periodGoals.filter(g => g.completed).length;
  const percentage = periodGoals.length > 0 ? (completedCount / periodGoals.length) * 100 : 0;

  const getSubTitle = () => {
    if (selectedPeriod.type === 'daily') return 'Focus on what matters today';
    if (selectedPeriod.type === 'weekly') return 'Achieve your weekly objectives';
    if (selectedPeriod.type === 'yearly') return 'Focus on the big picture';
    return '';
  };

  return (
    <motion.div 
      key={`${selectedPeriod.type}-${selectedPeriod.id}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="glass" style={{ padding: '2rem', borderRadius: '24px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {selectedPeriod.type.charAt(0).toUpperCase() + selectedPeriod.type.slice(1)} Mastery
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{getSubTitle()}</p>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{completedCount}/{periodGoals.length}</div>
        </div>
        <ProgressBar percentage={percentage} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <AnimatePresence>
          {periodGoals.map(goal => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass"
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                background: goal.completed ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                border: goal.completed ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--glass-border)',
                transition: 'all 0.3s ease'
              }}
            >
              <button 
                onClick={() => toggleGoal(selectedPeriod.type, selectedPeriod.id, goal.id)}
                style={{ color: goal.completed ? '#10b981' : '#475569', display: 'flex', alignItems: 'center' }}
              >
                {goal.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
              </button>
              
              <span style={{ 
                flex: 1, 
                fontSize: '1.1rem', 
                fontWeight: 500,
                textDecoration: goal.completed ? 'line-through' : 'none',
                color: goal.completed ? '#64748b' : 'inherit'
              }}>
                {goal.text}
              </span>

              <button 
                onClick={() => deleteGoal(selectedPeriod.type, selectedPeriod.id, goal.id)}
                style={{ color: '#ef4444', padding: '0.5rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center' }}
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {periodGoals.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>No goals planned for this {selectedPeriod.type} yet.</p>
            <p style={{ fontSize: '0.875rem' }}>Click "Add Goal" to get started!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GoalView;
