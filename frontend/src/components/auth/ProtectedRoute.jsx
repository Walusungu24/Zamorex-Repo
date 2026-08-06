import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ allowedRoles, children }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified and user's role is not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the appropriate dashboard based on user's role
    const redirectPath = user.role === 'admin' ? '/admin' : 
                        user.role === 'farmer' ? '/farmer' : 
                        user.role === 'buyer' ? '/buyer' : '/login';
    return <Navigate to={redirectPath} replace />;
  }

  // If children are provided (for nested routes), render them
  if (children) {
    return children;
  }

  // Otherwise render the outlet (for nested routes)
  return <Outlet />;
}

export default ProtectedRoute;