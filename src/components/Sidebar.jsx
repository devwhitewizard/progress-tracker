import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  LayoutDashboard, CalendarDays, CheckSquare, BarChart2,
  Target, ChevronDown, X,
  Calendar, Star, Sun
} from 'lucide-react';

const NavItem = ({ label, icon, isActive, onClick, indent = false }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '0.85rem',
      padding: indent ? '0.75rem 1.4rem 0.75rem 2.5rem' : '0.85rem 1.4rem',
      borderRadius: '14px',
      color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
      background: isActive
        ? 'linear-gradient(135deg, var(--primary), var(--primary-deep))'
        : 'transparent',
      border: isActive ? 'none' : '1px solid transparent',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: isActive ? '0 8px 20px rgba(99, 102, 241, 0.3)' : 'none',
      fontWeight: isActive ? 800 : 600,
      fontSize: indent ? '0.9rem' : '0.95rem',
      textAlign: 'left',
      borderLeft: isActive ? 'none' : 'none',
      position: 'relative',
    }}
    className={isActive ? '' : 'hover-glow'}
  >
    <span style={{ color: isActive ? '#fff' : 'var(--primary)', flexShrink: 0, opacity: isActive ? 1 : 0.8 }}>
      {icon}
    </span>
    {label}
  </button>
);

const SectionLabel = ({ children }) => (
  <div style={{
    fontSize: '0.65rem',
    fontWeight: 900,
    color: 'var(--accent-cyan)',
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    opacity: 0.7,
    padding: '1.5rem 1.4rem 0.5rem',
  }}>
    {children}
  </div>
);

const Sidebar = ({ isOpen, onClose, isMobileMode }) => {
  const { view, setView, selectedPeriod, setSelectedPeriod } = useAppContext();
  const [goalsOpen, setGoalsOpen] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  const navigate = (viewId, period = null) => {
    setView(viewId);
    if (period) setSelectedPeriod(period);
    if (onClose && isMobileMode) onClose();
  };

  const isGoalActive = (type) => view === 'goals' && selectedPeriod.type === type;
  
  const sidebarClasses = `sidebar-wrapper ${isOpen ? 'open' : ''} ${!isOpen && !isMobileMode ? 'collapsed-desktop' : ''}`;

  return (
    <aside className={sidebarClasses}>
      <div className="floating-glass" style={{
        width: '100%', flex: 1, padding: '1.5rem 1rem',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Glow blob */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--primary)', filter: 'blur(70px)', opacity: 0.08, pointerEvents: 'none' }} />

        {/* Logo + Close */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', padding: '0 0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: '10px', boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)', flexShrink: 0 }} />
            <span style={{ fontSize: '1.4rem', fontWeight: 900, background: 'linear-gradient(to right, #fff, var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.04em' }}>
              PRO TRACK
            </span>
          </div>
          <button
            style={{ display: isOpen ? 'flex' : 'none', padding: '0.4rem', border: 'none', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', cursor: 'pointer', color: '#fff', alignItems: 'center', justifyContent: 'center' }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>

          <SectionLabel>Tracking</SectionLabel>
          <NavItem id="dashboard" label="Dashboard" icon={<LayoutDashboard size={18} />} isActive={view === 'dashboard'} onClick={() => navigate('dashboard')} />
          <NavItem id="habits" label="Habits" icon={<CheckSquare size={18} />} isActive={view === 'habits'} onClick={() => navigate('habits')} />
          <NavItem id="calendar" label="Calendar" icon={<CalendarDays size={18} />} isActive={view === 'calendar'} onClick={() => navigate('calendar')} />
          <NavItem id="analytics" label="Analytics" icon={<BarChart2 size={18} />} isActive={view === 'analytics'} onClick={() => navigate('analytics')} />

          <SectionLabel>Goals</SectionLabel>
          {/* Expandable Goals Group */}
          <button
            onClick={() => setGoalsOpen(o => !o)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.85rem 1.4rem', borderRadius: '14px',
              color: (view === 'goals' || view === 'master') ? '#fff' : 'rgba(255,255,255,0.5)',
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: '0.95rem',
              transition: 'all 0.2s'
            }}
            className="hover-glow"
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <span style={{ color: 'var(--primary)', opacity: 0.8 }}><Target size={18} /></span>
              All Goals
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)', transition: 'transform 0.3s', transform: goalsOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
              <ChevronDown size={16} />
            </span>
          </button>

          {goalsOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '0.5rem' }}>
              <NavItem indent id="daily" label="Daily Goals" icon={<Sun size={16} />} isActive={isGoalActive('daily')} onClick={() => navigate('goals', { type: 'daily', id: today })} />
              <NavItem indent id="weekly" label="Weekly Goals" icon={<Calendar size={16} />} isActive={isGoalActive('weekly')} onClick={() => navigate('goals', { type: 'weekly', id: 1 })} />
              <NavItem indent id="yearly" label="Yearly Goals" icon={<Star size={16} />} isActive={isGoalActive('yearly')} onClick={() => navigate('goals', { type: 'yearly', id: 2026 })} />
              <NavItem indent id="master" label="All Goals View" icon={<BarChart2 size={16} />} isActive={view === 'master'} onClick={() => navigate('master')} />
            </div>
          )}
        </nav>

        {/* Footer hint */}
        <div style={{ padding: '1rem 0.4rem 0', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '1rem' }}>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', fontWeight: 600, letterSpacing: '0.05em' }}>
            Progress Tracker · v2.0
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
