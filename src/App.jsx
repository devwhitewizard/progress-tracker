import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GoalView from './components/GoalView';
import CalendarView from './components/CalendarView';
import MasterPlanView from './components/MasterPlanView';
import AddGoalModal from './components/AddGoalModal';
import HabitTracker from './components/HabitTracker';
import AnalyticsView from './components/AnalyticsView';
import { useAppContext } from './context/AppContext';
import { Plus, Sun, Moon, Star, Menu, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { view, setView, selectedPeriod, setSelectedPeriod } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobileMode, setIsMobileMode] = useState(window.innerWidth <= 1024);

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
    if (view === 'goals') {
      const { type, id } = selectedPeriod;
      if (type === 'daily') return id === new Date().toISOString().split('T')[0] ? "Today's Planning" : `Planning for ${id}`;
      if (type === 'weekly') return `Week ${id} Planning`;
      if (type === 'yearly') return `${id} Vision`;
    }
    return 'Progress Tracker';
  };

  return (
    <div className="app-container">
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
        <header className="header-wrapper">
          <div className="header-title-container" style={{ gap: '1rem' }}>
            <button 
              className={`mobile-menu-btn ${isSidebarOpen ? 'active' : ''}`} 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle Menu"
            >
              <Menu size={20} />
            </button>
            <button
              className="mobile-menu-btn"
              style={{ marginRight: '1rem' }}
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <div>
              <h1 className="page-title" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', margin: 0, background: 'linear-gradient(to right, #fff, rgba(255,255,255,0.4))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {getTitle()}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem' }}>
                Progress Tracker
              </p>
            </div>
          </div>
          
          <div className="header-actions" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <button 
              onClick={() => setIsModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--primary-deep))',
                color: '#fff',
                padding: '1.1rem 2.25rem',
                borderRadius: '18px',
                fontWeight: 800,
                fontSize: '1rem',
                border: 'none',
                boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)'
              }}
              className="hover-glow"
            >
              + Create New Goal
            </button>
          </div>
        </header>

        <section className="content-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              key={view + (selectedPeriod.id || '')}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {view === 'dashboard' && <Dashboard setView={setView} setSelectedPeriod={setSelectedPeriod} />}
              {view === 'habits' && <HabitTracker />}
              {view === 'goals' && <GoalView />}
              {view === 'calendar' && <CalendarView />}
              {view === 'master' && <MasterPlanView />}
              {view === 'analytics' && <AnalyticsView />}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      <AddGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;
