<<<<<<< HEAD
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
=======
import React from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  role?: "ADMIN" | "STUDENT";
};

export default function ProtectedRoute({ children, role }: Props) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("role") ?? "";

  // Not logged in → go login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role → redirect to correct dashboard
  if (role && role !== userRole) {
    return (
      <Navigate
        to={userRole === "ADMIN" ? "/admin" : "/student"}
        replace
      />
    );
  }

  return <>{children}</>;
}
>>>>>>> fix2
