// organizerApi.ts — All API calls for the organizer section
// Base URL from .env
const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

function getHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        method,
        headers: getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}

// ── Events ──────────────────────────────────────────────────────────────────
export const eventsApi = {
    getAll: () => request<Event[]>("GET", "/events/allEvents"),
    getById: (id: number) => request<Event>("GET", `/events/getEvent/${id}`),
    create: (data: CreateEventDto) => request<Event>("POST", "/events/saveEvent", data),
    update: (id: number, data: Partial<CreateEventDto>) =>
        request<Event>("PUT", `/events/updateEvent/${id}`, data),
    delete: (id: number) => request<void>("DELETE", `/events/deleteEvent/${id}`),
    search: (keyword: string) =>
        request<Event[]>("GET", `/events/searchEvent?keyword=${encodeURIComponent(keyword)}`),
    filterByCategory: (categoryId: number) =>
        request<Event[]>("GET", `/events/filter?categoryId=${categoryId}`),
    updateStatus: (id: number, status: string) =>
        request<void>("PUT", `/events/updateStatus/${id}?status=${status}`),
    getCategoryCounts: () => request<CategoryCount[]>("GET", "/events/category-counts"),
};

// ── Categories ───────────────────────────────────────────────────────────────
export const categoriesApi = {
    getAll: () => request<Category[]>("GET", "/category/getCategories"),
};

// ── Registrations ────────────────────────────────────────────────────────────
export const registrationsApi = {
    getAll: () => request<Registration[]>("GET", "/eventRegistrations/registration"),
    getSummary: () => request<RegistrationSummary>("GET", "/eventRegistrations/summary"),
    getByEvent: (eventId: number) =>
        request<Registration[]>("GET", `/eventRegistrations/event/${eventId}`),
    getCount: (eventId: number) =>
        request<number>("GET", `/eventRegistrations/count/${eventId}`),
    updateStatus: (id: number, status: string) =>
        request<void>("PUT", `/eventRegistrations/${id}/status?status=${status}`),
    delete: (id: number) => request<void>("DELETE", `/eventRegistrations/${id}`),
};

// ── Announcements ────────────────────────────────────────────────────────────
export const announcementsApi = {
    getAll: () => request<Announcement[]>("GET", "/announcement/all"),
    add: (data: CreateAnnouncementDto) =>
        request<Announcement>("POST", "/announcement/add", data),
    update: (id: number, data: Partial<CreateAnnouncementDto>) =>
        request<Announcement>("PUT", `/announcement/update/${id}`, data),
    delete: (id: number) => request<void>("DELETE", `/announcement/delete/${id}`),
};

// ── Profile ──────────────────────────────────────────────────────────────────
export const profileApi = {
    get: () => request<User>("GET", "/users/profile"),
    update: (data: Partial<User>) => request<User>("PUT", "/users/profile", data),
    changePassword: (data: ChangePasswordDto) =>
        request<void>("PUT", "/users/change-password", data),
};

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Event {
    event_id: number;
    event_title: string;
    description: string;
    event_date: string;
    event_time: string;
    location: string;
    max_participants: number;
    status: string;
    image?: string;
    category?: Category;
    category_id?: number;
}

export interface Category {
    category_id: number;
    category_name: string;
    description?: string;
}

export interface CategoryCount {
    categoryName: string;
    count: number;
}

export interface Registration {
    registration_id: number;
    event?: Event;
    user?: User;
    registration_date: string;
    status: string;
}

export interface RegistrationSummary {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
}

export interface Announcement {
    announcement_id: number;
    title: string;
    message: string;
    created_at: string;
    created_by?: number;
}

export interface User {
    user_id: number;
    name: string;
    email: string;
    phone?: string;
    department?: string;
    university_id?: string;
    year?: string;
    role?: string;
}

export interface CreateEventDto {
    event_title: string;
    description: string;
    event_date: string;
    event_time: string;
    location: string;
    max_participants: number;
    category_id: number;
    image?: string;
}

export interface CreateAnnouncementDto {
    title: string;
    message: string;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}