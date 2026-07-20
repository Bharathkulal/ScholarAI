import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Error403 from '../pages/Error403';

const ProtectedRouter = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect unauthenticated users to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && user) {
    const userRole = user.role === 'superadmin' ? 'super_admin' : user.role;
    const isAllowed = allowedRoles.some((role) => {
      const normRole = role === 'superadmin' ? 'super_admin' : role;
      return normRole === userRole || userRole === 'super_admin';
    });

    if (!isAllowed) {
      return <Error403 />;
    }
  }

  return children;
};

export default ProtectedRouter;
