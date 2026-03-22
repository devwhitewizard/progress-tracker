import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { MailCheck } from 'lucide-react';

const Login = ({ switchToRegister }) => {
  const { login, verifyEmail } = useAuthContext();
  const [view, setView] = useState('login'); // 'login' | 'verify'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) return setError('Please fill all fields');
    setLoading(true);
    const res = await login(email, password);
    if (!res.success) {
      // If they need to verify, auto-switch to verify view
      if (res.requiresVerification) {
        setView('verify');
        setError('');
        setSuccess('Your account needs verification. Enter the code sent to your email.');
      } else {
        setError(res.message);
      }
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !code) return setError('Please enter your email and the verification code');
    setLoading(true);
    const res = await verifyEmail(email, code);
    if (!res.success) {
      setError(res.message);
      setLoading(false);
    }
    // On success, AuthContext updates user and app re-renders automatically
  };

  const handleResendCode = async () => {
    if (!email) return setError('Enter your email first so we know where to send the code.');
    setResending(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('A new code has been sent to your email!');
      } else {
        setError(data.message);
      }
    } catch {
      setError('Could not reach the server. Is it running?');
    }
    setResending(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem',
    borderRadius: '12px',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--glass-border)',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-dim)',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  return (
    <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass floating-glass"
        style={{ padding: '3rem', width: '100%', maxWidth: '420px', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: '150px', height: '150px', background: 'var(--primary)', filter: 'blur(60px)', opacity: 0.15 }} />

        <AnimatePresence mode="wait">
          {view === 'login' ? (
            <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.04em' }}>Welcome Back</h2>
              <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Sign in to continue tracking your progress.</p>

              {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', padding: '0.75rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="you@example.com" />
                </div>
                <div>
                  <label style={labelStyle}>Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="••••••••" />
                </div>

                <button type="submit" disabled={loading} className="hover-glow" style={{ marginTop: '1rem', padding: '1.1rem', background: 'linear-gradient(135deg, var(--primary), var(--primary-deep))', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '1.05rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 8px 20px rgba(99,102,241,0.3)' }}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                  Don&apos;t have an account?{' '}
                  <button onClick={switchToRegister} style={{ color: 'var(--accent-cyan)', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', padding: 0 }}>Create one</button>
                </p>
                <button
                  onClick={() => { setView('verify'); setError(''); setSuccess('Enter your email and the code that was sent to you.'); }}
                  style={{ color: 'var(--accent)', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justify: 'center', gap: '0.4rem', margin: '0 auto' }}
                >
                  <MailCheck size={16} /> Verify my email
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="verify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.04em' }}>Verify Email</h2>
              <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Enter your email and the 6-digit code you received.</p>

              {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', padding: '0.75rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
              {success && <div style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', padding: '0.75rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(34,197,94,0.2)' }}>{success}</div>}

              <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="you@example.com" />
                </div>
                <div>
                  <label style={labelStyle}>Verification Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    style={{ ...inputStyle, letterSpacing: '0.3em', textAlign: 'center', fontSize: '1.4rem' }}
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>

                <button type="submit" disabled={loading} className="hover-glow" style={{ marginTop: '1rem', padding: '1.1rem', background: 'linear-gradient(135deg, var(--accent-cyan), var(--primary))', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '1.05rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 8px 20px rgba(99,102,241,0.3)' }}>
                  {loading ? 'Verifying...' : 'Verify & Sign In'}
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resending}
                  style={{ color: 'var(--accent-cyan)', background: 'none', border: 'none', fontWeight: 700, cursor: resending ? 'not-allowed' : 'pointer', opacity: resending ? 0.6 : 1, padding: 0 }}
                >
                  {resending ? 'Sending...' : "Didn't receive a code? Resend"}
                </button>
                <button onClick={() => { setView('login'); setError(''); setSuccess(''); }} style={{ color: 'var(--text-dim)', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
                  ← Back to Login
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Login;
