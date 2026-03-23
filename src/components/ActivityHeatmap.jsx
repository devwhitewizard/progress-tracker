import React from 'react';
import { motion } from 'framer-motion';

const ActivityHeatmap = ({ data = [] }) => {
  // Generate a mock year of data if none provided
  const generateMockData = () => {
    const days = 365;
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000),
      intensity: Math.floor(Math.random() * 5) // 0 to 4 level
    }));
  };

  const heatmapData = data.length > 0 ? data : generateMockData();
  
  const getLevelColor = (level) => {
    switch (level) {
      case 0: return 'rgba(255, 255, 255, 0.03)';
      case 1: return 'rgba(57, 255, 20, 0.15)';
      case 2: return 'rgba(57, 255, 20, 0.35)';
      case 3: return 'rgba(57, 255, 20, 0.6)';
      case 4: return 'rgba(57, 255, 20, 0.9)';
      default: return 'rgba(255, 255, 255, 0.03)';
    }
  };

  const getLevelGlow = (level) => {
    if (level === 0) return 'none';
    return `0 0 ${level * 4}px rgba(57, 255, 20, ${level * 0.2})`;
  };

  return (
    <div className="heatmap-container" style={{ padding: '1.5rem', width: '100%', overflowX: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, opacity: 0.8, color: '#fff' }}>Activity Heatmap</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
          <span>Less</span>
          {[0, 1, 2, 3, 4].map(l => (
            <div key={l} style={{ width: '10px', height: '10px', borderRadius: '2px', background: getLevelColor(l) }}></div>
          ))}
          <span>More</span>
        </div>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(53, 1fr)', 
        gridAutoFlow: 'column',
        gridTemplateRows: 'repeat(7, 1fr)',
        gap: '4px',
        minWidth: '700px'
      }}>
        {heatmapData.map((day, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.001 }}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '3px',
              background: getLevelColor(day.intensity),
              boxShadow: getLevelGlow(day.intensity),
              cursor: 'pointer'
            }}
            whileHover={{ scale: 1.3, zIndex: 10, boxShadow: '0 0 15px rgba(57, 255, 20, 0.6)' }}
            title={`${day.date.toDateString()}: ${day.intensity} activities`}
          />
        ))}
      </div>
    </div>
  );
};

export default ActivityHeatmap;
