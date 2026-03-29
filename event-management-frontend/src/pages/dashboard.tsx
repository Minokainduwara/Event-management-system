import { useNavigate } from "react-router";
import { 
    Ticket, 
    CalendarCheck, 
    Calendar as CalendarIcon, 
    Clock, 
    MapPin, 
    ArrowRight,
    Search,
    ListTodo
} from "lucide-react";
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
            title="Dashboard"
        >
            <div className="space-y-8">
                {/* Hero Section */}
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-8 text-white shadow-xl md:p-10">
                    <div className="relative z-10">
                        <div className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold tracking-widest text-blue-200 mb-4 backdrop-blur-sm border border-blue-400/20">
                            STUDENT DASHBOARD
                        </div>
                        <h1 className="text-3xl font-bold md:text-5xl tracking-tight">Welcome back, {profile.fullName.split(' ')[0]}! 👋</h1>
                        <p className="mt-4 max-w-2xl text-lg text-blue-100/80 font-light">
                            Track your registrations, discover upcoming events, and stay on top of your campus activities this semester.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-medium text-blue-200">
                            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">
                                <UserBadge className="h-4 w-4" />
                                {profile.registrationNumber}
                            </span>
                            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">
                                <MailBadge className="h-4 w-4" />
                                {profile.email}
                            </span>
                        </div>
                    </div>
                    {/* Decorative background shapes */}
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
                    <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"></div>
                </section>

                {/* Stats Grid */}
                <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-all hover:shadow-md">
                        <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-blue-50 transition-transform group-hover:scale-110"></div>
                        <div className="relative flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Registered Events</p>
                                <p className="mt-2 text-4xl font-bold text-slate-800">{stats.totalRegistered}</p>
                            </div>
                            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                                <Ticket className="h-6 w-6" />
                            </div>
                        </div>
                    </article>
                    
                    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-all hover:shadow-md">
                        <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-amber-50 transition-transform group-hover:scale-110"></div>
                        <div className="relative flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Pending Approvals</p>
                                <p className="mt-2 text-4xl font-bold text-slate-800">{stats.pendingApprovals}</p>
                            </div>
                            <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
                                <CalendarCheck className="h-6 w-6" />
                            </div>
                        </div>
                    </article>
                </section>

                <section className="grid gap-8 lg:grid-cols-3">
                    {/* Events List */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="flex items-end justify-between border-b border-slate-200 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Your Upcoming Events</h2>
                                <p className="mt-1 text-sm text-slate-500">Events you are registered or waitlisted for.</p>
                            </div>
                            <button
                                type="button"
                                className="group flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm"
                                onClick={() => navigate("/events")}
                            >
                                Browse All
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>

                        {upcomingEvents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-12 px-4 text-center">
                                <div className="rounded-full bg-slate-100 p-4 text-slate-400 mb-3">
                                    <CalendarIcon className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800">No events yet</h3>
                                <p className="mt-1 max-w-sm text-sm text-slate-500 mb-6">
                                    You haven't requested registration for any events. Check out what's happening around campus!
                                </p>
                                <button
                                    onClick={() => navigate("/events")}
                                    className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
                                >
                                    Explore Events
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcomingEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-blue-200 hover:shadow-md"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{event.title}</h3>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                                                    <span className="flex items-center gap-1.5">
                                                        <CalendarIcon className="h-4 w-4 text-slate-400" />
                                                        {event.date}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="h-4 w-4 text-slate-400" />
                                                        {event.time}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin className="h-4 w-4 text-slate-400" />
                                                        {event.location}
                                                    </span>
                                                </div>
                                            </div>
                                            <span
                                                className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium shrink-0 ${
                                                    event.status === "registered"
                                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                        : "bg-amber-50 text-amber-700 border border-amber-200"
                                                }`}
                                            >
                                                <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${event.status === "registered" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                                                {event.status === "registered" ? "Registered" : "Pending"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Quick Actions */}
                    <aside className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
                            <h2 className="text-lg font-bold text-slate-900 mb-5 border-b border-slate-100 pb-3">Quick Actions</h2>
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    className="flex w-full items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border border-transparent hover:border-blue-100"
                                    onClick={() => navigate("/events")}
                                >
                                    <div className="rounded-lg bg-white p-2 shadow-sm text-blue-600">
                                        <Search className="h-4 w-4" />
                                    </div>
                                    Discover Events
                                </button>
                                <button
                                    type="button"
                                    className="flex w-full items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border border-transparent hover:border-blue-100"
                                    onClick={() => navigate("/my-registrations")}
                                >
                                    <div className="rounded-lg bg-white p-2 shadow-sm text-indigo-600">
                                        <ListTodo className="h-4 w-4" />
                                    </div>
                                    View My Approvals
                                </button>
                                <button
                                    type="button"
                                    className="flex w-full items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                                    onClick={() => navigate("/profile")}
                                >
                                    <div className="rounded-lg bg-white p-2 shadow-sm text-slate-600">
                                        <UserBadge className="h-4 w-4" />
                                    </div>
                                    Update Profile Info
                                </button>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 p-6">
                            <div className="flex items-start gap-4">
                                <div className="rounded-full bg-blue-100 p-2 text-blue-600 shrink-0 mt-0.5">
                                    <Ticket className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900">Important Note</h3>
                                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                                        Registrations for restricted events are automatically sent to the admin office for review. Keep an eye on your pending approvals!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </section>
            </div>
        </StudentLayout>
    );
}

// Simple icons to keep top imports clean if we don't import them from lucide directly above
function UserBadge(props: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" {...props}>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}

function MailBadge(props: any) {
    return (
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" {...props}>
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    )
}
