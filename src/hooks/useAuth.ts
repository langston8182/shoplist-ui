import { useState, useEffect } from 'react';

const AUTH_KEY = 'shopping-list-auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const authData = localStorage.getItem(AUTH_KEY);
    if (authData) {
      try {
        const { email } = JSON.parse(authData);
        if (email) {
          setIsAuthenticated(true);
          setUserEmail(email);
        }
      } catch (error) {
        localStorage.removeItem(AUTH_KEY);
      }
    }
  }, []);

  const login = (email: string) => {
    if (email.trim()) {
      const authData = { email: email.trim() };
      localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      setIsAuthenticated(true);
      setUserEmail(email.trim());
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setUserEmail('');
  };

  return {
    isAuthenticated,
    userEmail,
    login,
    logout,
  };
};