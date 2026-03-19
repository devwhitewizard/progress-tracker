import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
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
    const d = new Date(year, month, day + 1); // +1 because toISOString might shift due to timezone if not careful
    const dateString = new Date(year, month, day).toLocaleDateString('en-CA'); // YYYY-MM-DD
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass"
      style={{ padding: '2rem', borderRadius: '32px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CalendarIcon size={28} className="text-primary" />
          {monthName} {year}
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={prevMonth} className="glass-btn" style={{ padding: '0.5rem' }}><ChevronLeft size={20} /></button>
          <button onClick={nextMonth} className="glass-btn" style={{ padding: '0.5rem' }}><ChevronRight size={20} /></button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontWeight: 700, color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{d}</div>
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
                borderRadius: '16px',
                border: isToday ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                background: day ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: day ? 'pointer' : 'default',
                position: 'relative',
                transition: 'all 0.2s ease',
                transform: day ? 'none' : 'none'
              }}
              className={day ? 'calendar-day-hover' : ''}
            >
              <span style={{ fontSize: '1.1rem', fontWeight: 600, color: day ? 'inherit' : 'transparent' }}>{day}</span>
              {status === 'pending' && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fbbf24' }}></div>}
              {status === 'completed' && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>}
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
