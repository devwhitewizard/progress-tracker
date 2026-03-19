import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GoalView from './components/GoalView';
import CalendarView from './components/CalendarView';
import Timeline from './components/Timeline';
import AddGoalModal from './components/AddGoalModal';
import { useAppContext } from './context/AppContext';
import { Plus } from 'lucide-react';

function App() {
  const { view, isDarkMode, selectedPeriod } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTitle = () => {
    if (view === 'dashboard') return 'Overall Insight';
    if (view === 'calendar') return 'Calendar Explorer';
    if (view === 'timeline') return 'Journey Timeline';
    if (view === 'goals') {
      const { type, id } = selectedPeriod;
      if (type === 'daily') return id === new Date().toISOString().split('T')[0] ? "Today's Planning" : `Planning for ${id}`;
      if (type === 'weekly') return `Week ${id} Planning`;
      if (type === 'yearly') return `${id} Vision`;
    }
    return 'Progress Tracker';
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : 'light'}`} style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <Sidebar />
      
      <main className="content" style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto', position: 'relative' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>
            {getTitle()}
          </h1>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {view === 'goals' && (
// ...
              <button 
                onClick={() => setIsModalOpen(true)}
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}
              >
                <Plus size={20} /> Add Goal
              </button>
            )}
            <div className="avatar" style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>U</div>
          </div>
        </header>

        <div className="view-container">
          {view === 'dashboard' && <Dashboard />}
          {view === 'calendar' && <CalendarView />}
          {view === 'goals' && <GoalView />}
          {view === 'timeline' && <Timeline />}
        </div>
      </main>

      {isModalOpen && <AddGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default App;
