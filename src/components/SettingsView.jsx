import React from 'react';
import { useAuthContext } from '../context/AuthContext';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { LogOut, User, Mail, ShieldAlert } from 'lucide-react';

const SettingsView = () => {
  const { user, logout } = useAuthContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}
    >
      <div className="glass floating-glass" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: 'var(--primary)', filter: 'blur(70px)', opacity: 0.15 }} />
        
        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.04em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <User size={32} style={{ color: 'var(--primary)' }} />
          Account Profile
        </h2>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Full Name</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user?.name || 'Loading...'}</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Mail size={24} style={{ color: 'var(--accent-cyan)' }} />
            <div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Email Address</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{user?.email || 'Loading...'}</div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ShieldAlert size={24} style={{ color: 'var(--success)' }} />
            <div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Account Status</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--success)' }}>Verified & Active</div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass floating-glass" style={{ padding: '2.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f87171', marginBottom: '1rem' }}>Danger Zone</h3>
        <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Logging out will clear your current session. You will need to sign in again to access your progress data.
        </p>
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 2rem',
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            borderRadius: '14px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            fontWeight: 800,
            fontSize: '1rem',
          }}
          className="hover-glow"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </motion.div>
  );
};

export default SettingsView;
