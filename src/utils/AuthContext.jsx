import React, { createContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (cookies.token) {
      try {
        const decodedToken = jwtDecode(cookies.token);
        setUser(decodedToken);
      } catch (error) {
        console.error('Error decoding token:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [cookies.token]);

  const login = (token) => {
    setCookie('token', token, { path: '/', maxAge: 3600, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
    const decodedToken = jwtDecode(token);
    setUser(decodedToken);
  };

  const logout = () => {
    removeCookie('token', { path: '/' });
    setUser(null);
  };

  const getToken = () => cookies.token;

  return (
    <AuthContext.Provider value={{ user, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};
