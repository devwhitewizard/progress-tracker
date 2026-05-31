import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Zap, 
  Target, 
  Trophy, 
  ArrowRight, 
  CheckCircle2, 
  Github,
  Layout,
  BarChart3
} from 'lucide-react';
import '../styles/LandingPage.css';

const LandingPage = ({ onLogin, onRegister }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const features = [
    {
      icon: <Users size={24} />,
      title: "Group Synergies",
      description: "Collaborate with peers in real-time. Share goals, track collective progress, and push each other to new heights."
    },
    {
      icon: <Zap size={24} />,
      title: "Strategic Velocity",
      description: "Accelerate your growth with our AI-powered daily briefings and habit-building engine designed for high performance."
    },
    {
      icon: <Layout size={24} />,
      title: "Precision Roadmap",
      description: "Visualize your long-term vision with our Enterprise Strategic Roadmap interface. Turn big dreams into daily tasks."
    }
  ];

  return (
    <div className="landing-container">
      <div className="mesh-gradient"></div>
      <div className="gradient-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <nav className="landing-nav">
        <div className="landing-logo">
          <Target size={28} style={{ color: '#6366f1' }} />
          <span>ProgressTracker.ai</span>
        </div>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <button onClick={onLogin} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Login</button>
          <button 
            onClick={onRegister} 
            className="btn-premium btn-premium-primary"
            style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
          >
            Get Started
          </button>
        </div>
      </nav>

      <motion.main 
        className="hero-section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="hero-badge">
          ✨ Now with Collective Group Intelligence
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="hero-title">
          Master Your Time.<br />
          <span>Sync Your Success.</span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="hero-subtitle">
          The all-in-one productivity engine for high-performance individuals and elite teams. 
          Bridge the gap between vision and execution with precision.
        </motion.p>
        
        <motion.div variants={itemVariants} className="hero-ctas">
          <button onClick={onRegister} className="btn-premium btn-premium-primary">
            Get Started Free <ArrowRight size={18} />
          </button>
          <button className="btn-premium btn-premium-secondary">
            Watch Presentation
          </button>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div 
          variants={itemVariants}
          className="dashboard-preview-section"
          style={{ marginTop: '8rem' }}
        >
          <div className="preview-container">
            <div className="preview-header">
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#444' }}>progresstracker.app/dashboard</div>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div className="preview-mock-nav">
                <div className="mock-nav-item active"></div>
                <div className="mock-nav-item medium"></div>
                <div className="mock-nav-item short"></div>
                <div className="mock-nav-item medium"></div>
                <div className="mock-nav-item short"></div>
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                  <div style={{ height: '24px', width: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px' }}></div>
                  <div style={{ height: '32px', width: '120px', background: '#6366f1', borderRadius: '8px' }}></div>
                </div>
                
                <div className="preview-content-grid">
                  <div className="preview-card">
                    <div style={{ height: '14px', width: '60%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                    <div className="mock-bar"><div className="mock-bar-fill" style={{ width: '70%', background: '#6366f1' }}></div></div>
                  </div>
                  <div className="preview-card">
                    <div style={{ height: '14px', width: '40%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                    <div className="mock-bar"><div className="mock-bar-fill" style={{ width: '45%', background: '#a855f7' }}></div></div>
                  </div>
                  <div className="preview-card" style={{ gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)' }}></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ height: '14px', width: '30%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '8px' }}></div>
                        <div style={{ height: '10px', width: '80%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          style={{ marginTop: '5rem', opacity: 0.5, display: 'flex', gap: '3rem', justifyContent: 'center' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} /> End-to-End Privacy</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} /> Enterprise Grade</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} /> Real-time Sync</div>
        </motion.div>
      </motion.main>

      <section id="features" className="features-grid">
        {features.map((feature, idx) => (
          <motion.div 
            key={idx}
            className="feature-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="feature-icon">
              {feature.icon}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </section>

      <footer style={{ padding: '4rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#666', fontSize: '0.9rem' }}>
        <p>© 2026 ProgressTracker.ai - Built for the future of work.</p>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
          <Github size={20} />
          <BarChart3 size={20} />
          <Trophy size={20} />
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
