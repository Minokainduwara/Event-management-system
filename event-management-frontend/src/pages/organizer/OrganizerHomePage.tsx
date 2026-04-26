import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrganizerLayout from "../../shared/ui/OrganizerLayout";
import { apiFetch } from "../../utils/apiFetch";

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

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    UPCOMING:   { bg: "#dbeafe", text: "#1d4ed8" },
    ONGOING:    { bg: "#d1fae5", text: "#065f46" },
    COMPLETED:  { bg: "#f3f4f6", text: "#374151" },
    CANCELLED:  { bg: "#fee2e2", text: "#991b1b" },
};

function StatusBadge({ status }: { status: string }) {
    const colors = STATUS_COLORS[status?.toUpperCase()] || STATUS_COLORS.UPCOMING;
    return (
        <span style={{
            background: colors.bg, color: colors.text,
            padding: "3px 10px", borderRadius: "20px",
            fontSize: "12px", fontWeight: 600, letterSpacing: "0.3px",
        }}>
      {status}
    </span>
    );
}

export default function OrganizerHomePage() {
    const navigate = useNavigate();
    const [events, setEvents] = useState<Event[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [search, setSearch] = useState("");
    const [filterCat, setFilterCat] = useState<string>("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                const [evsRes, catsRes] = await Promise.all([
                    apiFetch("http://localhost:8080/api/events/allEvents"),
                    apiFetch("http://localhost:8080/api/category/getCategories")
                ]);

                if (!evsRes.ok || !catsRes.ok) throw new Error("Failed to fetch");

                const evsData = await evsRes.json();
                const catsData = await catsRes.json();

                setEvents(evsData);
                setCategories(catsData);
            } catch (err) {
                setError("Failed to load events. Check your connection.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const filtered = events.filter(e => {
        const matchSearch =
            e.event_title.toLowerCase().includes(search.toLowerCase()) ||
            e.location?.toLowerCase().includes(search.toLowerCase());
        const matchCat =
            filterCat === "all" ||
            String(e.category?.category_id || e.category_id) === filterCat;
        return matchSearch && matchCat;
    });

    // Stats
    const upcoming  = events.filter(e => e.status?.toUpperCase() === "UPCOMING").length;
    const ongoing   = events.filter(e => e.status?.toUpperCase() === "ONGOING").length;
    const completed = events.filter(e => e.status?.toUpperCase() === "COMPLETED").length;

    return (
        <OrganizerLayout>
            {/* Hero */}
            <div style={{
                background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #1d4ed8 100%)",
                padding: "56px 48px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
            }}>
                {/* Decorative circles */}
                <div style={{
                    position: "absolute", top: -60, right: -60,
                    width: 220, height: 220, borderRadius: "50%",
                    background: "rgba(255,255,255,0.05)",
                }} />
                <div style={{
                    position: "absolute", bottom: -40, left: 100,
                    width: 140, height: 140, borderRadius: "50%",
                    background: "rgba(255,255,255,0.04)",
                }} />
                <h1 style={{ color: "#fff", fontSize: "36px", fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                    Discover and Manage University Events
                </h1>
                <p style={{ color: "rgba(255,255,255,0.75)", marginTop: "12px", fontSize: "16px" }}>
                    Create, organize and track all campus events from one place
                </p>
                <button
                    onClick={() => navigate("/organizer/create-event")}
                    style={{
                        marginTop: "28px",
                        background: "#f59e0b",
                        color: "#fff",
                        border: "none",
                        padding: "14px 32px",
                        borderRadius: "30px",
                        fontSize: "16px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        boxShadow: "0 4px 15px rgba(245,158,11,0.4)",
                        transition: "transform 0.2s",
                    }}
                    onMouseOver={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                    onMouseOut={e => (e.currentTarget.style.transform = "translateY(0)")}
                >
                    ➕ Create Event →
                </button>

                {/* Quick stats */}
                <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "36px" }}>
                    {[
                        { label: "Total Events", value: events.length, color: "#60a5fa" },
                        { label: "Upcoming", value: upcoming, color: "#34d399" },
                        { label: "Ongoing", value: ongoing, color: "#fbbf24" },
                        { label: "Completed", value: completed, color: "#a78bfa" },
                    ].map(stat => (
                        <div key={stat.label} style={{
                            background: "rgba(255,255,255,0.1)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255,255,255,0.15)",
                            borderRadius: "14px",
                            padding: "16px 28px",
                            minWidth: "110px",
                        }}>
                            <div style={{ color: stat.color, fontSize: "28px", fontWeight: 800 }}>{stat.value}</div>
                            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", marginTop: "2px" }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Search & Filter */}
            <div style={{ padding: "28px 48px 0" }}>
                <div style={{
                    background: "#fff",
                    borderRadius: "14px",
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}>
                    <span style={{ fontSize: "18px" }}>🔍</span>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search events by name or location..."
                        style={{
                            flex: 1, border: "none", outline: "none",
                            fontSize: "15px", color: "#374151",
                        }}
                    />
                    <div style={{ width: "1px", height: "24px", background: "#e5e7eb" }} />
                    <span style={{ fontSize: "16px" }}>🔽</span>
                    <select
                        value={filterCat}
                        onChange={e => setFilterCat(e.target.value)}
                        style={{
                            border: "none", outline: "none", fontSize: "15px",
                            color: "#374151", cursor: "pointer", background: "transparent",
                        }}
                    >
                        <option value="all">All Categories</option>
                        {categories.map(c => (
                            <option key={c.category_id} value={String(c.category_id)}>
                                {c.category_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Events Grid */}
            <div style={{ padding: "28px 48px 48px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h2 style={{ margin: 0, color: "#1e3a8a", fontSize: "22px", fontWeight: 700 }}>All Events</h2>
                    <span style={{ color: "#6b7280", fontSize: "14px" }}>{filtered.length} events found</span>
                </div>

                {loading && (
                    <div style={{ textAlign: "center", padding: "80px", color: "#6b7280" }}>
                        <div style={{ fontSize: "40px", marginBottom: "12px" }}>⏳</div>
                        Loading events...
                    </div>
                )}

                {error && (
                    <div style={{
                        background: "#fee2e2", border: "1px solid #fca5a5",
                        borderRadius: "12px", padding: "20px", color: "#991b1b",
                        textAlign: "center",
                    }}>
                        {error}
                    </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div style={{ textAlign: "center", padding: "80px", color: "#6b7280" }}>
                        <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
                        <div style={{ fontSize: "18px", fontWeight: 600 }}>No events found</div>
                        <div style={{ marginTop: "6px" }}>Try adjusting your search or filter</div>
                    </div>
                )}

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                    gap: "24px",
                }}>
                    {filtered.map(event => {
                        const registered = 0; // You can wire up count API if needed
                        const pct = event.max_participants
                            ? Math.min(100, (registered / event.max_participants) * 100)
                            : 0;

                        return (
                            <div
                                key={event.event_id}
                                style={{
                                    background: "#fff",
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    cursor: "pointer",
                                }}
                                onMouseOver={e => {
                                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
                                }}
                                onMouseOut={e => {
                                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.07)";
                                }}
                            >
                                {/* Image */}
                                <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
                                    {event.image ? (
                                        <img
                                            src={event.image}
                                            alt={event.event_title}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: "100%", height: "100%",
                                            background: "linear-gradient(135deg, #1e40af, #7c3aed)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: "48px",
                                        }}>
                                            🎉
                                        </div>
                                    )}
                                    {/* Category badge */}
                                    <span style={{
                                        position: "absolute", top: "12px", right: "12px",
                                        background: "rgba(255,255,255,0.92)",
                                        backdropFilter: "blur(4px)",
                                        color: "#1e40af",
                                        padding: "4px 10px",
                                        borderRadius: "20px",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                    }}>
                    {event.category?.category_name || "General"}
                  </span>
                                </div>

                                {/* Content */}
                                <div style={{ padding: "20px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                                        <h3 style={{ margin: 0, color: "#1e3a8a", fontSize: "17px", fontWeight: 700, lineHeight: 1.3 }}>
                                            {event.event_title}
                                        </h3>
                                        <StatusBadge status={event.status} />
                                    </div>

                                    <p style={{ margin: "0 0 14px", color: "#6b7280", fontSize: "14px", lineHeight: 1.5 }}>
                                        {event.description?.slice(0, 90)}...
                                    </p>

                                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#374151" }}>
                                            <span>📅</span>
                                            {new Date(event.event_date).toLocaleDateString("en-US", {
                                                month: "long", day: "numeric", year: "numeric",
                                            })} at {event.event_time}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#374151" }}>
                                            <span>📍</span>{event.location}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#374151" }}>
                                            <span>👥</span>{registered} / {event.max_participants} registered
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div style={{ marginBottom: "16px" }}>
                                        <div style={{ background: "#f3f4f6", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
                                            <div style={{
                                                background: pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#f59e0b",
                                                height: "100%", width: `${pct}%`,
                                                borderRadius: "4px", transition: "width 0.5s",
                                            }} />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/organizer/my-events?view=${event.event_id}`)}
                                        style={{
                                            width: "100%",
                                            background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
                                            color: "#fff",
                                            border: "none",
                                            padding: "11px",
                                            borderRadius: "10px",
                                            fontSize: "14px",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "8px",
                                            transition: "opacity 0.2s",
                                        }}
                                    >
                                        View Details →
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </OrganizerLayout>
    );
}