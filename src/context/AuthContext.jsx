import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('tracker_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate token on load
  useEffect(() => {
    const checkUser = async () => {
      if (token) {
        try {
          const res = await fetch('http://localhost:5000/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            console.error('Token validation failed');
            logout();
          }
        } catch (error) {
          console.error('Error verifying token', error);
          logout();
        }
      }
      setLoading(false);
    };
    checkUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('tracker_token', data.token);
      setToken(data.token);
      setUser(data);
      return { success: true };
    }
    return { success: false, message: data.message, requiresVerification: data.requiresVerification };
  };

  const register = async (name, email, password) => {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      // Don't log in yet, need to verify
      return { success: true, email: data.email };
    }
    return { success: false, message: data.message };
  };

  const verifyEmail = async (email, code) => {
    const res = await fetch('http://localhost:5000/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('tracker_token', data.token);
      setToken(data.token);
      setUser(data);
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const logout = () => {
    localStorage.removeItem('tracker_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, verifyEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
