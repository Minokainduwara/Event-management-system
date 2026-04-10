export type EventCategory = "open" | "restricted";
export type RegistrationStatus = "none" | "pending" | "registered";

export interface StudentProfile {
    fullName: string;
    registrationNumber: string;
    email: string;
}

export interface EventItem {
    id: number;
    title: string;
    category: EventCategory;
    date: string;
    time: string;
    location: string;
    organizer: string;
    description: string;
    seatsAvailable: number;
}

export interface StudentRegistration {
    eventId: number;
    status: RegistrationStatus;
    requestedAt: string;
}

export interface DashboardStats {
    totalRegistered: number;
    pendingApprovals: number;
}

export interface RegisterEventResult {
    ok: boolean;
    message: string;
}
