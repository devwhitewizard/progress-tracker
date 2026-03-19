import React from 'react';

const ProgressBar = ({ percentage }) => {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', overflow: 'hidden' }}>
        <div 
          style={{ 
            width: `${percentage}%`, 
            height: '100%', 
            background: 'linear-gradient(to right, #6366f1, #a855f7)',
            transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            borderRadius: '10px'
          }} 
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
