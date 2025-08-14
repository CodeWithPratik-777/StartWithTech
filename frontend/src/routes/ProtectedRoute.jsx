import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowIfLoggedIn, requireAdmin = false }) => {
  const [authState, setAuthState] = useState({ loading: true, authenticated: false, role: null });

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch('/api/auth/verify', {
          credentials: 'include',
        });

        if (!res.ok) {
          setAuthState({ loading: false, authenticated: false, role: null });
          return;
        }

        const data = await res.json();
        setAuthState({ loading: false, authenticated: true, role: data.user?.role });
      } catch (err) {
        setAuthState({ loading: false, authenticated: false, role: null });
      }
    };

    verifyToken();
  }, []);

  if (authState.loading) return null; 

  if (allowIfLoggedIn) {
    if (!authState.authenticated || (requireAdmin && authState.role !== 'admin')) {
      return <Navigate to="/404" replace />;
    }
    return children;
  }

  return !authState.authenticated ? children : <Navigate to="/404" replace />;
};

export default ProtectedRoute;
