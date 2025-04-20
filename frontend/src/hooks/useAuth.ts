import { useState, useEffect } from 'react';

// Simple auth hook
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check for token on initialization
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, _password: string) => {
    // Placeholder implementation
    localStorage.setItem('token', 'test-token');
    setIsAuthenticated(true);
    setUser({ email });
    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
  };
};

export default useAuth;
