import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRouter = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const location = useLocation();

  if (!token) {
    // Redirect unauthenticated users to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role))) {
    // Redirect unauthorized users to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRouter;
