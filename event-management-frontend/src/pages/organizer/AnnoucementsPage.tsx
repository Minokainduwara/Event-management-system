import { useEffect, useState } from "react";
import OrganizerLayout from "../../shared/ui/OrganizerLayout";
import { announcementsApi, type Announcement } from "../../shared/api/organizerApi";

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
    const [errors, setErrors] = useState<{ title?: string; message?: string }>({});

    const validate = () => {
        const e: typeof errors = {};
        if (!form.title.trim()) e.title = "Title is required";
        if (!form.message.trim()) e.message = "Message is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            let result: Announcement;
            if (mode === "add") {
                result = await announcementsApi.add(form);
            } else {
                result = await announcementsApi.update(initial!.announcement_id, form);
            }
            onSave(result);
        } catch {
            alert("Failed to save announcement.");
        } finally {
            setSaving(false);
        }
    };

    const inputStyle = (hasError?: boolean) => ({
        width: "100%",
        padding: "11px 14px",
        borderRadius: "10px",
        border: `1.5px solid ${hasError ? "#ef4444" : "#e5e7eb"}`,
        outline: "none",
        fontSize: "14px",
        boxSizing: "border-box" as const,
        fontFamily: "inherit",
        color: "#374151",
        transition: "border-color 0.2s",
    });

    return (
        <div
            style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 1000, padding: "20px",
            }}
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div style={{
                background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "520px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}>
                <div style={{ padding: "28px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                        <h2 style={{ margin: 0, color: "#1e3a8a", fontSize: "20px" }}>
                            {mode === "add" ? "📢 New Announcement" : "✏️ Edit Announcement"}
                        </h2>
                        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>✕</button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                        <div>
                            <label style={{ display: "block", fontWeight: 700, color: "#374151", fontSize: "13px", marginBottom: "6px" }}>
                                Announcement Title *
                            </label>
                            <input
                                style={inputStyle(!!errors.title)}
                                placeholder="Enter announcement title"
                                value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                onFocus={e => (e.target.style.borderColor = "#2563eb")}
                                onBlur={e => (e.target.style.borderColor = errors.title ? "#ef4444" : "#e5e7eb")}
                            />
                            {errors.title && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>⚠ {errors.title}</p>}
                        </div>

                        <div>
                            <label style={{ display: "block", fontWeight: 700, color: "#374151", fontSize: "13px", marginBottom: "6px" }}>
                                Message *
                            </label>
                            <textarea
                                style={{ ...inputStyle(!!errors.message), height: "140px", resize: "vertical" }}
                                placeholder="Write your announcement message..."
                                value={form.message}
                                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                onFocus={e => (e.target.style.borderColor = "#2563eb")}
                                onBlur={e => (e.target.style.borderColor = errors.message ? "#ef4444" : "#e5e7eb")}
                            />
                            {errors.message && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>⚠ {errors.message}</p>}
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                        <button onClick={onClose} style={{
                            flex: 1, padding: "12px", borderRadius: "10px",
                            border: "1.5px solid #e5e7eb", background: "#fff",
                            color: "#374151", fontWeight: 600, cursor: "pointer", fontSize: "14px",
                        }}>
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={saving} style={{
                            flex: 2, padding: "12px", borderRadius: "10px",
                            background: saving ? "#93c5fd" : "linear-gradient(135deg, #1e3a8a, #2563eb)",
                            color: "#fff", border: "none", fontWeight: 700,
                            cursor: saving ? "not-allowed" : "pointer", fontSize: "14px",
                        }}>
                            {saving ? "Saving..." : mode === "add" ? "📢 Publish" : "💾 Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editItem, setEditItem] = useState<Announcement | null>(null);
    const [deleteItem, setDeleteItem] = useState<Announcement | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        announcementsApi.getAll()
            .then(setAnnouncements)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async () => {
        if (!deleteItem) return;
        setDeleting(true);
        try {
            await announcementsApi.delete(deleteItem.announcement_id);
            setAnnouncements(prev => prev.filter(a => a.announcement_id !== deleteItem.announcement_id));
            setDeleteItem(null);
        } catch {
            alert("Failed to delete announcement.");
        } finally {
            setDeleting(false);
        }
    };

    const filtered = announcements.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.message.toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
            });
        } catch { return dateStr; }
    };

    return (
        <OrganizerLayout>
            <div style={{ padding: "40px 48px", maxWidth: "1000px" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "32px" }}>
                    <div>
                        <h1 style={{ margin: 0, color: "#1e3a8a", fontSize: "28px", fontWeight: 800 }}>
                            📢 Announcements
                        </h1>
                        <p style={{ color: "#6b7280", marginTop: "6px" }}>
                            Create and manage announcements for your events
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAdd(true)}
                        style={{
                            background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
                            color: "#fff", border: "none",
                            padding: "12px 24px", borderRadius: "12px",
                            fontSize: "14px", fontWeight: 700, cursor: "pointer",
                            display: "flex", alignItems: "center", gap: "8px",
                            boxShadow: "0 4px 15px rgba(37,99,235,0.3)",
                            transition: "transform 0.2s",
                        }}
                        onMouseOver={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                        onMouseOut={e => (e.currentTarget.style.transform = "translateY(0)")}
                    >
                        ➕ New Announcement
                    </button>
                </div>

                {/* Search */}
                <div style={{
                    background: "#fff", borderRadius: "12px", padding: "12px 18px",
                    display: "flex", alignItems: "center", gap: "12px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)", marginBottom: "24px",
                }}>
                    <span style={{ fontSize: "16px" }}>🔍</span>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search announcements..."
                        style={{ flex: 1, border: "none", outline: "none", fontSize: "14px", color: "#374151" }}
                    />
                    {search && (
                        <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: "16px" }}>
                            ✕
                        </button>
                    )}
                </div>

                {/* Count */}
                <div style={{ color: "#6b7280", fontSize: "13px", marginBottom: "16px" }}>
                    {filtered.length} announcement{filtered.length !== 1 ? "s" : ""}
                </div>

                {/* List */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: "80px", color: "#6b7280" }}>⏳ Loading...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px", color: "#6b7280" }}>
                        <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
                        <div style={{ fontSize: "18px", fontWeight: 600 }}>No announcements yet</div>
                        <div style={{ marginTop: "6px", marginBottom: "20px" }}>Create your first announcement to notify everyone</div>
                        <button
                            onClick={() => setShowAdd(true)}
                            style={{
                                background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
                                color: "#fff", border: "none", padding: "12px 24px",
                                borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer",
                            }}
                        >
                            📢 Create Announcement
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {filtered.map(a => (
                            <div key={a.announcement_id} style={{
                                background: "#fff", borderRadius: "16px", padding: "24px",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                                borderLeft: "4px solid #2563eb",
                                transition: "transform 0.2s, box-shadow 0.2s",
                            }}
                                 onMouseOver={e => {
                                     (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                                     (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)";
                                 }}
                                 onMouseOut={e => {
                                     (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                                     (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                                 }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                    <div style={{ flex: 1, marginRight: "20px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                            <span style={{ fontSize: "18px" }}>📢</span>
                                            <h3 style={{ margin: 0, color: "#1e3a8a", fontSize: "17px", fontWeight: 700 }}>
                                                {a.title}
                                            </h3>
                                        </div>
                                        <p style={{ margin: "0 0 12px", color: "#4b5563", lineHeight: 1.65, fontSize: "14px" }}>
                                            {a.message}
                                        </p>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#9ca3af", fontSize: "12px" }}>
                                            <span>🕐</span>
                                            <span>{a.created_at ? formatDate(a.created_at) : "Just now"}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                                        <button
                                            onClick={() => setEditItem(a)}
                                            style={{
                                                background: "#f0fdf4", color: "#16a34a",
                                                border: "none", padding: "8px 14px",
                                                borderRadius: "8px", cursor: "pointer",
                                                fontSize: "12px", fontWeight: 600,
                                                display: "flex", alignItems: "center", gap: "4px",
                                            }}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteItem(a)}
                                            style={{
                                                background: "#fef2f2", color: "#dc2626",
                                                border: "none", padding: "8px 14px",
                                                borderRadius: "8px", cursor: "pointer",
                                                fontSize: "12px", fontWeight: 600,
                                                display: "flex", alignItems: "center", gap: "4px",
                                            }}
                                        >
                                            🗑 Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showAdd && (
                <AnnouncementModal
                    mode="add"
                    onClose={() => setShowAdd(false)}
                    onSave={a => {
                        setAnnouncements(prev => [a, ...prev]);
                        setShowAdd(false);
                    }}
                />
            )}
            {editItem && (
                <AnnouncementModal
                    mode="edit"
                    initial={editItem}
                    onClose={() => setEditItem(null)}
                    onSave={a => {
                        setAnnouncements(prev => prev.map(x => x.announcement_id === a.announcement_id ? a : x));
                        setEditItem(null);
                    }}
                />
            )}

            {/* Delete confirm */}
            {deleteItem && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
                }}>
                    <div style={{
                        background: "#fff", borderRadius: "20px", padding: "32px",
                        maxWidth: "400px", width: "90%", textAlign: "center",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                    }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
                        <h3 style={{ margin: "0 0 8px", color: "#1e3a8a" }}>Delete Announcement?</h3>
                        <p style={{ color: "#6b7280", margin: "0 0 24px" }}>
                            Are you sure you want to delete <strong>"{deleteItem.title}"</strong>?
                        </p>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button onClick={() => setDeleteItem(null)} style={{
                                flex: 1, padding: "12px", borderRadius: "10px",
                                border: "1.5px solid #e5e7eb", background: "#fff",
                                color: "#374151", fontWeight: 600, cursor: "pointer",
                            }}>Cancel</button>
                            <button onClick={handleDelete} disabled={deleting} style={{
                                flex: 1, padding: "12px", borderRadius: "10px",
                                background: "#dc2626", color: "#fff",
                                border: "none", fontWeight: 600, cursor: "pointer",
                            }}>
                                {deleting ? "Deleting..." : "🗑 Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </OrganizerLayout>
    );
}