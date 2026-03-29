import { useNavigate } from "react-router";
import { StudentLayout } from "../components/StudentLayout";
import {
    getAllEvents,
    getDashboardStats,
    getRegistrations,
    getStudentProfile,
} from "../services/studentData";

export function Dashboard() {
    const navigate = useNavigate();
    const stats = getDashboardStats();
    const profile = getStudentProfile();

    const registrations = getRegistrations();
    const allEvents = getAllEvents();
    const upcomingEvents = registrations
        .map((registration) => {
            const eventItem = allEvents.find((eventData) => eventData.id === registration.eventId);

            if (!eventItem) {
                return null;
            }

            return {
                ...eventItem,
                status: registration.status,
            };
        })
        .filter((eventItem): eventItem is NonNullable<typeof eventItem> => Boolean(eventItem))
        .slice(0, 3);

    return (
        <StudentLayout
            title="Student Dashboard"
            subtitle="Track your events, registrations, and profile details"
        >
            <div className="space-y-6">
                <section className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl md:p-8">
                    <p className="text-sm uppercase tracking-widest text-slate-300">Student Dashboard</p>
                    <h1 className="mt-2 text-3xl md:text-4xl">Welcome back, {profile.fullName}</h1>
                    <p className="mt-3 max-w-2xl text-slate-300">
                        Track your registrations, discover upcoming events, and stay on top of your campus activities.
                    </p>
                    <p className="mt-3 text-sm text-slate-300">
                        Registration No: {profile.registrationNumber} | {profile.email}
                    </p>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Registered Events</p>
                        <p className="mt-2 text-3xl text-slate-800">{stats.totalRegistered}</p>
                    </article>
                    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Pending Approvals</p>
                        <p className="mt-2 text-3xl text-amber-600">{stats.pendingApprovals}</p>
                    </article>
                </section>

                <section className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl text-slate-800">Upcoming Events</h2>
                            <button
                                type="button"
                                className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
                                onClick={() => navigate("/events")}
                            >
                                Browse More
                            </button>
                        </div>

                        {upcomingEvents.length === 0 ? (
                            <p className="rounded-lg border border-slate-200 p-4 text-sm text-slate-600">
                                No registrations yet. Go to Events to register for restricted events.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {upcomingEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="rounded-lg border border-slate-200 p-4"
                                    >
                                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <p className="text-lg text-slate-800">{event.title}</p>
                                                <p className="text-sm text-slate-500">
                                                    {event.date} at {event.time} - {event.location}
                                                </p>
                                            </div>
                                            <span
                                                className={`inline-block rounded-full px-3 py-1 text-xs ${
                                                    event.status === "registered"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-amber-100 text-amber-700"
                                                }`}
                                            >
                                                {event.status === "registered" ? "Registered" : "Pending"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-xl text-slate-800">Quick Actions</h2>
                        <div className="mt-4 space-y-3">
                            <button
                                type="button"
                                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
                                onClick={() => navigate("/events")}
                            >
                                Register New Event
                            </button>
                            <button
                                type="button"
                                className="w-full rounded-lg bg-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-300"
                                onClick={() => navigate("/my-registrations")}
                            >
                                View My Registrations
                            </button>
                            <button
                                type="button"
                                className="w-full rounded-lg bg-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-300"
                                onClick={() => navigate("/profile")}
                            >
                                Edit Profile
                            </button>
                        </div>

                        <div className="mt-6 rounded-lg bg-slate-100 p-4">
                            <p className="text-sm text-slate-600">Next reminder</p>
                            <p className="mt-1 text-slate-800">
                                Registrations for restricted events are sent to admins for review.
                            </p>
                        </div>
                    </aside>
                </section>
            </div>
        </StudentLayout>
    );
}
