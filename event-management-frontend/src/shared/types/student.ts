export type EventCategory = "Technology" | "Sports" | "Cultural" | "Career" | "Business" | "Science";
export type RegistrationStatus = "pending" | "confirmed" | "attended";

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
    availableEvents: number;
    myRegistrations: number;
    attendedEvents: number;
}

export interface RegisterEventResult {
    ok: boolean;
    message: string;
}
