import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getSession } from '../../services/authService';

export default function ProtectedRoute() {
  const location = useLocation();
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let isMounted = true;

    getSession()
      .then((session) => {
        if (isMounted) {
          setStatus(session ? 'authenticated' : 'unauthenticated');
        }
      })
      .catch(() => {
        if (isMounted) {
          setStatus('unauthenticated');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen grid place-items-center bg-surface-bg">
        <div className="text-sm font-medium text-text-secondary">Checking session...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
