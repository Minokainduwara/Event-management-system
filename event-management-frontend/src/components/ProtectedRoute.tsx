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