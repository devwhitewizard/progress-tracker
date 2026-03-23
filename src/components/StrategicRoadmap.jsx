import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Layers, 
  Target,
  Search,
  ArrowRight,
  Loader2
} from 'lucide-react';

const StrategicRoadmap = () => {
  const { goals, toggleGoal, addGoal, updateGoal } = useAppContext();
  const [activeTab, setActiveTab] = useState('Daily');
  const [expandedGoalId, setExpandedGoalId] = useState(null);
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
      
      const type = activeTab.toLowerCase();
      let periodId;
      if (type === 'daily') periodId = new Date().toISOString().split('T')[0];
      else if (type === 'weekly') periodId = 1;
      else periodId = 2026;

      addGoal(type, periodId, title, 'High', null, subtasks);
      setInputValue('');
      setIsGenerating(false);
    }
  };

  const handleToggleTask = (goal, dIndex, tIndex) => {
    const updatedGoal = JSON.parse(JSON.stringify(goal));
    const { type, periodId, ...pureGoal } = updatedGoal;
    
    // Safety check just in case it's an old goal format
    if (!pureGoal.subtasks[dIndex] || !pureGoal.subtasks[dIndex].tasks) return;
    
    const task = pureGoal.subtasks[dIndex].tasks[tIndex];
    task.completed = !task.completed;
    
    const allTasksDone = pureGoal.subtasks[dIndex].tasks.every(t => t.completed);
    pureGoal.subtasks[dIndex].completed = allTasksDone;
    
    updateGoal(goal.type, goal.periodId, goal.id, pureGoal);
  };

  const handleAdjustPlan = async (goal, adjustmentType) => {
    const originalGoal = JSON.parse(JSON.stringify(goal));
    try {
      // Show loading feedback? For now simply wait for response.
      const response = await fetch('http://localhost:5000/api/ai/goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userInput: goal.text, 
          adjustmentType,
          currentPlan: { title: goal.text, days: originalGoal.subtasks }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const adjustedDays = (data.days || []).map(d => ({
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
        
        const { type, periodId, ...pureGoal } = originalGoal;
        pureGoal.subtasks = adjustedDays;
        pureGoal.text = data.title || pureGoal.text;
        updateGoal(type, periodId, originalGoal.id, pureGoal);
      }
    } catch (err) {
      console.error("AI Plan Adjustment failed:", err);
    }
  };

  const getActiveGoals = () => {
    if (!goals) return [];
    const type = activeTab.toLowerCase();
    
    if (type === 'daily') {
      const today = new Date().toISOString().split('T')[0];
      return (goals.daily?.[today]?.goals || []).map(g => ({ ...g, type, periodId: today }));
    } else if (type === 'weekly') {
      const weekId = Object.keys(goals.weekly || {})[0] || 1;
      return (goals.weekly?.[weekId]?.goals || []).map(g => ({ ...g, type, periodId: weekId }));
    } else {
      const yearId = Object.keys(goals.yearly || {})[0] || 2026;
      return (goals.yearly?.[yearId]?.goals || []).map(g => ({ ...g, type, periodId: yearId }));
    }
  };

  const activeGoals = getActiveGoals();

  const containerStyle = {
    backgroundColor: '#0F172A',
    minHeight: '100%',
    color: '#F8FAFC',
    fontFamily: "'Inter', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
    paddingBottom: '4rem'
  };

  const headerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    width: '100%'
  };

  const segmentedToggleStyle = {
    display: 'flex',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    padding: '4px',
    width: 'fit-content'
  };

  const toggleButtonStyle = (isActive) => ({
    padding: '0.6rem 1.5rem',
    borderRadius: '8px',
    border: 'none',
    background: isActive ? '#6366F1' : 'transparent',
    color: isActive ? '#FFFFFF' : '#94A3B8',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '100px'
  });

  const aiInputContainerStyle = {
    width: '100%',
    maxWidth: '800px',
    position: 'relative'
  };

  const aiInputStyle = {
    width: '100%',
    padding: '1.25rem 1.5rem 1.25rem 3.5rem',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    color: '#F8FAFC',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    fontFamily: 'inherit'
  };

  const sparkleIconStyle = {
    position: 'absolute',
    left: '1.25rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#6366F1',
    filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.6))'
  };

  const goalCardStyle = (isExpanded) => ({
    width: '100%',
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '1rem'
  });

  return (
    <div style={containerStyle}>
      {/* Header Section */}
      <div style={headerStyle}>
        {/* Segmented Toggle */}
        <div style={segmentedToggleStyle}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={toggleButtonStyle(activeTab === tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* AI Goal Architect Input */}
        <div style={{ width: '100%', maxWidth: '800px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Sparkles size={20} style={sparkleIconStyle} />
            <input
              type="text"
              placeholder="AI Goal Architect: Define your next strategic milestone..."
              style={aiInputStyle}
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
            Generate Strategy
          </button>
        </div>
      </div>

      {/* Goal List */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B' }}>
            {activeTab} Objectives
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>{activeGoals.length} total</span>
        </div>

        {activeGoals.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>No active strategic objectives for this period.</p>
          </div>
        ) : (
          activeGoals.map((goal) => {
            const isExpanded = expandedGoalId === goal.id;
            return (
              <div 
                key={goal.id} 
                style={goalCardStyle(isExpanded)}
                onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
              >
                <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ color: goal.completed ? '#6366F1' : '#64748B' }}>
                    {goal.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#F8FAFC' }}>{goal.text}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Target size={12} /> {goal.priority || 'Medium'}
                      </span>
                      <span>•</span>
                      <span>AI Integrated</span>
                    </div>
                  </div>
                  <div style={{ color: '#64748B' }}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden', background: 'rgba(255, 255, 255, 0.005)', borderTop: '1px solid rgba(255, 255, 255, 0.03)' }}
                    >
                        <div style={{ padding: '1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Sparkles size={14} color="#6366F1" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6366F1' }}>
                              SMART Trackable Plan
                            </span>
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {(goal.subtasks || []).map((dayObj, dIndex) => (
                              <div key={dayObj.id || `day-${dIndex}`} style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                  <Calendar size={14} color={dayObj.completed ? '#10B981' : '#6366F1'} />
                                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: dayObj.completed ? '#10B981' : '#F8FAFC', textDecoration: dayObj.completed ? 'line-through' : 'none' }}>
                                    Day {dayObj.day}: {dayObj.title}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1.5rem', borderLeft: '1px solid rgba(255,255,255,0.05)', marginLeft: '6px' }}>
                                  {(dayObj.tasks || []).map((task, tIndex) => (
                                    <div key={task.id || `task-${tIndex}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '4px' }}>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleToggleTask(goal, dIndex, tIndex); }}
                                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, marginTop: '3px', flexShrink: 0, color: task.completed ? '#10B981' : '#64748B' }}
                                      >
                                        {task.completed ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                                      </button>
                                      <span style={{ fontSize: '0.75rem', color: task.completed ? '#64748B' : '#94A3B8', lineHeight: 1.4, textDecoration: task.completed ? 'line-through' : 'none' }}>
                                        {task.text}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* SMART Action Buttons block */}
                          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button 
                               onClick={(e) => { e.stopPropagation(); handleAdjustPlan(goal, 'simplify'); }}
                               style={{ background: 'rgba(255, 255, 255, 0.05)', border: 'none', color: '#94A3B8', fontSize: '0.7rem', padding: '0.5rem 0.75rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                               ⚡️ Make it Easier
                            </button>
                            <button 
                               onClick={(e) => { e.stopPropagation(); handleAdjustPlan(goal, 'upgrade'); }}
                               style={{ background: 'rgba(255, 255, 255, 0.05)', border: 'none', color: '#94A3B8', fontSize: '0.7rem', padding: '0.5rem 0.75rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                               🔥 Upgrade Difficulty
                            </button>
                            <button 
                               onClick={(e) => { e.stopPropagation(); handleAdjustPlan(goal, 'catchup'); }}
                               style={{ background: 'rgba(255, 255, 255, 0.05)', border: 'none', color: '#94A3B8', fontSize: '0.7rem', padding: '0.5rem 0.75rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                               🗓️ Adjust Schedule (If Behind)
                            </button>
                          </div>
                        </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* 4k Resolution Fillers - Data Driven Aesthetics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginTop: 'auto' }}>
        {[
          { label: 'Network Integrity', value: '99.9%', color: '#10B981' },
          { label: 'Strategic Alignment', value: '88%', color: '#6366F1' },
          { label: 'Task Velocity', value: '14/wk', color: '#F59E0B' },
          { label: 'Entropy Level', value: 'Low', color: '#64748B' }
        ].map((stat, i) => (
          <div key={i} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: '0.5rem' }}>{stat.label}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrategicRoadmap;
