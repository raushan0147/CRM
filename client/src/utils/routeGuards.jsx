import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

export const ProtectedRoute = ({ children }) => {
  const { token, user, isApproved } = useSelector(state => state.auth);
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role === 'admin' && !isApproved) {
     toast.error("Waiting for Super Admin approval");
     return <Navigate to="/login" replace />;
  }

  return children;
};

export const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector(state => state.auth);
  
  if (!user || (!allowedRoles.includes(user.role) && !allowedRoles.includes('all'))) {
    // Redirect to respective dash if wrong role
    if (user?.role === 'superadmin') return <Navigate to="/superadmin/dashboard" replace />;
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  // We no longer automatically redirect authenticated users here,
  // because the user requested that visiting an Auth page while
  // logged in should forcefully log them out.
  return children;
};
