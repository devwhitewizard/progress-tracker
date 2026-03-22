import React from 'react';
import { useAppContext } from '../context/AppContext';
import ProgressBar from './ProgressBar';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Flame, Trophy, ArrowRight } from 'lucide-react';

// SVG Progress Ring
const ProgressRing = ({ percentage, size = 90, strokeWidth = 7, color = '#6366f1' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
};

// 7-bar weekly sparkline
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
    bars.push({ pct, total, done, day: ['S','M','T','W','T','F','S'][d.getDay()], isToday });
  }
  return (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '4rem' }}>
      {bars.map((b, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
          <div style={{
            width: '100%', borderRadius: '6px 6px 0 0',
            height: `${Math.max(b.pct * 44 + 4, 4)}px`,
            background: b.pct === 1 ? 'var(--success)' : b.pct > 0 ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
            boxShadow: b.pct > 0 ? `0 0 10px ${b.pct === 1 ? 'rgba(16,185,129,0.4)' : 'rgba(99,102,241,0.3)'}` : 'none',
            transition: 'height 0.6s ease',
            border: b.isToday ? '1px solid var(--accent-cyan)' : 'none',
          }} />
          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: b.isToday ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.3)' }}>{b.day}</span>
        </div>
      ))}
    </div>
  );
};

const MOTIVATIONAL_MESSAGES = [
  { min: 0,  max: 0,  msg: "Every legend starts with day 1. Today is yours. 🌱" },
  { min: 1,  max: 2,  msg: "You've started! Keep the momentum alive. ⚡" },
  { min: 3,  max: 6,  msg: "3+ days strong. A habit is forming — don't break it! 🔥" },
  { min: 7,  max: 13, msg: "One full week. You're in a rhythm now. Keep pushing! 🚀" },
  { min: 14, max: 29, msg: "Two weeks of consistency. You're becoming unstoppable! 💪" },
  { min: 30, max: 59, msg: "30 days! You've built a genuine habit. Legendary. 🏆" },
  { min: 60, max: Infinity, msg: "60+ days. You're in elite territory. Stay there. 👑" },
];

const getMotivationalMsg = (streak) =>
  MOTIVATIONAL_MESSAGES.find(m => streak >= m.min && streak <= m.max)?.msg || '';

const RING_COLORS = { daily: '#6366f1', weekly: '#f472b6', yearly: '#22d3ee' };

const Dashboard = ({ setView, setSelectedPeriod }) => {
  const { goals, streak, getDatesForWeek } = useAppContext();
  const today = new Date().toISOString().split('T')[0];

  const getStatsForPeriodType = (type) => {
    if (type === 'weekly') {
      let total = 0, completed = 0;
      [1, 2, 3].forEach(wId => {
        const weeklyGoals = goals.weekly?.[wId]?.goals || [];
        const dates = getDatesForWeek(wId) || [];
        const dailyGoals = dates.flatMap(d => goals.daily?.[d]?.goals || []);
        total += weeklyGoals.length + dailyGoals.length;
        completed += weeklyGoals.filter(g => g?.completed).length + dailyGoals.filter(g => g?.completed).length;
      });
      return { type, total, completed, percentage: total > 0 ? (completed / total) * 100 : 0 };
    }
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
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
    >
      {/* Top Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        {/* Streak Card */}
        <div className="glass floating-glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: '120px', height: '120px', background: 'var(--primary)', filter: 'blur(50px)', opacity: 0.12 }} />
          <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #f97316, #ef4444)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 20px rgba(239,68,68,0.35)' }}>
            <Flame size={24} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#fff', letterSpacing: '-0.05em', lineHeight: 1 }}>{streak}</div>
            <div style={{ color: 'var(--accent-cyan)', fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Day Streak</div>
          </div>
        </div>

        {/* Total Completed */}
        <div className="glass floating-glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: '120px', height: '120px', background: 'var(--accent)', filter: 'blur(50px)', opacity: 0.12 }} />
          <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 20px rgba(99,102,241,0.35)' }}>
            <Trophy size={24} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#fff', letterSpacing: '-0.05em', lineHeight: 1 }}>{totalCompleted}</div>
            <div style={{ color: 'var(--accent)', fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Goals Completed</div>
          </div>
        </div>

        {/* Weekly Sparkline */}
        <div className="glass floating-glass" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>This Week</div>
          <WeekSparkline goals={goals} />
        </div>
      </div>

      {/* Motivational message */}
      <div className="glass" style={{ padding: '1.25rem 1.75rem', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(244,114,182,0.08))', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 700, fontSize: '1rem', margin: 0, letterSpacing: '-0.01em' }}>
          {getMotivationalMsg(streak)}
        </p>
      </div>

      {/* Total Progress bar */}
      <div className="glass floating-glass" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.07), rgba(244,114,182,0.07))', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '70%', height: '70%', background: 'radial-gradient(circle, rgba(99,102,241,0.07), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '4rem', fontWeight: 1000, background: 'linear-gradient(to right, #fff, var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.06em', lineHeight: 0.9 }}>
            {Math.round(overallPercentage)}<span style={{ fontSize: '2rem', opacity: 0.5 }}>%</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Total Progress</span>
        </div>
        <ProgressBar percentage={overallPercentage} />
      </div>

      {/* Period Progress Rings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {dashboardStats.map(s => (
          <motion.div
            key={s.type}
            whileHover={{ y: -4, scale: 1.01 }}
            className="glass floating-glass"
            style={{ padding: '1.75rem', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <ProgressRing percentage={s.percentage} color={RING_COLORS[s.type]} size={80} strokeWidth={7} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 900, color: '#fff' }}>
                  {Math.round(s.percentage)}%
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.3rem', textTransform: 'capitalize' }}>{s.type}</h3>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', fontWeight: 700 }}>
                  {s.completed} / {s.total} complete
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setView('goals');
                setSelectedPeriod({ type: s.type, id: s.type === 'daily' ? today : (s.type === 'weekly' ? 1 : 2026) });
              }}
              style={{
                width: '100%', marginTop: '1.25rem', padding: '0.85rem',
                borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)', color: '#fff', fontWeight: 700,
                fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
              }}
              className="hover-glow"
            >
              View Goals <ArrowRight size={15} />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Dashboard;
