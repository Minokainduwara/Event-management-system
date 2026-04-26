import { useEffect, useState } from "react";
import OrganizerLayout from "../../shared/ui/OrganizerLayout";
import { apiFetch } from "../../utils/apiFetch";

/* ================= TYPES ================= */
type Announcement = {
    announcement_id: number;
    title: string;
    message: string;
    created_at?: string;
};

/* ================= API FUNCTIONS ================= */
const ANNOUNCEMENT_URL = "http://localhost:8080/api/announcement";

const announcementApi = {
    getAll: async (): Promise<Announcement[]> => {
        const res = await apiFetch(`${ANNOUNCEMENT_URL}/all`);
        return res.json();
    },

    add: async (data: { title: string; message: string }) => {
        const res = await apiFetch(`${ANNOUNCEMENT_URL}/add`, {
            method: "POST",
            body: JSON.stringify(data),
        });
        return res.json();
    },

    update: async (id: number, data: { title: string; message: string }) => {
        const res = await apiFetch(`${ANNOUNCEMENT_URL}/update/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
        return res.json();
    },

    delete: async (id: number) => {
        await apiFetch(`${ANNOUNCEMENT_URL}/delete/${id}`, {
            method: "DELETE",
        });
    },
};

/* ================= MODAL ================= */
function AnnouncementModal({
    mode,
    initial,
    onClose,
    onSave,
}: {
    mode: "add" | "edit";
    initial?: Announcement;
    onClose: () => void;
    onSave: (a: Announcement) => void;
}) {
    const [form, setForm] = useState({
        title: initial?.title || "",
        message: initial?.message || "",
    });

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!form.title || !form.message) return;

        setSaving(true);

        try {
            let result;

            if (mode === "add") {
                result = await announcementApi.add(form);
            } else {
                result = await announcementApi.update(
                    initial!.announcement_id,
                    form
                );
            }

            onSave(result);
        } catch  {
            alert("Failed to save announcement");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <div style={{ background: "#fff", padding: 20, width: 400 }}>
                <h3>{mode === "add" ? "Add" : "Edit"} Announcement</h3>

                <input
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                    }
                />

                <textarea
                    placeholder="Message"
                    value={form.message}
                    onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                    }
                />

                <button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                </button>

                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

/* ================= MAIN PAGE ================= */
export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    const [showAdd, setShowAdd] = useState(false);
    const [editItem, setEditItem] = useState<Announcement | null>(null);

    /* ---------- LOAD DATA ---------- */
    useEffect(() => {
        announcementApi
            .getAll()
            .then(setAnnouncements)
            .catch(() => alert("Failed to load"))
            .finally(() => setLoading(false));
    }, []);

    /* ---------- DELETE ---------- */
    const handleDelete = async (id: number) => {
        await announcementApi.delete(id);
        setAnnouncements((prev) =>
            prev.filter((a) => a.announcement_id !== id)
        );
    };

    return (
        <OrganizerLayout>
            <div style={{ padding: 40 }}>
                <h2>Announcements</h2>

                <button onClick={() => setShowAdd(true)}>
                    + Add Announcement
                </button>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    announcements.map((a) => (
                        <div
                            key={a.announcement_id}
                            style={{
                                border: "1px solid #ccc",
                                margin: 10,
                                padding: 10,
                            }}
                        >
                            <h4>{a.title}</h4>
                            <p>{a.message}</p>

                            <button onClick={() => setEditItem(a)}>
                                Edit
                            </button>

                            <button
                                onClick={() =>
                                    handleDelete(a.announcement_id)
                                }
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}

                {/* ADD */}
                {showAdd && (
                    <AnnouncementModal
                        mode="add"
                        onClose={() => setShowAdd(false)}
                        onSave={(a) =>
                            setAnnouncements((prev) => [a, ...prev])
                        }
                    />
                )}

                {/* EDIT */}
                {editItem && (
                    <AnnouncementModal
                        mode="edit"
                        initial={editItem}
                        onClose={() => setEditItem(null)}
                        onSave={(a) => {
                            setAnnouncements((prev) =>
                                prev.map((x) =>
                                    x.announcement_id === a.announcement_id
                                        ? a
                                        : x
                                )
                            );
                            setEditItem(null);
                        }}
                    />
                )}
            </div>
        </OrganizerLayout>
    );
}