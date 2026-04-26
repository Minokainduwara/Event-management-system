import { useEffect, useState } from "react";
import OrganizerLayout from "../../shared/ui/OrganizerLayout";
import { apiFetch } from "../../utils/apiFetch";

// ================= TYPES =================
type Event = {
    event_id: number;
    event_title: string;
    event_date: string;
    max_participants: number;
    status?: string;
    category?: {
        category_name: string;
    };
};

type Registration = {
    registration_id: number;
    status?: string;
    event?: {
        event_id: number;
    };
};

// ================= UI COMPONENTS =================
function BarChart({ data }: { data: { label: string; value: number; max: number; color: string }[] }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {data.map(item => (
                <div key={item.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600 }}>{item.label}</span>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: item.color }}>
                            {item.value}
                        </span>
                    </div>
                    <div style={{ background: "#f3f4f6", borderRadius: "6px", height: "10px" }}>
                        <div
                            style={{
                                height: "100%",
                                width: item.max ? `${(item.value / item.max) * 100}%` : "0%",
                                background: item.color,
                                borderRadius: "6px",
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

function DonutChart({
    confirmed,
    pending,
    cancelled,
}: {
    confirmed: number;
    pending: number;
    cancelled: number;
}) {
    const total = confirmed + pending + cancelled || 1;

    const c = (confirmed / total) * 100;
    const p = (pending / total) * 100;

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div
                style={{
                    width: "140px",
                    height: "140px",
                    borderRadius: "50%",
                    background: `conic-gradient(#10b981 0% ${c}%, #f59e0b ${c}% ${c + p}%, #ef4444 ${c + p}% 100%)`,
                    position: "relative",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: "20px",
                        borderRadius: "50%",
                        background: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <div style={{ fontSize: "20px", fontWeight: 800 }}>{total}</div>
                    <div style={{ fontSize: "11px", color: "#999" }}>Total</div>
                </div>
            </div>

            <div>
                <p>✔ Confirmed: {confirmed}</p>
                <p>⏳ Pending: {pending}</p>
                <p>❌ Cancelled: {cancelled}</p>
            </div>
        </div>
    );
}
type CategoryCount = {
    categoryName: string;
    eventCount: number;
};

// ================= MAIN PAGE =================
export default function AnalyticsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);
    const [loading, setLoading] = useState(true);

    // ================= LOAD DATA FROM BACKEND =================
    useEffect(() => {
        const loadData = async () => {
            try {
                const [eventsRes, regsRes, catsRes] = await Promise.all([
                    apiFetch("http://localhost:8080/api/events/allEvents"),
                    apiFetch("http://localhost:8080/api/eventRegistrations/registration"),
                    apiFetch("http://localhost:8080/api/events/category-counts"),
                ]);

                const eventsData = await eventsRes.json();
                const regsData = await regsRes.json();
                const catsData = await catsRes.json();

                setEvents(eventsData);
                setRegistrations(regsData);
                setCategoryCounts(catsData);
            } catch (err) {
                console.error("Error loading analytics:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // ================= STATS =================
    const totalEvents = events.length;
    const totalRegistrations = registrations.length;

    const confirmed = registrations.filter(r => r.status?.toUpperCase() === "CONFIRMED").length;
    const pending = registrations.filter(r => r.status?.toUpperCase() === "PENDING").length;
    const cancelled = registrations.filter(r => r.status?.toUpperCase() === "CANCELLED").length;

    const maxCat = Math.max(...categoryCounts.map(c => c.eventCount), 1);

    const eventStats = events.map(e => ({
        label: e.event_title,
        value: registrations.filter(r => r.event?.event_id === e.event_id).length,
        max: totalRegistrations || 1,
        color: "#2563eb",
    }));

    // ================= UI =================
    return (
        <OrganizerLayout>
            <div style={{ padding: "40px" }}>
                <h1>📊 Analytics Dashboard</h1>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        {/* TOP STATS */}
                        <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
                            <div>Total Events: {totalEvents}</div>
                            <div>Total Registrations: {totalRegistrations}</div>
                        </div>

                        {/* DONUT */}
                        <div style={{ marginBottom: "30px" }}>
                            <DonutChart
                                confirmed={confirmed}
                                pending={pending}
                                cancelled={cancelled}
                            />
                        </div>

                        {/* CATEGORY */}
                        <h3>Events by Category</h3>
                        <BarChart
                            data={categoryCounts.map(c => ({
                                label: c.categoryName,
                                value: c.eventCount,
                                max: maxCat,
                                color: "#7c3aed",
                            }))}
                        />

                        {/* EVENT STATS */}
                        <h3 style={{ marginTop: "30px" }}>Event Registrations</h3>
                        <BarChart data={eventStats} />
                    </>
                )}
            </div>
        </OrganizerLayout>
    );
}