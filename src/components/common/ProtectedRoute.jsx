import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';

const ProtectedRoute = ({ element, roles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  if (roles && roles.indexOf(user.role) === -1) {
    // Role not authorized, redirect to home page or unauthorized page
    return <Navigate to="/" />;
  }

  // Authorized, render the component
  return element;
};

export default ProtectedRoute;
