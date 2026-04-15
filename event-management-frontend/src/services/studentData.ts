import {
    type DashboardStats,
    type EventCategory,
    type EventItem,
    type RegisterEventResult,
    type StudentProfile,
    type StudentRegistration,
} from "../types/student";

const PROFILE_KEY = "studentProfile";
const REGISTRATIONS_KEY = "studentRegistrations";

const defaultProfile: StudentProfile = {
    fullName: "John Smith",
    registrationNumber: "RUH/2022/CS/145",
    email: "john.smith@ruh.ac.lk",
};

const mockEvents: EventItem[] = [
    {
        id: 1,
        title: "AI Club Workshop",
        category: "open",
        date: "Apr 02, 2026",
        time: "3:00 PM",
        location: "Lab 4",
        organizer: "Faculty of Engineering",
        description: "Hands-on workshop introducing AI tools for coursework and projects.",
        seatsAvailable: 60,
    },
    {
        id: 2,
        title: "Career Networking Evening",
        category: "restricted",
        date: "Apr 05, 2026",
        time: "6:30 PM",
        location: "Main Auditorium",
        organizer: "Career Guidance Unit",
        description: "Meet alumni and employers. Registration is required for admission control.",
        seatsAvailable: 120,
    },
    {
        id: 3,
        title: "Hackathon Team Briefing",
        category: "restricted",
        date: "Apr 08, 2026",
        time: "11:00 AM",
        location: "Innovation Hall",
        organizer: "Computing Society",
        description: "Briefing session for hackathon rules, judging rubric, and team formation.",
        seatsAvailable: 80,
    },
    {
        id: 4,
        title: "Sinhala and Tamil New Year Celebration",
        category: "open",
        date: "Apr 12, 2026",
        time: "10:00 AM",
        location: "University Grounds",
        organizer: "Student Affairs Division",
        description: "Open cultural event with traditional games and performances.",
        seatsAvailable: 500,
    },
];

function safeParse<T>(rawValue: string | null, fallback: T): T {
    if (!rawValue) {
        return fallback;
    }

    try {
        return JSON.parse(rawValue) as T;
    } catch {
        return fallback;
    }
}

export function getStudentProfile(): StudentProfile {
    const profile = safeParse<StudentProfile | null>(localStorage.getItem(PROFILE_KEY), null);

    if (profile) {
        return profile;
    }

    const seededProfile: StudentProfile = {
        fullName: localStorage.getItem("userName") || defaultProfile.fullName,
        registrationNumber: localStorage.getItem("registrationNumber") || defaultProfile.registrationNumber,
        email: localStorage.getItem("userEmail") || defaultProfile.email,
    };

    localStorage.setItem(PROFILE_KEY, JSON.stringify(seededProfile));
    return seededProfile;
}

export function saveStudentProfile(profile: StudentProfile): void {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    localStorage.setItem("userName", profile.fullName);
    localStorage.setItem("registrationNumber", profile.registrationNumber);
    localStorage.setItem("userEmail", profile.email);
}

export function getAllEvents(): EventItem[] {
    return mockEvents;
}

export function getEventsByCategory(category: EventCategory): EventItem[] {
    return mockEvents.filter((eventItem) => eventItem.category === category);
}

export function getRegistrations(): StudentRegistration[] {
    return safeParse<StudentRegistration[]>(localStorage.getItem(REGISTRATIONS_KEY), []);
}

export function getRegistrationForEvent(eventId: number): StudentRegistration | undefined {
    return getRegistrations().find((registration) => registration.eventId === eventId);
}

export function registerForEvent(eventId: number, profile: StudentProfile): RegisterEventResult {
    const existing = getRegistrationForEvent(eventId);
    if (existing) {
        return {
            ok: false,
            message: "You have already registered for this event.",
        };
    }

    const eventItem = mockEvents.find((item) => item.id === eventId);
    if (!eventItem) {
        return {
            ok: false,
            message: "Selected event was not found.",
        };
    }

    if (eventItem.category === "open") {
        return {
            ok: false,
            message: "Open events do not require registration.",
        };
    }

    const updated = [
        ...getRegistrations(),
        {
            eventId,
            status: "pending",
            requestedAt: new Date().toISOString(),
        } satisfies StudentRegistration,
    ];

    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(updated));

    return {
        ok: true,
        message: `Registration request sent to admin with details: ${profile.fullName}, ${profile.registrationNumber}, ${profile.email}.`,
    };
}

export function getDashboardStats(): DashboardStats {
    const registrations = getRegistrations();
    return {
        totalRegistered: registrations.filter((item) => item.status === "registered").length,
        pendingApprovals: registrations.filter((item) => item.status === "pending").length,
    };
}
