import React from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Flame, Trophy, ArrowRight, Zap, TrendingUp, Target as TargetIcon } from 'lucide-react';

// Progress Ring for Minimalist Look
const ProgressRing = ({ percentage, size = 120, strokeWidth = 8, label }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          stroke="var(--primary)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{Math.round(percentage)}%</div>
        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{label}</div>
      </div>
    </div>
  );
};

const WeekSparkline = ({ goals }) => {
  const today = new Date();
  const bars = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayGoals = goals.daily[dateStr]?.goals || [];
    const total = dayGoals.length;
    const done = dayGoals.filter(g => g.completed).length;
    const pct = total > 0 ? done / total : 0;
    const isToday = i === 0;
    bars.push({ pct, day: ['S','M','T','W','T','F','S'][d.getDay()], isToday });
  }
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '4rem' }}>
      {bars.map((b, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: `${Math.max(b.pct * 100, 10)}%` }}
            transition={{ duration: 0.8, delay: i * 0.05 }}
            style={{
              width: '100%', borderRadius: '3px',
              background: b.isToday ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
            }} 
          />
          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: b.isToday ? 'var(--primary)' : 'var(--text-muted)' }}>{b.day}</span>
        </div>
      ))}
    </div>
  );
};

import DailyBriefing from './DailyBriefing';

const Dashboard = ({ setView, setSelectedPeriod }) => {
  const { goals, streak, shields } = useAppContext();
  const today = new Date().toISOString().split('T')[0];

  const getStats = (type) => {
    const periods = goals[type] || {};
    let total = 0, completed = 0;
    Object.values(periods).forEach(p => {
      if (p && Array.isArray(p.goals)) {
        total += p.goals.length;
        completed += p.goals.filter(g => g && g.completed).length;
      }
    });
    return { type, total, completed, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const dashboardStats = [getStats('daily'), getStats('weekly'), getStats('yearly')];
  const totalTasks = dashboardStats.reduce((acc, s) => acc + s.total, 0);
  const totalCompleted = dashboardStats.reduce((acc, s) => acc + s.completed, 0);
  
  // High-Performance Formula: base% * (1 + streak_bonus)
  // Max score capped at 100 for visual consistency
  const baseRate = totalTasks > 0 ? (totalCompleted / totalTasks) : 0;
  const streakBonus = Math.min(streak * 0.05, 0.5); // Up to 50% bonus for streaks
  const productivityScore = Math.min(Math.round(baseRate * 100 * (1 + streakBonus)), 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* AI Briefing */}
      <DailyBriefing />

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        <div className="saas-card" style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <ProgressRing percentage={productivityScore} label="Productivity" size={140} />
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Productivity Index</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Calculated by completion density and current momentum.</p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{totalCompleted}<span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, marginLeft: '0.4rem' }}>Tasks Done</span></div>
            </div>
          </div>
        </div>

        <div className="saas-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ color: 'var(--primary)' }}><Flame size={20} /></div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Streak</span>
            </div>
            {shields > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 800 }}>
                <Shield size={12} fill="#10B98120" /> {shields} SHIELDS
              </div>
            )}
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900 }}>{streak} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Days</span></div>
        </div>

        <div className="saas-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ color: 'var(--primary)' }}><Trophy size={20} /></div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Rewards</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900 }}>{streak * 10} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>XP</span></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Weekly Breakdown */}
        <div className="saas-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Activity Overview</h3>
            <TrendingUp size={18} style={{ color: 'var(--text-muted)' }} />
          </div>
          <WeekSparkline goals={goals} />
        </div>

        {/* Goal Categories */}
        <div className="saas-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {dashboardStats.map(s => (
            <div key={s.type} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {s.type === 'daily' ? <Zap size={18} color="var(--primary)" /> : s.type === 'weekly' ? <TrendingUp size={18} color="var(--primary)" /> : <TargetIcon size={18} color="var(--primary)" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}>{s.type}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{Math.round(s.percentage)}%</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${s.percentage}%` }}
                    style={{ height: '100%', background: 'var(--primary)' }}
                  />
                </div>
              </div>
              <button 
                onClick={() => {
                  setView('goals');
                  setSelectedPeriod({ type: s.type, id: s.type === 'daily' ? today : (s.type === 'weekly' ? 1 : 2026) });
                }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
