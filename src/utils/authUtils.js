import { jwtDecode } from 'jwt-decode';

export const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.role;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const hasRole = (allowedRoles) => {
  const userRole = getUserRole();
  return userRole && allowedRoles.includes(userRole);
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const decodedToken = jwtDecode(token);
    return new Date(decodedToken.exp * 1000) > new Date();
  } catch (error) {
    console.error('Error decoding token:', error);
    return false;
  }
};
