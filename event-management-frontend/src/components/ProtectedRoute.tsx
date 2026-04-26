import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  role?: string;
};

export default function ProtectedRoute({
  children,
  role,
}: Props) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userRole = localStorage.getItem("role");

  // not logged in
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // wrong role
  if (role && role !== userRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}