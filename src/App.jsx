import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GoalView from './components/GoalView';
import CalendarView from './components/CalendarView';
import MasterPlanView from './components/MasterPlanView';
import AddGoalModal from './components/AddGoalModal';
import HabitTracker from './components/HabitTracker';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import Login from './components/Login';
import Register from './components/Register';
import StrategicRoadmap from './components/StrategicRoadmap';
import CommandPalette from './components/CommandPalette';
import { useAppContext } from './context/AppContext';
import { useAuthContext } from './context/AuthContext';
import { Plus, Sun, Moon, Star, Menu, Search, Command } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { user, loading } = useAuthContext();
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  
  const { view, setView, selectedPeriod, setSelectedPeriod, isDarkMode, setIsDarkMode } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobileMode, setIsMobileMode] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobileMode(mobile);
      if (!mobile) {
        setIsSidebarOpen(true); // reset to open on desktop resize
      } else {
        setIsSidebarOpen(false); // close by default on mobile
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getTitle = () => {
    if (view === 'dashboard') return 'Dashboard';
    if (view === 'habits') return 'Habit Tracker';
    if (view === 'calendar') return 'Calendar';
    if (view === 'master') return 'Yearly Goals';
    if (view === 'analytics') return 'Analytics';
    if (view === 'settings') return 'Settings & Profile';
    if (view === 'goals') {
      const { type, id } = selectedPeriod;
      if (type === 'daily') return id === new Date().toISOString().split('T')[0] ? "Today's Planning" : `Planning for ${id}`;
      if (type === 'weekly') return `Week ${id} Planning`;
      if (type === 'yearly') return `${id} Vision`;
    }
    if (view === 'roadmap') return 'Strategic Roadmap';
    return 'Progress Tracker';
  };

  if (loading) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 800, animation: 'pulse 1.5s infinite' }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return authView === 'login' 
      ? <Login switchToRegister={() => setAuthView('register')} />
      : <Register switchToLogin={() => setAuthView('login')} />;
  }

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : 'light'}`} style={{ backgroundColor: 'var(--bg-obsidian)', minHeight: '100vh', transition: 'background-color 0.3s' }}>
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isMobileMode={isMobileMode}
      />
      
      <div 
        className={`overlay ${isSidebarOpen && isMobileMode ? 'open' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <main className={`main-wrapper ${!isSidebarOpen && !isMobileMode ? 'expanded' : ''}`}>
        <header className="header-wrapper" style={{ padding: '2rem 3rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <button 
            className={`mobile-menu-btn ${isSidebarOpen ? 'active' : ''}`} 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle Menu"
            style={{ position: 'fixed', top: '1.25rem', left: isSidebarOpen ? '18rem' : '1.5rem', zIndex: 1000, transition: 'left 0.3s ease', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem', color: '#fff' }}
          >
            <Menu size={20} />
          </button>

          <div className="header-title-container">
            <h1 className="page-title" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              {getTitle()}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>
              Enterprise Productivity
            </p>
          </div>
          
          <div className="header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              onClick={() => setIsCommandPaletteOpen(true)}
              style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
              title="Search (Ctrl+K)"
            >
              <Search size={18} />
              <div style={{ display: 'flex', gap: '2px', alignItems: 'center', opacity: 0.5, fontSize: '0.7rem' }}>
                <Command size={10} /> K
              </div>
            </button>

            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: '#fff', cursor: 'pointer' }}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
              style={{ padding: '0.75rem 1.5rem', borderRadius: '8px' }}
            >
              <Plus size={18} /> Create New Goal
            </button>
          </div>
        </header>

        <section className="content-wrapper" style={{ padding: '2.5rem 3rem' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={view + (selectedPeriod.id || '')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {view === 'dashboard' && <Dashboard setView={setView} setSelectedPeriod={setSelectedPeriod} />}
              {view === 'habits' && <HabitTracker />}
              {view === 'goals' && <GoalView />}
              {view === 'calendar' && <CalendarView />}
              {view === 'master' && <MasterPlanView />}
              {view === 'analytics' && <AnalyticsView />}
              {view === 'settings' && <SettingsView />}
              {view === 'roadmap' && <StrategicRoadmap />}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      <AddGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
    </div>
  );
}

export default App;
