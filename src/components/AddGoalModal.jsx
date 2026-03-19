import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const AddGoalModal = ({ isOpen, onClose }) => {
  const { selectedPeriod, addGoal } = useAppContext();
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addGoal(selectedPeriod.type, selectedPeriod.id, text.trim());
      setText('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0, 0, 0, 0.8)', 
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{ 
              width: '100%', 
              maxWIdth: '450px', 
              background: '#1e293b', 
              borderRadius: '24px', 
              padding: '2.5rem',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              margin: '1.5rem'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Add New Goal</h2>
              <button onClick={onClose} style={{ color: '#94a3b8' }}><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Goal Description</label>
                <input 
                  autoFocus
                  type="text" 
                  value={text} 
                  onChange={e => setText(e.target.value)}
                  placeholder="e.g., Complete UI Mockup"
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--glass-border)',
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={onClose} 
                  style={{ padding: '0.75rem 1.5rem', color: '#94a3b8', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{
                    background: 'var(--primary)',
                    color: 'white',
                    padding: '0.75rem 2rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                  }}
                >
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
