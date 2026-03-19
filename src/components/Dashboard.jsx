import React from 'react';
import { useAppContext } from '../context/AppContext';
import ProgressBar from './ProgressBar';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { goals, setView, setSelectedPeriod, streak } = useAppContext();
  const today = new Date().toISOString().split('T')[0];

  const getStatsForPeriodType = (type) => {
    const periods = goals[type];
    let total = 0;
    let completed = 0;
    Object.values(periods).forEach(p => {
      total += p.goals.length;
      completed += p.goals.filter(g => g.completed).length;
    });
    return { type, total, completed, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const dashboardStats = [
    getStatsForPeriodType('daily'),
    getStatsForPeriodType('weekly'),
    getStatsForPeriodType('yearly')
  ];

  const totalGoals = dashboardStats.reduce((acc, s) => acc + s.total, 0);
  const totalCompleted = dashboardStats.reduce((acc, s) => acc + s.completed, 0);
  const overallPercentage = totalGoals > 0 ? (totalCompleted / totalGoals) * 100 : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600 }}>Current Streak</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800 }}>{streak}</span>
            <span style={{ fontSize: '1.5rem' }}>🔥</span>
          </div>
        </div>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600 }}>Total Achievements</span>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{totalCompleted}</div>
        </div>
      </div>

      <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px', marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.5rem' }}>Overall Mastery</h2>
        <div style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem' }}>{Math.round(overallPercentage)}%</div>
        <ProgressBar percentage={overallPercentage} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {dashboardStats.map(s => (
          <motion.div 
            key={s.type}
            whileHover={{ y: -5 }}
            className="glass" 
            style={{ padding: '2rem', borderRadius: '24px' }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
              {s.type.charAt(0).toUpperCase() + s.type.slice(1)} Goals
            </h3>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
              {s.completed} of {s.total} completed
            </div>
            <ProgressBar percentage={s.percentage} />
            <button 
              onClick={() => { setView('goals'); setSelectedPeriod({ type: s.type, id: s.type === 'daily' ? today : (s.type === 'weekly' ? 1 : 2026) }); }}
              style={{ width: '100%', marginTop: '1.5rem', padding: '0.875rem', borderRadius: '12px', border: '1px solid var(--glass-border)', color: '#f1f5f9', fontWeight: 600 }}
            >
              Focus Here
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Dashboard;
