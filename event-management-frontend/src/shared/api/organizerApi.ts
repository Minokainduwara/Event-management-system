import { apiFetch } from "../../utils/apiFetch";

/* =========================
   BASE URLS
========================= */
const EVENT_URL = "http://localhost:8080/event";
const ANNOUNCEMENT_URL = "http://localhost:8080/announcement";
const CATEGORY_URL = "http://localhost:8080/categories";

/* =========================
   TYPES
========================= */
export interface Category {
    category_id: number;
    category_name: string;
}

export interface Event {
    event_id: number;
    event_title: string;
    description: string;
    event_date: string;
    event_time: string;
    location: string;
    status: string;
    max_participants: number;
    image?: string;
    category?: Category;
    category_id?: number;
}

export interface Announcement {
    announcement_id: number;
    title: string;
    message: string;
    created_at?: string;
}

/* =========================
   EVENTS API
========================= */
export const eventsApi = {
    getAll: async (): Promise<Event[]> => {
        const res = await apiFetch(`${EVENT_URL}/all`);
        return res.json();
    },
};

/* =========================
   CATEGORIES API
========================= */
export const categoriesApi = {
    getAll: async (): Promise<Category[]> => {
        const res = await apiFetch(CATEGORY_URL);
        return res.json();
    },
};

/* =========================
   ANNOUNCEMENTS API
========================= */
const getAllAnnouncements = async (): Promise<Announcement[]> => {
    const res = await apiFetch(`${ANNOUNCEMENT_URL}/all`);
    return res.json();
};

const addAnnouncement = async (data: { title: string; message: string }) => {
    const res = await apiFetch(`${ANNOUNCEMENT_URL}/add`, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return res.json();
};

const updateAnnouncement = async (
    id: number,
    data: { title: string; message: string }
) => {
    const res = await apiFetch(`${ANNOUNCEMENT_URL}/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    return res.json();
};

const deleteAnnouncement = async (id: number) => {
    await apiFetch(`${ANNOUNCEMENT_URL}/delete/${id}`, {
        method: "DELETE",
    });
};

export const announcementsApi = {
    getAll: getAllAnnouncements,
    add: addAnnouncement,
    update: updateAnnouncement,
    delete: deleteAnnouncement,
};