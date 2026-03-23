import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Target, Zap, RefreshCcw, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const DailyBriefing = () => {
  const { briefing, fetchBriefing } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchBriefing();
    } catch (err) {
      setError('Could not generate your briefing right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!briefing) handleRefresh();
  }, [briefing]);

  return (
    <div className="saas-card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)' }}>
          <Sparkles size={20} />
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: 0 }}>Daily Briefing</h3>
        </div>
        <button 
          onClick={handleRefresh} 
          disabled={loading}
          style={{ 
            background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
            padding: '4px', borderRadius: '4px', transition: 'all 0.2s',
            background: loading ? 'rgba(255,255,255,0.05)' : 'transparent'
          }}
        >
          <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}
          >
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--primary)' }} />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>AI coach is analyzing your momentum...</p>
          </motion.div>
        ) : error ? (
          <motion.div 
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ color: '#F43F5E', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}
          >
            {error}
          </motion.div>
        ) : briefing ? (
          <motion.div 
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.03)', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-primary)', margin: 0 }}>
                {briefing.summary}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ color: '#F97316', flexShrink: 0 }}><Target size={18} /></div>
                <div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Priority Mission</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{briefing.priorityMission}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ color: '#10B981', flexShrink: 0 }}><Zap size={18} /></div>
                <div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Coach Nudge</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{briefing.motivation}"</div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default DailyBriefing;
