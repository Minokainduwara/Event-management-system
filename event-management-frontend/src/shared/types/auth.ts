export type UserRole = "student" | "admin" | "faculty";

export const ROLE_HOME_ROUTE: Record<UserRole, string> = {
    student: "/dashboard",
    admin: "/admin/dashboard",
    faculty: "/faculty/dashboard",
};

export function getStoredUserRole(): UserRole | null {
    const rawRole = localStorage.getItem("userRole");

    if (rawRole === "student" || rawRole === "admin" || rawRole === "faculty") {
        return rawRole;
    }

    return null;
}
