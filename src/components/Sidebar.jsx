import React from 'react';
import { useAppContext } from '../context/AppContext';
import { LayoutDashboard, Calendar as CalendarIcon, History, Moon, Sun, ChevronRight } from 'lucide-react';

const Sidebar = () => {
  const { view, setView, selectedPeriod, setSelectedPeriod, isDarkMode, setIsDarkMode, streak } = useAppContext();

  const periods = [
    { type: 'daily', label: "Today's Goals", id: new Date().toISOString().split('T')[0] },
    { type: 'weekly', label: "Weekly Planning", id: 1 }, // Default to Week 1
    { type: 'yearly', label: "Yearly Vision", id: 2026 }
  ];

  return (
    <aside className="glass" style={{ width: '280px', height: '100%', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '8px' }}></div>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Tracker</span>
      </div>

      <div style={{ marginBottom: '2rem', padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.25rem' }}>🔥</span>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>STREAK</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{streak} Days</div>
        </div>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto' }}>
        <button
          onClick={() => setView('dashboard')}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', borderRadius: '12px',
            color: view === 'dashboard' ? 'var(--primary)' : '#94a3b8',
            background: view === 'dashboard' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
            marginBottom: '0.5rem', transition: 'all 0.2s ease',
            border: view === 'dashboard' ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent'
          }}
        >
          <LayoutDashboard size={20} />
          <span style={{ fontWeight: 600 }}>Dashboard</span>
        </button>

        <button
          onClick={() => setView('calendar')}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', borderRadius: '12px',
            color: view === 'calendar' ? 'var(--primary)' : '#94a3b8',
            background: view === 'calendar' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
            marginBottom: '0.5rem', transition: 'all 0.2s ease',
            border: view === 'calendar' ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent'
          }}
        >
          <CalendarIcon size={20} />
          <span style={{ fontWeight: 600 }}>Calendar</span>
        </button>

        <button
          onClick={() => setView('timeline')}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', borderRadius: '12px',
            color: view === 'timeline' ? 'var(--primary)' : '#94a3b8',
            background: view === 'timeline' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
            marginBottom: '1.5rem', transition: 'all 0.2s ease',
            border: view === 'timeline' ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent'
          }}
        >
          <History size={20} />
          <span style={{ fontWeight: 600 }}>Timeline</span>
        </button>

        <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.75rem', marginLeft: '0.5rem' }}>GOALS</div>
        
        {periods.map(p => (
          <button
            key={p.type}
            onClick={() => { setView('goals'); setSelectedPeriod({ type: p.type, id: p.id }); }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', borderRadius: '12px',
              color: (view === 'goals' && selectedPeriod.type === p.type) ? 'var(--primary)' : '#94a3b8',
              background: (view === 'goals' && selectedPeriod.type === p.type) ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              marginBottom: '0.5rem', transition: 'all 0.2s ease',
              border: (view === 'goals' && selectedPeriod.type === p.type) ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent'
            }}
          >
            <CalendarIcon size={20} />
            <span style={{ fontWeight: 600 }}>{p.label}</span>
          </button>
        ))}

        {view === 'goals' && selectedPeriod.type === 'weekly' && (
          <div style={{ marginLeft: '2.5rem', display: 'flex', flexDirection: 'column' }}>
            {[1, 2, 3].map(w => (
              <button
                key={w}
                onClick={() => setSelectedPeriod({ type: 'weekly', id: w })}
                style={{ 
                  padding: '0.5rem 0', textAlign: 'left', fontSize: '0.875rem', 
                  color: selectedPeriod.id === w ? 'var(--primary)' : '#64748b',
                  fontWeight: selectedPeriod.id === w ? 700 : 500
                }}
              >
                Week {w}
              </button>
            ))}
          </div>
        )}
      </nav>

      <div className="glass" style={{ marginTop: 'auto', padding: '1rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
          {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Dark Mode</span>
        </div>
        <input 
          type="checkbox" 
          checked={isDarkMode} 
          onChange={(e) => setIsDarkMode(e.target.checked)}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
