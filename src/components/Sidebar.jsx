import React from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Target, 
  CalendarDays, 
  Map as MapIcon, 
  BarChart3, 
  CheckSquare, 
  Settings,
  X,
  User,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, onClose, isMobileMode }) => {
  const { view, setView } = useAppContext();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'habits', label: 'Habit Tracker', icon: CheckSquare },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'master', label: 'Master Plan', icon: MapIcon },
    { id: 'roadmap', label: 'Strategic Roadmap', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
        className={`sidebar-wrapper ${isOpen ? 'open' : 'collapsed-desktop'} ${isMobileMode ? '' : 'desktop-view'}`} 
        style={{ 
          background: 'var(--bg-card)', 
          borderRight: '1px solid var(--border-color)', 
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="sidebar-header" style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '6px', 
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: '800',
              fontSize: '1rem'
            }}>
              P
            </div>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 800, 
              margin: 0, 
              color: '#fff',
              letterSpacing: '-0.02em',
              fontFamily: 'Inter'
            }}>
              Progress
            </h2>
          </div>
          {isMobileMode && (
            <button onClick={onClose} style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          )}
        </div>

        <nav style={{ padding: '0.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 0.5rem 0.5rem' }}>Management</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  if (isMobileMode) onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.7rem 0.8rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  border: 'none',
                  transition: 'all 0.15s ease',
                  fontWeight: isActive ? 600 : 500,
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <Icon size={18} />
                <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active-indicator"
                    style={{ marginLeft: 'auto', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)' }}
                  />
                )}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-footer" style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-obsidian)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} color="var(--text-secondary)" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Account Settings</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Member</div>
            </div>
          </div>
        </div>
    </aside>
  );
};

export default Sidebar;
