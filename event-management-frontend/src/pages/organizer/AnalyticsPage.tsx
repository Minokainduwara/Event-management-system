import { useEffect, useState } from "react";
import OrganizerLayout from "../../shared/ui/OrganizerLayout";
import { eventsApi, registrationsApi, type Event, type Registration } from "../../shared/api/organizerApi";

// Simple bar chart in pure CSS
function BarChart({ data }: { data: { label: string; value: number; max: number; color: string }[] }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {data.map(item => (
                <div key={item.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>{item.label}</span>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: item.color }}>{item.value}</span>
                    </div>
                    <div style={{ background: "#f3f4f6", borderRadius: "6px", height: "10px", overflow: "hidden" }}>
                        <div style={{
                            height: "100%",
                            width: item.max > 0 ? `${Math.min(100, (item.value / item.max) * 100)}%` : "0%",
                            background: item.color,
                            borderRadius: "6px",
                            transition: "width 1s ease",
                        }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

// Donut chart in pure CSS (fake donut using conic-gradient)
function DonutChart({ confirmed, pending, cancelled }: {
    confirmed: number; pending: number; cancelled: number;
}) {
    const total = confirmed + pending + cancelled || 1;
    const c = (confirmed / total) * 100;
    const p = (pending / total) * 100;

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <div style={{
                width: "140px", height: "140px", borderRadius: "50%", flexShrink: 0,
                background: `conic-gradient(
          #10b981 0% ${c}%,
          #f59e0b ${c}% ${c + p}%,
          #ef4444 ${c + p}% 100%
        )`,
                position: "relative",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}>
                <div style={{
                    position: "absolute", inset: "20px", borderRadius: "50%",
                    background: "#fff", display: "flex", alignItems: "center",
                    justifyContent: "center", flexDirection: "column",
                }}>
                    <div style={{ fontSize: "20px", fontWeight: 800, color: "#1e3a8a" }}>{total}</div>
                    <div style={{ fontSize: "11px", color: "#9ca3af" }}>Total</div>
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                    { label: "Confirmed", value: confirmed, color: "#10b981" },
                    { label: "Pending", value: pending, color: "#f59e0b" },
                    { label: "Cancelled", value: cancelled, color: "#ef4444" },
                ].map(item => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: item.color }} />
                        <span style={{ fontSize: "13px", color: "#6b7280" }}>{item.label}</span>
                        <span style={{ fontWeight: 700, color: item.color, fontSize: "14px" }}>{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AnalyticsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryCounts, setCategoryCounts] = useState<{ categoryName: string; count: number }[]>([]);

    useEffect(() => {
        Promise.all([
            eventsApi.getAll(),
            registrationsApi.getAll(),
            eventsApi.getCategoryCounts(),
        ])
            .then(([evs, regs, cats]) => {
                setEvents(evs);
                setRegistrations(regs);
                setCategoryCounts(cats);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    // Stats
    const totalEvents = events.length;
    const upcomingEvents = events.filter(e => e.status?.toUpperCase() === "UPCOMING").length;
    const completedEvents = events.filter(e => e.status?.toUpperCase() === "COMPLETED").length;
    const totalRegistrations = registrations.length;
    const confirmedReg = registrations.filter(r => r.status?.toUpperCase() === "CONFIRMED").length;
    const pendingReg = registrations.filter(r => r.status?.toUpperCase() === "PENDING").length;
    const cancelledReg = registrations.filter(r => r.status?.toUpperCase() === "CANCELLED").length;

    const totalCapacity = events.reduce((sum, e) => sum + (e.max_participants || 0), 0);
    const fillRate = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;

    // Per-event registration counts (from registrations data)
    const eventRegCounts = events.map(event => {
        const count = registrations.filter(r => r.event?.event_id === event.event_id).length;
        return {
            label: event.event_title.length > 25
                ? event.event_title.slice(0, 25) + "…"
                : event.event_title,
            value: count,
            max: Math.max(...events.map(e => registrations.filter(r => r.event?.event_id === e.event_id).length), 1),
            color: "#2563eb",
        };
    }).sort((a, b) => b.value - a.value).slice(0, 8);

    const maxCat = Math.max(...categoryCounts.map(c => c.count), 1);

    const statCards = [
        { label: "Total Events", value: totalEvents, icon: "🎉", color: "#dbeafe", text: "#1d4ed8" },
        { label: "Upcoming Events", value: upcomingEvents, icon: "📅", color: "#d1fae5", text: "#065f46" },
        { label: "Completed Events", value: completedEvents, icon: "✅", color: "#f3f4f6", text: "#374151" },
        { label: "Total Registrations", value: totalRegistrations, icon: "👥", color: "#fef3c7", text: "#92400e" },
        { label: "Confirmed", value: confirmedReg, icon: "✔️", color: "#d1fae5", text: "#065f46" },
        { label: "Fill Rate", value: `${fillRate}%`, icon: "📈", color: "#ede9fe", text: "#5b21b6" },
    ];

    return (
        <OrganizerLayout>
            <div style={{ padding: "40px 48px", maxWidth: "1400px" }}>
                {/* Header */}
                <div style={{ marginBottom: "32px" }}>
                    <h1 style={{ margin: 0, color: "#1e3a8a", fontSize: "28px", fontWeight: 800 }}>
                        📊 Analytics Dashboard
                    </h1>
                    <p style={{ color: "#6b7280", marginTop: "6px" }}>Event performance and participation insights</p>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "80px", color: "#6b7280" }}>
                        ⏳ Loading analytics...
                    </div>
                ) : (
                    <>
                        {/* Stat Cards */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                            gap: "20px",
                            marginBottom: "32px",
                        }}>
                            {statCards.map(card => (
                                <div key={card.label} style={{
                                    background: "#fff",
                                    borderRadius: "16px",
                                    padding: "22px",
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px",
                                    transition: "transform 0.2s",
                                }}
                                     onMouseOver={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                                     onMouseOut={e => (e.currentTarget.style.transform = "translateY(0)")}
                                >
                                    <div style={{
                                        width: "44px", height: "44px", borderRadius: "12px",
                                        background: card.color,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "22px",
                                    }}>
                                        {card.icon}
                                    </div>
                                    <div style={{ fontSize: "28px", fontWeight: 800, color: card.text }}>{card.value}</div>
                                    <div style={{ fontSize: "13px", color: "#6b7280", fontWeight: 500 }}>{card.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Charts row */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                            {/* Registration breakdown */}
                            <div style={{
                                background: "#fff", borderRadius: "16px", padding: "28px",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                            }}>
                                <h3 style={{ margin: "0 0 20px", color: "#1e3a8a", fontSize: "16px", fontWeight: 700 }}>
                                    Registration Status Breakdown
                                </h3>
                                <DonutChart
                                    confirmed={confirmedReg}
                                    pending={pendingReg}
                                    cancelled={cancelledReg}
                                />
                            </div>

                            {/* Category distribution */}
                            <div style={{
                                background: "#fff", borderRadius: "16px", padding: "28px",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                            }}>
                                <h3 style={{ margin: "0 0 20px", color: "#1e3a8a", fontSize: "16px", fontWeight: 700 }}>
                                    Events by Category
                                </h3>
                                {categoryCounts.length > 0 ? (
                                    <BarChart
                                        data={categoryCounts.map(c => ({
                                            label: c.categoryName,
                                            value: c.count,
                                            max: maxCat,
                                            color: "#7c3aed",
                                        }))}
                                    />
                                ) : (
                                    <p style={{ color: "#9ca3af", textAlign: "center", padding: "20px 0" }}>No category data</p>
                                )}
                            </div>
                        </div>

                        {/* Registrations per event */}
                        <div style={{
                            background: "#fff", borderRadius: "16px", padding: "28px",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px",
                        }}>
                            <h3 style={{ margin: "0 0 24px", color: "#1e3a8a", fontSize: "16px", fontWeight: 700 }}>
                                Registrations per Event (Top 8)
                            </h3>
                            {eventRegCounts.length > 0 ? (
                                <BarChart data={eventRegCounts} />
                            ) : (
                                <p style={{ color: "#9ca3af", textAlign: "center", padding: "20px 0" }}>No registration data</p>
                            )}
                        </div>

                        {/* Events Table with attendance */}
                        <div style={{
                            background: "#fff", borderRadius: "16px",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden",
                        }}>
                            <div style={{ padding: "24px 28px 0" }}>
                                <h3 style={{ margin: 0, color: "#1e3a8a", fontSize: "16px", fontWeight: 700 }}>
                                    All Events — Attendance Overview
                                </h3>
                            </div>
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}>
                                    <thead>
                                    <tr style={{ background: "#f8fafc" }}>
                                        {["Event", "Category", "Date", "Capacity", "Registered", "Confirmed", "Fill Rate", "Status"].map(h => (
                                            <th key={h} style={{
                                                padding: "12px 16px", textAlign: "left",
                                                fontSize: "12px", fontWeight: 700, color: "#6b7280",
                                                textTransform: "uppercase", letterSpacing: "0.5px",
                                                borderBottom: "2px solid #f3f4f6",
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {events.map(event => {
                                        const evRegs = registrations.filter(r => r.event?.event_id === event.event_id);
                                        const evConfirmed = evRegs.filter(r => r.status?.toUpperCase() === "CONFIRMED").length;
                                        const evFill = event.max_participants > 0
                                            ? Math.round((evRegs.length / event.max_participants) * 100)
                                            : 0;

                                        return (
                                            <tr key={event.event_id}
                                                style={{ transition: "background 0.15s" }}
                                                onMouseOver={e => (e.currentTarget.style.background = "#f8fafc")}
                                                onMouseOut={e => (e.currentTarget.style.background = "transparent")}
                                            >
                                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #f9fafb" }}>
                                                    <div style={{ fontWeight: 700, color: "#1e3a8a", fontSize: "14px" }}>
                                                        {event.event_title}
                                                    </div>
                                                </td>
                                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #f9fafb" }}>
                            <span style={{
                                background: "#eff6ff", color: "#1d4ed8",
                                padding: "3px 8px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
                            }}>
                              {event.category?.category_name || "—"}
                            </span>
                                                </td>
                                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #f9fafb", fontSize: "13px", color: "#374151" }}>
                                                    {new Date(event.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                </td>
                                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #f9fafb", fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                                                    {event.max_participants}
                                                </td>
                                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #f9fafb", fontSize: "13px", fontWeight: 700, color: "#2563eb" }}>
                                                    {evRegs.length}
                                                </td>
                                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #f9fafb", fontSize: "13px", fontWeight: 700, color: "#10b981" }}>
                                                    {evConfirmed}
                                                </td>
                                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #f9fafb" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                        <div style={{ flex: 1, background: "#f3f4f6", borderRadius: "4px", height: "8px", overflow: "hidden", minWidth: "60px" }}>
                                                            <div style={{
                                                                height: "100%",
                                                                width: `${evFill}%`,
                                                                background: evFill >= 90 ? "#ef4444" : evFill >= 70 ? "#f59e0b" : "#10b981",
                                                                borderRadius: "4px",
                                                            }} />
                                                        </div>
                                                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#374151" }}>{evFill}%</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #f9fafb" }}>
                            <span style={{
                                background: event.status?.toUpperCase() === "UPCOMING" ? "#d1fae5"
                                    : event.status?.toUpperCase() === "ONGOING" ? "#dbeafe"
                                        : event.status?.toUpperCase() === "COMPLETED" ? "#f3f4f6"
                                            : "#fee2e2",
                                color: event.status?.toUpperCase() === "UPCOMING" ? "#065f46"
                                    : event.status?.toUpperCase() === "ONGOING" ? "#1d4ed8"
                                        : event.status?.toUpperCase() === "COMPLETED" ? "#374151"
                                            : "#991b1b",
                                padding: "3px 10px", borderRadius: "20px",
                                fontSize: "12px", fontWeight: 600,
                            }}>
                              {event.status}
                            </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </OrganizerLayout>
    );
}