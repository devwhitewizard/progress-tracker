import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Register = ({ switchToLogin }) => {
  const { register, verifyEmail } = useAuthContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isVerifying) {
      if (!code) return setError('Please enter the verification code');
      setLoading(true);
      const res = await verifyEmail(email, code);
      if (!res.success) {
        setError(res.message);
        setLoading(false);
      }
      // On success, AuthContext sets the user and automatically redirects!
      return;
    }

    if (!name || !email || !password) return setError('Please fill all fields');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    const res = await register(name, email, password);
    if (!res.success) {
      setError(res.message);
      setLoading(false);
    } else {
      setError('');
      setIsVerifying(true);
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass floating-glass"
        style={{ padding: '3rem', width: '100%', maxWidth: '400px', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: '150px', height: '150px', background: 'var(--accent)', filter: 'blur(60px)', opacity: 0.15 }} />
        
        {isVerifying ? (
          <>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.04em' }}>Verify Email</h2>
            <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Check your email (or server console) for the 6-digit code.</p>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.04em' }}>Join Us</h2>
            <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Start tracking your progress today.</p>
          </>
        )}

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '0.75rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {isVerifying ? (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verification Code</label>
              <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: '#fff', fontSize: '1rem', outline: 'none', letterSpacing: '0.2em', textAlign: 'center' }}
                placeholder="000000"
                maxLength={6}
              />
            </div>
          ) : (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: '#fff', fontSize: '1rem', outline: 'none' }}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: '#fff', fontSize: '1rem', outline: 'none' }}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: '#fff', fontSize: '1rem', outline: 'none' }}
                  placeholder="••••••••"
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '1rem', 
              padding: '1.1rem', 
              background: 'linear-gradient(135deg, var(--accent), #e11d48)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '14px', 
              fontSize: '1.05rem', 
              fontWeight: 800, 
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 8px 20px rgba(244, 114, 182, 0.3)'
            }}
            className="hover-glow"
          >
            {loading ? 'Processing...' : (isVerifying ? 'Verify & Login' : 'Sign Up')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
          {isVerifying ? "Didn't receive a code? Check console for local dev." : "Already have an account? "}
          <button onClick={switchToLogin} style={{ color: 'var(--accent-cyan)', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
            {isVerifying ? 'Back to Login' : 'Sign in'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
