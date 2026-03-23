import React from 'react';
import { motion } from 'framer-motion';

const LiquidGauge = ({ percent = 0, size = 180, label = "Progress" }) => {
  const radius = size / 2;
  const strokeWidth = size * 0.1;
  const innerRadius = radius - strokeWidth;
  
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* 3D Glass Container Ring */}
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle
          cx={radius}
          cy={radius}
          r={innerRadius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Glow Path */}
        <motion.circle
          cx={radius}
          cy={radius}
          r={innerRadius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={strokeWidth}
          strokeDasharray={2 * Math.PI * innerRadius}
          initial={{ strokeDashoffset: 2 * Math.PI * innerRadius }}
          animate={{ strokeDashoffset: 2 * Math.PI * innerRadius * (1 - percent / 100) }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 8px var(--primary))', opacity: 0.4 }}
        />
      </svg>

      {/* Central Liquid Fill */}
      <div style={{ 
        width: innerRadius * 1.7, 
        height: innerRadius * 1.7, 
        borderRadius: '50%', 
        overflow: 'hidden',
        position: 'relative',
        background: 'rgba(0,0,0,0.2)',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        zIndex: 2
      }}>
        <motion.div
          initial={{ top: '100%' }}
          animate={{ top: `${100 - percent}%` }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'linear-gradient(180deg, var(--primary) 0%, var(--primary-deep) 100%)',
            borderRadius: '40%',
            zIndex: -1,
            animation: 'wave 8s infinite linear',
            opacity: 0.8,
            boxShadow: '0 0 30px var(--primary)'
          }}
        />
        
        <span style={{ fontSize: `${size * 0.18}px`, fontWeight: 900, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          {Math.round(percent)}%
        </span>
        <span style={{ fontSize: `${size * 0.06}px`, textTransform: 'uppercase', fontWeight: 800, opacity: 0.5, letterSpacing: '0.1em', marginTop: '4px' }}>
          {label}
        </span>
      </div>

      <style>{`
        @keyframes wave {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LiquidGauge;
