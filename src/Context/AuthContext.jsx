import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const isExpired = (Token) => {
  try {
    const { exp } = jwtDecode(Token);
    return Date.now() >= exp * 1000;
  } catch {
    return false;
  }
}

export const AuthProvider = ({ children }) => {
  const [Token, setToken] = useState(() => localStorage.getItem('Token'));
  const isAuthenticated = !!Token;

  useEffect(() => {
    const token = localStorage.getItem('Token');
    if (!token && isExpired(token)) {
      logout();
    }
  }, []);


  const login = (newToken) => {
    localStorage.setItem('Token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('Token');
    setToken(null);
  };

  const contextValue = useMemo(
    () => ({ Token, isAuthenticated, login, logout }),
    [Token, isAuthenticated]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
