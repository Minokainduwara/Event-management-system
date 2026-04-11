import { Navigate } from 'react-router';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const userRole = localStorage.getItem('userRole');

    // If not logged in, redirect to /login
    if (!userRole) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
