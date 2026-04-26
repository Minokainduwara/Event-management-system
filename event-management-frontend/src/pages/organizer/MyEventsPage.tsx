import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import OrganizerLayout from "../../shared/ui/OrganizerLayout";
import { eventsApi, type Event } from "../../shared/api/organizerApi";

type Tab = "all" | "upcoming" | "completed";

// ── Event Detail Modal ──────────────────────────────────────────────────────
function EventDetailModal({ event, onClose }: { event: Event; onClose: () => void }) {
    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, padding: "20px",
        }}
             onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div style={{
                background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "600px",
                maxHeight: "85vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}>
                {event.image && (
                    <img src={event.image} alt={event.event_title}
                         style={{ width: "100%", height: "220px", objectFit: "cover", borderRadius: "20px 20px 0 0" }} />
                )}
                <div style={{ padding: "28px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                        <h2 style={{ margin: 0, color: "#1e3a8a", fontSize: "22px" }}>{event.event_title}</h2>
                        <button onClick={onClose} style={{
                            background: "none", border: "none", fontSize: "22px",
                            cursor: "pointer", color: "#6b7280", padding: "0 4px",
                        }}>✕</button>
                    </div>

                    <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
            <span style={{
                background: "#dbeafe", color: "#1d4ed8", padding: "4px 12px",
                borderRadius: "20px", fontSize: "12px", fontWeight: 600,
            }}>
              {event.category?.category_name || "General"}
            </span>
                        <span style={{
                            background: event.status?.toUpperCase() === "UPCOMING" ? "#d1fae5" : "#f3f4f6",
                            color: event.status?.toUpperCase() === "UPCOMING" ? "#065f46" : "#374151",
                            padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
                        }}>
              {event.status}
            </span>
                    </div>

                    <p style={{ color: "#4b5563", marginTop: "16px", lineHeight: 1.7 }}>{event.description}</p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "20px" }}>
                        {[
                            { label: "📅 Date", value: new Date(event.event_date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
                            { label: "⏰ Time", value: event.event_time },
                            { label: "📍 Venue", value: event.location },
                            { label: "👥 Capacity", value: `${event.max_participants} participants` },
                        ].map(item => (
                            <div key={item.label} style={{
                                background: "#f8fafc", borderRadius: "12px", padding: "14px",
                            }}>
                                <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>{item.label}</div>
                                <div style={{ fontWeight: 600, color: "#1e3a8a", fontSize: "14px" }}>{item.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Edit Modal ───────────────────────────────────────────────────────────────
function EditEventModal({ event, onClose, onSave }: {
    event: Event;
    onClose: () => void;
    onSave: (updated: Partial<Event>) => void;
}) {
    const [form, setForm] = useState({
        event_title: event.event_title,
        description: event.description,
        event_date: event.event_date?.slice(0, 10) || "",
        event_time: event.event_time,
        location: event.location,
        max_participants: event.max_participants,
        status: event.status,
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            await eventsApi.update(event.event_id, form as any);
            onSave({ ...event, ...form });
        } catch {
            alert("Failed to update event.");
        } finally {
            setSaving(false);
        }
    };

    const inputStyle = {
        width: "100%", padding: "10px 14px", borderRadius: "10px",
        border: "1.5px solid #e5e7eb", outline: "none", fontSize: "14px",
        boxSizing: "border-box" as const, fontFamily: "inherit",
    };

    const labelStyle = { display: "block", fontWeight: 600, color: "#374151", fontSize: "13px", marginBottom: "6px" };

    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, padding: "20px",
        }}
             onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div style={{
                background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "560px",
                maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}>
                <div style={{ padding: "28px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                        <h2 style={{ margin: 0, color: "#1e3a8a", fontSize: "20px" }}>✏️ Edit Event</h2>
                        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>✕</button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div>
                            <label style={labelStyle}>Event Name *</label>
                            <input style={inputStyle} value={form.event_title}
                                   onChange={e => setForm(f => ({ ...f, event_title: e.target.value }))} />
                        </div>

                        <div>
                            <label style={labelStyle}>Description *</label>
                            <textarea
                                style={{ ...inputStyle, height: "100px", resize: "vertical" }}
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            <div>
                                <label style={labelStyle}>Date *</label>
                                <input type="date" style={inputStyle} value={form.event_date}
                                       onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} />
                            </div>
                            <div>
                                <label style={labelStyle}>Time *</label>
                                <input type="time" style={inputStyle} value={form.event_time}
                                       onChange={e => setForm(f => ({ ...f, event_time: e.target.value }))} />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Venue *</label>
                            <input style={inputStyle} value={form.location}
                                   onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            <div>
                                <label style={labelStyle}>Max Attendees *</label>
                                <input type="number" style={inputStyle} value={form.max_participants}
                                       onChange={e => setForm(f => ({ ...f, max_participants: Number(e.target.value) }))} />
                            </div>
                            <div>
                                <label style={labelStyle}>Status</label>
                                <select style={inputStyle} value={form.status}
                                        onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                                    <option value="UPCOMING">UPCOMING</option>
                                    <option value="ONGOING">ONGOING</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                        <button onClick={onClose} style={{
                            flex: 1, padding: "12px", borderRadius: "10px",
                            border: "1.5px solid #e5e7eb", background: "#fff",
                            color: "#374151", fontSize: "14px", fontWeight: 600, cursor: "pointer",
                        }}>
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={saving} style={{
                            flex: 2, padding: "12px", borderRadius: "10px",
                            background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
                            color: "#fff", fontSize: "14px", fontWeight: 600,
                            border: "none", cursor: "pointer", opacity: saving ? 0.7 : 1,
                        }}>
                            {saving ? "Saving..." : "💾 Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function MyEventsPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [tab, setTab] = useState<Tab>("all");
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewEvent, setViewEvent] = useState<Event | null>(null);
    const [editEvent, setEditEvent] = useState<Event | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Event | null>(null);
    const [deleting, setDeleting] = useState(false);

    const load = useCallback(() => {
        setLoading(true);
        eventsApi.getAll()
            .then(setEvents)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { load(); }, [load]);

    // If navigated with ?view=id, open that event
    useEffect(() => {
        const viewId = searchParams.get("view");
        if (viewId && events.length > 0) {
            const e = events.find(ev => String(ev.event_id) === viewId);
            if (e) setViewEvent(e);
        }
    }, [searchParams, events]);

    const now = new Date();

    const tabEvents = {
        all: events,
        upcoming: events.filter(e => {
            const d = new Date(e.event_date);
            return d >= now || e.status?.toUpperCase() === "UPCOMING" || e.status?.toUpperCase() === "ONGOING";
        }),
        completed: events.filter(e =>
            e.status?.toUpperCase() === "COMPLETED" || new Date(e.event_date) < now
        ),
    };

    const displayed = tabEvents[tab];

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        setDeleting(true);
        try {
            await eventsApi.delete(deleteConfirm.event_id);
            setEvents(prev => prev.filter(e => e.event_id !== deleteConfirm.event_id));
            setDeleteConfirm(null);
        } catch {
            alert("Failed to delete event.");
        } finally {
            setDeleting(false);
        }
    };

    const thStyle = {
        padding: "13px 16px",
        textAlign: "left" as const,
        fontSize: "12px",
        fontWeight: 700,
        color: "#6b7280",
        textTransform: "uppercase" as const,
        letterSpacing: "0.5px",
        borderBottom: "2px solid #f3f4f6",
    };

    const tdStyle = {
        padding: "14px 16px",
        fontSize: "14px",
        color: "#374151",
        borderBottom: "1px solid #f9fafb",
        verticalAlign: "middle" as const,
    };

    return (
        <OrganizerLayout>
            <div style={{ padding: "40px 48px", maxWidth: "1400px" }}>
                {/* Header */}
                <div style={{ marginBottom: "32px" }}>
                    <h1 style={{ margin: 0, color: "#1e3a8a", fontSize: "28px", fontWeight: 800 }}>My Events</h1>
                    <p style={{ color: "#6b7280", marginTop: "6px" }}>View and manage your created events</p>
                </div>

                {/* Tabs */}
                <div style={{
                    display: "flex", background: "#fff", borderRadius: "14px",
                    padding: "6px", marginBottom: "24px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                    width: "fit-content",
                }}>
                    {(["all", "upcoming", "completed"] as Tab[]).map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            style={{
                                padding: "10px 28px",
                                borderRadius: "10px",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: 600,
                                transition: "all 0.2s",
                                background: tab === t
                                    ? "linear-gradient(135deg, #1e3a8a, #2563eb)"
                                    : "transparent",
                                color: tab === t ? "#fff" : "#6b7280",
                            }}
                        >
                            {t === "all" ? "All Events" : t === "upcoming" ? "Upcoming" : "Completed"}
                            <span style={{
                                marginLeft: "8px",
                                background: tab === t ? "rgba(255,255,255,0.25)" : "#f3f4f6",
                                color: tab === t ? "#fff" : "#374151",
                                padding: "1px 8px",
                                borderRadius: "10px",
                                fontSize: "12px",
                            }}>
                {tabEvents[t].length}
              </span>
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div style={{
                    background: "#fff", borderRadius: "16px",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.07)", overflow: "hidden",
                }}>
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "80px", color: "#6b7280" }}>
                            ⏳ Loading events...
                        </div>
                    ) : displayed.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "80px", color: "#6b7280" }}>
                            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
                            <div style={{ fontSize: "18px", fontWeight: 600 }}>No Events Found</div>
                            <div style={{ marginTop: "6px", marginBottom: "20px" }}>
                                {tab === "all" ? "You haven't created any events yet." : `No ${tab} events.`}
                            </div>
                            <button
                                onClick={() => navigate("/organizer/create-event")}
                                style={{
                                    background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
                                    color: "#fff", border: "none", padding: "12px 28px",
                                    borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer",
                                }}
                            >
                                ➕ Create Event
                            </button>
                        </div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                <tr style={{ background: "#f8fafc" }}>
                                    <th style={thStyle}>#</th>
                                    <th style={thStyle}>Event</th>
                                    <th style={thStyle}>Category</th>
                                    <th style={thStyle}>Date & Time</th>
                                    <th style={thStyle}>Venue</th>
                                    <th style={thStyle}>Capacity</th>
                                    <th style={thStyle}>Status</th>
                                    <th style={{ ...thStyle, textAlign: "center" }}>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {displayed.map((event, idx) => (
                                    <tr key={event.event_id}
                                        style={{ transition: "background 0.15s" }}
                                        onMouseOver={e => (e.currentTarget.style.background = "#f8fafc")}
                                        onMouseOut={e => (e.currentTarget.style.background = "transparent")}
                                    >
                                        <td style={tdStyle}>
                                            <span style={{ color: "#9ca3af", fontWeight: 600 }}>{idx + 1}</span>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                {event.image ? (
                                                    <img src={event.image} alt=""
                                                         style={{ width: "44px", height: "44px", borderRadius: "10px", objectFit: "cover" }} />
                                                ) : (
                                                    <div style={{
                                                        width: "44px", height: "44px", borderRadius: "10px",
                                                        background: "linear-gradient(135deg, #1e40af, #7c3aed)",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        fontSize: "20px", flexShrink: 0,
                                                    }}>🎉</div>
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: 700, color: "#1e3a8a", fontSize: "14px" }}>
                                                        {event.event_title}
                                                    </div>
                                                    <div style={{ color: "#9ca3af", fontSize: "12px", marginTop: "2px" }}>
                                                        {event.description?.slice(0, 50)}...
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                        <span style={{
                            background: "#eff6ff", color: "#1d4ed8",
                            padding: "3px 10px", borderRadius: "20px",
                            fontSize: "12px", fontWeight: 600,
                        }}>
                          {event.category?.category_name || "General"}
                        </span>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ fontWeight: 600, fontSize: "13px" }}>
                                                {new Date(event.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                            </div>
                                            <div style={{ color: "#9ca3af", fontSize: "12px" }}>{event.event_time}</div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                <span style={{ fontSize: "13px" }}>📍</span>
                                                <span style={{ fontSize: "13px" }}>{event.location}</span>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ fontSize: "13px" }}>
                                                <span style={{ fontWeight: 600 }}>—</span>
                                                <span style={{ color: "#9ca3af" }}> / {event.max_participants}</span>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                        <span style={{
                            background: event.status?.toUpperCase() === "UPCOMING" ? "#d1fae5"
                                : event.status?.toUpperCase() === "ONGOING" ? "#dbeafe"
                                    : event.status?.toUpperCase() === "COMPLETED" ? "#f3f4f6"
                                        : "#fee2e2",
                            color: event.status?.toUpperCase() === "UPCOMING" ? "#065f46"
                                : event.status?.toUpperCase() === "ONGOING" ? "#1d4ed8"
                                    : event.status?.toUpperCase() === "COMPLETED" ? "#374151"
                                        : "#991b1b",
                            padding: "4px 10px", borderRadius: "20px",
                            fontSize: "12px", fontWeight: 600,
                        }}>
                          {event.status}
                        </span>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: "center" }}>
                                            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                                                <button
                                                    onClick={() => setViewEvent(event)}
                                                    title="View Details"
                                                    style={{
                                                        background: "#eff6ff", color: "#1d4ed8",
                                                        border: "none", padding: "8px 14px",
                                                        borderRadius: "8px", cursor: "pointer",
                                                        fontSize: "12px", fontWeight: 600,
                                                        display: "flex", alignItems: "center", gap: "4px",
                                                        transition: "all 0.2s",
                                                    }}
                                                >
                                                    👁 View
                                                </button>
                                                <button
                                                    onClick={() => setEditEvent(event)}
                                                    title="Edit Event"
                                                    style={{
                                                        background: "#f0fdf4", color: "#16a34a",
                                                        border: "none", padding: "8px 14px",
                                                        borderRadius: "8px", cursor: "pointer",
                                                        fontSize: "12px", fontWeight: 600,
                                                        display: "flex", alignItems: "center", gap: "4px",
                                                        transition: "all 0.2s",
                                                    }}
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(event)}
                                                    title="Delete Event"
                                                    style={{
                                                        background: "#fef2f2", color: "#dc2626",
                                                        border: "none", padding: "8px 14px",
                                                        borderRadius: "8px", cursor: "pointer",
                                                        fontSize: "12px", fontWeight: 600,
                                                        display: "flex", alignItems: "center", gap: "4px",
                                                        transition: "all 0.2s",
                                                    }}
                                                >
                                                    🗑 Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {viewEvent && (
                <EventDetailModal event={viewEvent} onClose={() => setViewEvent(null)} />
            )}
            {editEvent && (
                <EditEventModal
                    event={editEvent}
                    onClose={() => setEditEvent(null)}
                    onSave={updated => {
                        setEvents(prev => prev.map(e => e.event_id === updated.event_id ? { ...e, ...updated } : e));
                        setEditEvent(null);
                    }}
                />
            )}

            {/* Delete Confirm */}
            {deleteConfirm && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
                }}>
                    <div style={{
                        background: "#fff", borderRadius: "20px", padding: "32px",
                        maxWidth: "400px", width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                        textAlign: "center",
                    }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
                        <h3 style={{ margin: "0 0 8px", color: "#1e3a8a" }}>Delete Event?</h3>
                        <p style={{ color: "#6b7280", margin: "0 0 24px" }}>
                            Are you sure you want to delete <strong>"{deleteConfirm.event_title}"</strong>? This action cannot be undone.
                        </p>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                style={{
                                    flex: 1, padding: "12px", borderRadius: "10px",
                                    border: "1.5px solid #e5e7eb", background: "#fff",
                                    color: "#374151", fontWeight: 600, cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                style={{
                                    flex: 1, padding: "12px", borderRadius: "10px",
                                    background: "#dc2626", color: "#fff",
                                    border: "none", fontWeight: 600, cursor: "pointer",
                                    opacity: deleting ? 0.7 : 1,
                                }}
                            >
                                {deleting ? "Deleting..." : "🗑 Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </OrganizerLayout>
    );
}