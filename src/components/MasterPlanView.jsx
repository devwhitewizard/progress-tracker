import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Layers, Star, CheckCircle, Circle, Zap, Trash2, Map, Sparkles, Loader2 } from 'lucide-react';

const MasterPlanView = () => {
  const { goals, toggleGoal, deleteGoal, addGoal } = useAppContext();
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      setIsGenerating(true);
      
      let title = inputValue.trim();
      let subtasks = [];
      
      try {
        const response = await fetch('http://localhost:5000/api/ai/goal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userInput: title, goalsData: goals })
        });
        if (response.ok) {
          const data = await response.json();
          title = data.title || title;
          subtasks = (data.days || []).map(d => ({
            id: `day-${d.day}-${Date.now()}`,
            day: d.day,
            title: d.title,
            completed: d.completed || false,
            tasks: (d.tasks || []).map((t, i) => ({ 
               id: `task-${d.day}-${i}`, 
               text: t.name || t, 
               completed: t.done || false 
            }))
          }));
        }
      } catch (err) {
        console.error("AI Goal Generation failed:", err);
      }
      
      addGoal('yearly', 2026, title, 'High', null, subtasks);
      setInputValue('');
      setIsGenerating(false);
    }
  };

  // Flatten and sort goals
  const allGoals = [];

  // Daily
  Object.entries(goals.daily).forEach(([date, data]) => {
    data.goals.forEach(g => {
      allGoals.push({ ...g, periodId: date, type: 'daily', date: new Date(date + 'T00:00:00') });
    });
  });

  // Weekly
  Object.entries(goals.weekly).forEach(([id, data]) => {
    data.goals.forEach(g => {
      allGoals.push({ ...g, periodId: id, type: 'weekly', date: new Date(2026, 0, 1) });
    });
  });

  // Yearly
  Object.entries(goals.yearly).forEach(([year, data]) => {
    data.goals.forEach(g => {
      allGoals.push({ ...g, periodId: year, type: 'yearly', date: new Date(year, 0, 1) });
    });
  });

  allGoals.sort((a, b) => a.date - b.date || a.id - b.id);

  const getTypeIcon = (type) => {
    if (type === 'daily') return <Zap size={14} />;
    if (type === 'weekly') return <Layers size={14} />;
    return <Star size={14} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
      <div className="saas-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Map size={24} color="var(--primary)" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Strategic Roadmap</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Full architectural overview of your mission objectives.</p>
        </div>
      </div>

      {/* AI Goal Generator Input */}
      <div style={{ width: '100%', display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Sparkles size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#6366F1', filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.6))' }} />
          <input
            type="text"
            placeholder="AI Goal Generator: Describe your vision and let AI create a strategic master goal..."
            style={{ width: '100%', padding: '1.25rem 1.5rem 1.25rem 3.5rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', color: '#F8FAFC', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s ease', boxSizing: 'border-box' }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleGenerate}
            disabled={isGenerating}
            onFocus={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.05)'}
          />
        </div>
        <button 
          onClick={() => handleGenerate({ key: 'Enter' })}
          disabled={!inputValue.trim() || isGenerating}
          style={{
            padding: '1.25rem 1.5rem',
            background: inputValue.trim() && !isGenerating ? '#6366F1' : 'rgba(255,255,255,0.05)',
            color: inputValue.trim() && !isGenerating ? '#fff' : '#64748B',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 600,
            cursor: inputValue.trim() && !isGenerating ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
            height: '100%'
          }}
        >
          {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          Generate Master Goal
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {allGoals.length === 0 ? (
          <div className="saas-card" style={{ padding: '4rem', textAlign: 'center', borderStyle: 'dashed', color: 'var(--text-muted)' }}>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>No strategic data available. Initialize your first goal.</p>
          </div>
        ) : (
          allGoals.map((goal) => {
            return (
              <div 
                key={`${goal.type}-${goal.id}`}
                className="saas-card"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1.25rem',
                  padding: '1rem 1.25rem',
                  background: goal.completed ? 'rgba(255,255,255,0.01)' : 'var(--bg-card)',
                  opacity: goal.completed ? 0.6 : 1,
                }}
              >
                <button 
                  onClick={() => toggleGoal(goal.type, goal.periodId, goal.id)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: goal.completed ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', padding: 0 }}
                >
                  {goal.completed ? <CheckCircle size={24} strokeWidth={2.5} /> : <Circle size={24} strokeWidth={2} />}
                </button>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <span style={{ 
                      fontSize: '1rem', 
                      fontWeight: 600, 
                      textDecoration: goal.completed ? 'line-through' : 'none',
                      color: goal.completed ? 'var(--text-muted)' : '#fff',
                    }}>
                      {goal.text}
                    </span>
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      fontSize: '0.65rem', 
                      fontWeight: 700, 
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.03)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-color)',
                      letterSpacing: '0.05em'
                    }}>
                      {getTypeIcon(goal.type)} {goal.type}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={12} />
                    <span>
                      {goal.type === 'daily' ? new Date(goal.periodId + 'T00:00:00').toLocaleDateString(undefined, { dateStyle: 'medium' }) : (goal.type === 'weekly' ? `Week ${goal.periodId}` : `Year ${goal.periodId}`)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteGoal(goal.type, goal.periodId, goal.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem', borderRadius: '4px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MasterPlanView;
