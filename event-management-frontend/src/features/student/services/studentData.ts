import {
    type DashboardStats,
    type EventCategory,
    type EventItem,
    type RegisterEventResult,
    type StudentProfile,
    type StudentRegistration,
} from "../../../shared/types/student";

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
        title: "Annual Tech Conference 2026",
        category: "Technology",
        date: "March 25, 2026",
        time: "9:30 AM",
        location: "Main Auditorium",
        organizer: "Computing Society",
        description: "Join us for an exciting day of technology talks, workshops, and networking opportunities.",
        seatsAvailable: 120,
    },
    {
        id: 2,
        title: "Sports Day 2026",
        category: "Sports",
        date: "March 30, 2026",
        time: "8:00 AM",
        location: "University Stadium",
        organizer: "Department of Physical Education",
        description: "Participate in various sports activities and competitions. Show your team spirit and athletic skills.",
        seatsAvailable: 120,
    },
    {
        id: 3,
        title: "Cultural Fest",
        category: "Cultural",
        date: "April 5, 2026",
        time: "4:30 PM",
        location: "Campus Grounds",
        organizer: "Arts Circle",
        description: "Celebrate diversity through music, dance, and art performances from students across all departments.",
        seatsAvailable: 80,
    },
    {
        id: 4,
        title: "Career Fair 2026",
        category: "Career",
        date: "April 10, 2026",
        time: "10:00 AM",
        location: "Exhibition Hall",
        organizer: "Career Guidance Unit",
        description: "Meet top recruiters and explore career opportunities. Bring your resume and professional attire.",
        seatsAvailable: 200,
    },
    {
        id: 5,
        title: "Startup Pitch Competition",
        category: "Business",
        date: "April 20, 2026",
        time: "1:30 PM",
        location: "Innovation Lab",
        organizer: "Entrepreneurship Cell",
        description: "Present your innovative business ideas to investors and win funding for your startup dreams.",
        seatsAvailable: 60,
    },
    {
        id: 6,
        title: "Music Fest",
        category: "Cultural",
        date: "April 25, 2026",
        time: "6:00 PM",
        location: "Open Theater",
        organizer: "Music Club",
        description: "An evening of live music performances featuring student bands and special guest artists.",
        seatsAvailable: 320,
    },
    {
        id: 7,
        title: "Science Exhibition",
        category: "Science",
        date: "March 10, 2026",
        time: "10:30 AM",
        location: "Science Block",
        organizer: "Faculty of Science",
        description: "Showcase of student-led research projects and practical demonstrations from multiple departments.",
        seatsAvailable: 140,
    },
];

const defaultRegistrations: StudentRegistration[] = [
    {
        eventId: 1,
        status: "confirmed",
        requestedAt: "2026-03-14T08:30:00.000Z",
    },
    {
        eventId: 4,
        status: "confirmed",
        requestedAt: "2026-03-11T10:15:00.000Z",
    },
    {
        eventId: 2,
        status: "confirmed",
        requestedAt: "2026-03-15T09:45:00.000Z",
    },
    {
        eventId: 3,
        status: "pending",
        requestedAt: "2026-03-12T11:00:00.000Z",
    },
    {
        eventId: 7,
        status: "attended",
        requestedAt: "2026-03-01T07:20:00.000Z",
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

function normalizeRegistrationStatus(status: string): StudentRegistration["status"] {
    if (status === "confirmed" || status === "pending" || status === "attended") {
        return status;
    }

    if (status === "registered") {
        return "confirmed";
    }

    return "pending";
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
    const rawRegistrations = localStorage.getItem(REGISTRATIONS_KEY);

    if (rawRegistrations === null) {
        localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(defaultRegistrations));
        return defaultRegistrations;
    }

    const parsedRegistrations = safeParse<StudentRegistration[]>(rawRegistrations, []);
    return parsedRegistrations.map((registration) => ({
        ...registration,
        status: normalizeRegistrationStatus(registration.status),
    }));
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
        message: `Registration request sent for ${eventItem.title}. Submitted as ${profile.fullName} (${profile.registrationNumber}).`,
    };
}

export function getDashboardStats(): DashboardStats {
    const registrations = getRegistrations();

    return {
        availableEvents: getAllEvents().length,
        myRegistrations: registrations.length,
        attendedEvents: registrations.filter((item) => item.status === "attended").length,
    };
}
