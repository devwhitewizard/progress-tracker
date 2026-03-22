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
  Sun,
  Moon
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, isMobileMode }) => {
  const { view, setView, isDarkMode, setIsDarkMode } = useAppContext();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'habits', label: 'Habit Tracker', icon: CheckSquare },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'master', label: 'Master Plan', icon: MapIcon },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <aside className={`sidebar-wrapper glass ${isOpen ? 'open' : 'collapsed-desktop'} ${isMobileMode ? '' : 'desktop-view'}`}>
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: '900',
              fontSize: '1.2rem',
              boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)'
            }}>
              PT
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Progress
            </h2>
          </div>
          {isMobileMode && (
            <button onClick={onClose} style={{ color: 'var(--text-dim)', padding: '0.5rem' }}>
              <X size={20} />
            </button>
          )}
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
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
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: '16px',
                  background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-dim)',
                  border: `1px solid ${isActive ? 'rgba(99, 102, 241, 0.3)' : 'transparent'}`,
                  transition: 'all 0.3s ease',
                  fontWeight: isActive ? 700 : 500,
                  width: '100%',
                  textAlign: 'left'
                }}
                className={isActive ? 'sidebar-item active hover-glow' : 'sidebar-item'}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-dim)';
                  }
                }}
              >
                <Icon size={20} style={{ color: isActive ? 'var(--primary)' : 'inherit' }} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-footer" style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '1rem',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text-main)',
              fontWeight: 600,
              border: '1px solid var(--glass-border)'
            }}
            className="hover-glow"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
