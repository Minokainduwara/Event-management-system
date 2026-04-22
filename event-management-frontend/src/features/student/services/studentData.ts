import {
    type DashboardStats,
    type EventCategory,
    type EventItem,
    type RegisterEventResult,
    type StudentProfile,
    type StudentRegistration,
} from "../../../shared/types/student";
import api from "../../../shared/api/api";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

const PROFILE_KEY = "studentProfile";
const EVENTS_KEY = "studentEvents";
const REGISTRATIONS_KEY = "studentRegistrations";
const DASHBOARD_STATS_KEY = "studentDashboardStats";

interface RegistrationDetailResponse {
    eventId: number;
    status: string;
    requestedAt: string;
    event?: EventItem;
}

function safeParse<T>(rawValue: string | null, fallback: T): T {
    if (!rawValue) return fallback;

    try {
        return JSON.parse(rawValue) as T;
    } catch {
        return fallback;
    }
}

function normalizeRegistrationStatus(status: string): StudentRegistration["status"] {
    if (status === "confirmed" || status === "pending" || status === "attended") {
        return status;
    }
    if (status === "registered") {
        return "confirmed";
    }
    return "pending";
}

export function getStudentProfile(): StudentProfile | null {
    return safeParse<StudentProfile | null>(
        localStorage.getItem(PROFILE_KEY),
        null
    );
}

export function saveStudentProfile(profile: StudentProfile): void {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    localStorage.setItem("userName", profile.fullName);
    localStorage.setItem("registrationNumber", profile.registrationNumber);
    localStorage.setItem("userEmail", profile.email);
}

export async function refreshStudentProfileFromApi(): Promise<StudentProfile> {
    const response = await api
        .get("students/profile")
        .json<ApiResponse<StudentProfile>>();

    if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch profile");
    }

    saveStudentProfile(response.data);
    return response.data;
}

export async function saveStudentProfileToApi(profile: StudentProfile): Promise<void> {
    const response = await api
        .put("students/profile", { json: profile })
        .json<ApiResponse<null>>();

    if (!response.success) {
        throw new Error(response.message || "Failed to update profile");
    }

    saveStudentProfile(profile);
}

export async function refreshEventsFromApi(): Promise<EventItem[]> {
    const response = await api.get("events").json<EventItem[]>();
    localStorage.setItem(EVENTS_KEY, JSON.stringify(response));
    return response;
}

export function getAllEvents(): EventItem[] {
    return safeParse<EventItem[]>(localStorage.getItem(EVENTS_KEY), []);
}

export function getEventsByCategory(category: EventCategory): EventItem[] {
    return getAllEvents().filter((eventItem) => eventItem.category === category);
}

export async function refreshRegistrationsFromApi(): Promise<StudentRegistration[]> {
    const response = await api
        .get("registrations/me")
        .json<RegistrationDetailResponse[]>();

    const normalized = response.map((registration) => ({
        ...registration,
        status: normalizeRegistrationStatus(registration.status),
        event: undefined,
    }));

    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(normalized));
    return normalized;
}

export function getRegistrations(): StudentRegistration[] {
    const parsed = safeParse<StudentRegistration[]>(
        localStorage.getItem(REGISTRATIONS_KEY),
        []
    );

    return parsed.map((registration) => ({
        ...registration,
        status: normalizeRegistrationStatus(registration.status),
    }));
}

export function getRegistrationForEvent(
    eventId: number
): StudentRegistration | undefined {
    return getRegistrations().find((r) => r.eventId === eventId);
}

export async function registerForEvent(
    eventId: number,
    profile: StudentProfile
): Promise<RegisterEventResult> {
    const existing = getRegistrationForEvent(eventId);
    if (existing) {
        return {
            ok: false,
            message: "You have already registered for this event.",
        };
    }

    const eventItem = getAllEvents().find((item) => item.id === eventId);
    if (!eventItem) {
        return {
            ok: false,
            message: "Selected event was not found.",
        };
    }

    const response = await api
        .post(`students/register/${eventId}`, { throwHttpErrors: false })
        .json<ApiResponse<null>>();

    if (!response.success) {
        return {
            ok: false,
            message: response.message || "Registration failed.",
        };
    }

    await refreshRegistrationsFromApi();

    return {
        ok: true,
        message: `Registered for ${eventItem.title} as ${profile.fullName} (${profile.registrationNumber}).`,
    };
}

export function getDashboardStats(): DashboardStats {
    const cached = safeParse<DashboardStats | null>(
        localStorage.getItem(DASHBOARD_STATS_KEY),
        null
    );

    if (cached) return cached;

    const registrations = getRegistrations();

    return {
        availableEvents: getAllEvents().length,
        myRegistrations: registrations.length,
        attendedEvents: registrations.filter(
            (item) => item.status === "attended"
        ).length,
    };
}

export async function refreshDashboardStatsFromApi(): Promise<DashboardStats> {
    const response = await api.get("dashboard/stats").json<DashboardStats>();
    localStorage.setItem(DASHBOARD_STATS_KEY, JSON.stringify(response));
    return response;
}