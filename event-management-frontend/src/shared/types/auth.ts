export type UserRole = "student" | "admin" | "faculty";

export const ROLE_HOME_ROUTE: Record<UserRole, string> = {
    student: "/dashboard",
    admin: "/admin/dashboard",
    faculty: "/faculty/dashboard",
};

export interface AuthUserSession {
    id: number;
    role: UserRole;
    token: string;
    fullName?: string;
    registrationNumber?: string;
    email?: string;
}

export function storeAuthSession(session: AuthUserSession): void {
    localStorage.setItem("authToken", session.token);
    localStorage.setItem("userRole", session.role);
    localStorage.setItem("userId", String(session.id));
    localStorage.setItem("userName", session.fullName || "");
    localStorage.setItem("registrationNumber", session.registrationNumber || "");
    localStorage.setItem("userEmail", session.email || "");
}

export function clearAuthSession(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("registrationNumber");
    localStorage.removeItem("userEmail");
}

export function getStoredUserRole(): UserRole | null {
    const rawRole = localStorage.getItem("userRole");

    if (rawRole === "student" || rawRole === "admin" || rawRole === "faculty") {
        return rawRole;
    }

    return null;
}
