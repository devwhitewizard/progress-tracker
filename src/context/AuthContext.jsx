import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('tracker_token') || null);
  const [loading, setLoading] = useState(true);

  // Bypass backend token validation
  useEffect(() => {
    const checkUser = () => {
      if (token) {
        // In offline mode, if we have a token, we just assume a default Guest user
        setUser({ id: 'guest', name: 'Guest User', email: 'guest@example.com' });
      }
      setLoading(false);
    };
    checkUser();
  }, [token]);

  const login = async (email, password) => {
    // Offline Login: Always succeed for any credentials
    const mockToken = 'offline-token-' + Date.now();
    const mockUser = { id: 'guest', name: 'Guest User', email };
    
    localStorage.setItem('tracker_token', mockToken);
    setToken(mockToken);
    setUser(mockUser);
    return { success: true };
  };

  const register = async (name, email, password) => {
    // Offline Registration: Simulate success
    return { success: true, email };
  };

  const verifyEmail = async (email, code) => {
    // Offline Verification: Always succeed
    const mockToken = 'offline-token-' + Date.now();
    const mockUser = { id: 'guest', name: 'Guest User', email };
    
    localStorage.setItem('tracker_token', mockToken);
    setToken(mockToken);
    setUser(mockUser);
    return { success: true };
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
