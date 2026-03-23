import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
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

  for (let i = 0; i < startDay; i++) days.push(null);
  for (let d = 1; d <= totalDays; d++) days.push(d);

  const handleDateClick = (day) => {
    if (!day) return;
    const d = new Date(year, month, day);
    const dateString = d.toLocaleDateString('en-CA');
    setSelectedPeriod({ type: 'daily', id: dateString });
    setView('goals');
  };

  const getDayStatus = (day) => {
    if (!day) return null;
    const dateString = new Date(year, month, day).toLocaleDateString('en-CA');
    const dayData = goals.daily[dateString];
    if (!dayData || dayData.goals.length === 0) return null;
    return dayData.goals.every(g => g.completed) ? 'completed' : 'pending';
  };

  return (
    <div className="saas-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarIcon size={20} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
            {monthName} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{year}</span>
          </h2>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={prevMonth} style={{ padding: '0.4rem', background: 'var(--bg-obsidian)', borderRadius: '6px', border: '1px solid var(--border-color)', color: '#fff', cursor: 'pointer' }}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={nextMonth} style={{ padding: '0.4rem', background: 'var(--bg-obsidian)', borderRadius: '6px', border: '1px solid var(--border-color)', color: '#fff', cursor: 'pointer' }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{d}</div>
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
                borderRadius: '6px',
                border: isToday ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                background: isToday ? 'rgba(99, 102, 241, 0.05)' : (day ? 'var(--bg-obsidian)' : 'transparent'),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: day ? 'pointer' : 'default',
                transition: 'all 0.2s',
                padding: 0
              }}
            >
              <span style={{ 
                fontSize: '0.9rem', 
                fontWeight: isToday ? 700 : 500, 
                color: isToday ? 'var(--primary)' : (day ? '#fff' : 'transparent'), 
              }}>
                {day}
              </span>
              
              <div style={{ height: '3px', marginTop: '4px' }}>
                {status && <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: status === 'completed' ? '#10B981' : 'var(--primary)' }}></div>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
