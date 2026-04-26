import { Navigate, Outlet } from "react-router-dom";
import { getStoredUserRole, ROLE_HOME_ROUTE, type UserRole } from "../types/auth";

interface RoleGuardProps {
    allowedRoles: UserRole[];
}

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
    const role = getStoredUserRole();

    if (!role) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to={ROLE_HOME_ROUTE[role]} replace />;
    }

    return <Outlet />;
}
