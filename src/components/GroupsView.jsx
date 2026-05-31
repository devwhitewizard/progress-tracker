import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  TrendingUp, 
  MessageSquare, 
  ArrowRight,
  Shield,
  Zap,
  MoreVertical
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const GroupsView = () => {
  const { groups, addGroup } = useAppContext();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      addGroup(newGroupName);
      setNewGroupName('');
      setShowCreateModal(false);
    }
  };

  return (
    <div className="groups-container" style={{ color: '#fff' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Collective Intelligence</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Collaborate with your team to reach peak performance.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1.5rem' }}
        >
          <Plus size={18} /> Create New Group
        </button>
      </header>

      <div className="groups-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
        {groups.map((group) => (
          <motion.div 
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group-card"
            style={{ 
              background: 'var(--bg-card)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '20px', 
              padding: '2rem',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                <Users size={24} />
              </div>
              <button style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <MoreVertical size={20} />
              </button>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>{group.name}</h3>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Users size={14} /> {group.membersCount} Members</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><TrendingUp size={14} /> {group.progress}% Goal Hit</span>
            </div>

            <div className="progress-bar-container" style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${group.progress}%` }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: '4px' }}
              />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#a5a5a5', fontStyle: 'italic' }}>
                <MessageSquare size={14} style={{ marginRight: '0.5rem', display: 'inline' }} />
                "{group.recentActivity}"
              </p>
            </div>

            <button className="btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', padding: '0.8rem' }}>
              Enter Workspace <ArrowRight size={18} />
            </button>
          </motion.div>
        ))}

        <div 
          onClick={() => setShowCreateModal(true)}
          style={{ 
            border: '2px dashed var(--border-color)', 
            borderRadius: '20px', 
            padding: '2rem', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'border-color 0.3s',
            color: 'var(--text-muted)'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = '#6366f1'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Plus size={24} />
          </div>
          <p style={{ fontWeight: 600 }}>Create New Collective</p>
        </div>
      </div>

      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border-color)', width: '400px' }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Start a New Group</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Invite your team members after creation.</p>
            
            <form onSubmit={handleCreateGroup}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Group Identity</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Apollo Mission"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem', color: '#fff', fontSize: '1rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary" 
                  style={{ flex: 1, padding: '1rem' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary" 
                  style={{ flex: 1, padding: '1rem' }}
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GroupsView;
