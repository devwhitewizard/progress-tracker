import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag, Calendar } from 'lucide-react';

const PRIORITIES = [
  { id: 'high',   label: 'High',   color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
  { id: 'medium', label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  { id: 'low',    label: 'Low',    color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
];

const AddGoalModal = ({ isOpen, onClose }) => {
  const { selectedPeriod, addGoal } = useAppContext();
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addGoal(selectedPeriod.type, selectedPeriod.id, text.trim(), priority, deadline || null);
      setText('');
      setPriority('medium');
      setDeadline('');
      onClose();
    }
  };

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    padding: '0.9rem 1.25rem', borderRadius: '14px', color: 'white',
    fontSize: '1rem', fontWeight: 600, outline: 'none', fontFamily: 'inherit',
    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15)'
  };

  const labelStyle = {
    display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem',
    fontWeight: 900, marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: '100%', maxWidth: '480px', background: '#0f172a', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', margin: '1.5rem' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, background: 'linear-gradient(to right, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Add New Goal
              </h2>
              <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Goal text */}
              <div>
                <label style={labelStyle}>Goal Description</label>
                <input autoFocus type="text" value={text} onChange={e => setText(e.target.value)} placeholder="e.g., Complete Next.js course" style={inputStyle} />
              </div>

              {/* Priority */}
              <div>
                <label style={labelStyle}>Priority</label>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  {PRIORITIES.map(p => (
                    <button
                      key={p.id} type="button" onClick={() => setPriority(p.id)}
                      style={{ flex: 1, padding: '0.6rem', borderRadius: '12px', border: `1px solid ${priority === p.id ? p.color : 'rgba(255,255,255,0.08)'}`, background: priority === p.id ? p.bg : 'transparent', color: priority === p.id ? p.color : 'rgba(255,255,255,0.4)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', transition: 'all 0.2s' }}
                    >
                      <Flag size={14} /> {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label style={labelStyle}>Deadline (optional)</label>
                <div style={{ position: 'relative' }}>
                  <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
                    style={{ ...inputStyle, colorScheme: 'dark', paddingLeft: '2.75rem' }}
                  />
                  <Calendar size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                <button type="button" onClick={onClose} style={{ padding: '0.75rem 1.5rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={!text.trim()} style={{ background: text.trim() ? 'linear-gradient(135deg, var(--primary), var(--primary-deep))' : 'rgba(255,255,255,0.05)', color: '#fff', padding: '0.75rem 2rem', borderRadius: '12px', fontWeight: 800, border: 'none', boxShadow: text.trim() ? '0 4px 15px rgba(99,102,241,0.35)' : 'none', cursor: text.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.3s' }}>
                  Save Goal
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddGoalModal;
