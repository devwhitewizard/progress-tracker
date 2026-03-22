import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const CalendarView = () => {
  const { goals, setView, setSelectedPeriod } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  // Padding for start of month
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // Actual days
  for (let d = 1; d <= totalDays; d++) {
    days.push(d);
  }

  const handleDateClick = (day) => {
    if (!day) return;
    const d = new Date(year, month, day);
    const dateString = d.toLocaleDateString('en-CA'); // YYYY-MM-DD
    setSelectedPeriod({ type: 'daily', id: dateString });
    setView('goals');
  };

  const getDayStatus = (day) => {
    if (!day) return null;
    const dateString = new Date(year, month, day).toLocaleDateString('en-CA');
    const dayData = goals.daily[dateString];
    if (!dayData || dayData.goals.length === 0) return null;
    
    const allCompleted = dayData.goals.every(g => g.completed);
    return allCompleted ? 'completed' : 'pending';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass floating-glass"
      style={{ padding: '2rem', position: 'relative', overflow: 'hidden', maxWidth: '800px', margin: '0 auto' }}
    >
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '200px', height: '200px', background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.1 }}></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 1000, display: 'flex', alignItems: 'center', gap: '1rem', letterSpacing: '-0.04em' }}>
          <CalendarIcon size={36} style={{ color: 'var(--accent-cyan)' }} />
          {monthName} <span style={{ opacity: 0.3 }}>{year}</span>
        </h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={prevMonth} className="glass" style={{ padding: '0.8rem', borderRadius: '14px', color: '#fff' }}><ChevronLeft size={24} /></button>
          <button onClick={nextMonth} className="glass" style={{ padding: '0.8rem', borderRadius: '14px', color: '#fff' }}><ChevronRight size={24} /></button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontWeight: 800, color: 'var(--primary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', opacity: 0.8 }}>{d}</div>
        ))}
        
        {days.map((day, i) => {
          const status = getDayStatus(day);
          const isToday = day && new Date().toLocaleDateString('en-CA') === new Date(year, month, day).toLocaleDateString('en-CA');

          return (
            <button
              key={i}
              onClick={() => day && handleDateClick(day)}
              disabled={!day}
              style={{
                aspectRatio: '1',
                borderRadius: '20px',
                border: isToday ? '2px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.05)',
                background: day ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: day ? 'pointer' : 'default',
                position: 'relative',
                transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                boxShadow: isToday ? '0 0 30px rgba(34, 211, 238, 0.2)' : 'none'
              }}
              className={day ? 'calendar-day-hover hover-glow' : ''}
            >
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: isToday ? '#fff' : (day ? 'rgba(255,255,255,0.8)' : 'transparent'), letterSpacing: '-0.02em' }}>{day}</span>
              {status === 'pending' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 15px var(--accent)' }}></div>}
              {status === 'completed' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 15px var(--success)' }}></div>}
            </button>
          );
        })}
      </div>

      <style>{`
        .calendar-day-hover:hover {
          background: rgba(99, 102, 241, 0.1) !important;
          border-color: rgba(99, 102, 241, 0.4) !important;
          transform: translateY(-2px);
        }
        .text-primary { color: var(--primary); }
        .glass-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          cursor: pointer;
          color: inherit;
        }
        .glass-btn:hover { background: rgba(255, 255, 255, 0.1); }
      `}</style>
    </motion.div>
  );
};

export default CalendarView;
