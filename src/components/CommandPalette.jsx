import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Target, Zap, Layout, Calendar, BarChart3, Settings, X, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const CommandPalette = ({ isOpen, onClose }) => {
  const { view, setView, habits, goals, selectedPeriod, setSelectedPeriod } = useAppContext();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Flatten goals for searching
  const allGoals = [];
  Object.entries(goals).forEach(([type, periods]) => {
    Object.entries(periods).forEach(([id, periodData]) => {
      if (periodData.goals) {
        periodData.goals.forEach(g => {
          allGoals.push({ ...g, type, periodId: id, category: 'Goal' });
        });
      }
    });
  });

  const navigationItems = [
    { id: 'dashboard', text: 'Go to Dashboard', icon: <Layout size={16} />, category: 'Navigation', action: () => setView('dashboard') },
    { id: 'habits', text: 'Go to Habit Tracker', icon: <Zap size={16} />, category: 'Navigation', action: () => setView('habits') },
    { id: 'analytics', text: 'Go to Analytics', icon: <BarChart3 size={16} />, category: 'Navigation', action: () => setView('analytics') },
    { id: 'calendar', text: 'Go to Calendar', icon: <Calendar size={16} />, category: 'Navigation', action: () => setView('calendar') },
    { id: 'settings', text: 'Go to Settings', icon: <Settings size={16} />, category: 'Navigation', action: () => setView('settings') },
  ];

  const searchResults = [
    ...navigationItems,
    ...habits.map(h => ({ id: h.id, text: `Habit: ${h.name}`, icon: <Zap size={16} />, category: 'Habit', action: () => setView('habits') })),
    ...allGoals.map(g => ({ id: g.id, text: `Mission: ${g.text}`, icon: <Target size={16} />, category: 'Goal', action: () => {
      setView('goals');
      setSelectedPeriod({ type: g.type, id: g.periodId });
    }}))
  ].filter(item => item.text.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % searchResults.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + searchResults.length) % searchResults.length);
      } else if (e.key === 'Enter') {
        if (searchResults[selectedIndex]) {
          searchResults[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchResults, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9998 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            style={{
              position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
              width: '100%', maxWidth: '600px', zIndex: 9999, margin: '0 auto'
            }}
          >
            <div className="saas-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--primary)', transform: 'translateX(-50%)', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)', gap: '1rem' }}>
                <Search size={20} color="var(--primary)" />
                <input 
                  ref={inputRef}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                  placeholder="Type a command or search mission..."
                  style={{
                    flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: '1rem',
                    outline: 'none', fontWeight: 500
                  }}
                />
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  <Command size={10} /> K
                </div>
              </div>

              <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '0.5rem' }}>
                {searchResults.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    No results found for "{query}"
                  </div>
                ) : (
                  searchResults.map((item, index) => (
                    <div
                      key={`${item.category}-${item.id}`}
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => { item.action(); onClose(); }}
                      style={{
                        padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem',
                        cursor: 'pointer', borderRadius: '6px',
                        background: selectedIndex === index ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ color: selectedIndex === index ? 'var(--primary)' : 'var(--text-muted)' }}>
                        {item.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9rem', color: selectedIndex === index ? '#fff' : 'var(--text-primary)', fontWeight: 500 }}>{item.text}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{item.category}</div>
                      </div>
                      {selectedIndex === index && (
                        <ChevronRight size={14} color="var(--primary)" />
                      )}
                    </div>
                  ))
                )}
              </div>

              <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <div style={{ padding: '2px 4px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}><ArrowUp size={10} /></div>
                  <div style={{ padding: '2px 4px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}><ArrowDown size={10} /></div>
                  Navigate
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <div style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>ENTER</div>
                  Select
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <div style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>ESC</div>
                  Close
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
