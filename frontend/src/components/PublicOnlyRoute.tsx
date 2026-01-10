import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn, isAdmin } from '../utils/session';

export default function PublicOnlyRoute({ children }: { children: JSX.Element }) {
  if (isLoggedIn()) {
    return <Navigate to={isAdmin() ? "/admin-dashboard" : "/dashboard"} replace />;
  }
  return children;
}
