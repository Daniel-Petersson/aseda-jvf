import React from 'react';
import { Navigate } from 'react-router-dom';
import { hasRole, isAuthenticated } from '../../utils/authUtils';

const ProtectedRoute = ({ element: Element, allowedRoles, fallback = <Navigate to="/login" replace /> }) => {
  if (!isAuthenticated()) {
    return fallback;
  }

  if (!hasRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return <Element />;
};

export default ProtectedRoute;
