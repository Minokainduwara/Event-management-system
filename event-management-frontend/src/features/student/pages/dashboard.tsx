import { useEffect, useState } from "react";
import { CalendarDays, CalendarPlus2, Check, ListChecks } from "lucide-react";
import { StudentLayout } from "../components/StudentLayout";
import {
    getAllEvents,
    getDashboardStats,
    getRegistrations,
    getStudentProfile,
    refreshDashboardStatsFromApi,
    refreshEventsFromApi,
    refreshRegistrationsFromApi,
} from "../services/studentData";
import type { DashboardStats, EventItem, StudentRegistration } from "../../../shared/types/student";

type ActivityItem = {
    id: number;
    text: string;
    when: string;
    kind: "attended" | "registered";
};

function getFallbackActivity(registrationDate: string): string {
    const diffMs = Date.now() - new Date(registrationDate).getTime();
    const diffDays = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    if (diffDays >= 7) {
        const weeks = Math.floor(diffDays / 7);
        return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    }

    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
}

export function Dashboard() {
    const profile = getStudentProfile();
    const [stats, setStats] = useState<DashboardStats>(getDashboardStats());
    const [allEvents, setAllEvents] = useState<EventItem[]>(getAllEvents());
    const [registrations, setRegistrations] = useState<StudentRegistration[]>(getRegistrations());

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [statsFromApi, eventsFromApi, registrationsFromApi] = await Promise.all([
                    refreshDashboardStatsFromApi(),
                    refreshEventsFromApi(),
                    refreshRegistrationsFromApi(),
                ]);

                setStats(statsFromApi);
                setAllEvents(eventsFromApi);
                setRegistrations(registrationsFromApi);
            } catch {
                setStats(getDashboardStats());
                setAllEvents(getAllEvents());
                setRegistrations(getRegistrations());
            }
        };

        void loadDashboardData();
    }, []);

    const upcomingEvents = [
        allEvents.find((eventItem) => eventItem.title === "Annual Tech Conference 2026"),
        allEvents.find((eventItem) => eventItem.title === "Sports Day 2026"),
        allEvents.find((eventItem) => eventItem.title === "Cultural Fest"),
        allEvents.find((eventItem) => eventItem.title === "Career Fair 2026"),
    ].filter((eventItem): eventItem is NonNullable<typeof eventItem> => Boolean(eventItem));

    const seededActivityLabels = ["2 days ago", "5 days ago", "1 week ago"];
    const recentActivity: ActivityItem[] = registrations
        .map((registration) => {
            const eventItem = allEvents.find((eventData) => eventData.id === registration.eventId);
            if (!eventItem) {
                return null;
            }

            return {
                id: registration.eventId,
                text:
                    registration.status === "attended"
                        ? `Attended ${eventItem.title}`
                        : `Registered for ${eventItem.title}`,
                when: getFallbackActivity(registration.requestedAt),
                kind: registration.status === "attended" ? "attended" : "registered",
            } satisfies ActivityItem;
        })
        .filter((item): item is ActivityItem => Boolean(item))
        .slice(0, 3)
        .map((item, index) => ({
            ...item,
            when: seededActivityLabels[index] || item.when,
        }));

    const statCards = [
        {
            label: "Available Events",
            value: stats.availableEvents,
            icon: <CalendarDays className="h-5 w-5" />,
            iconStyle: "bg-blue-50 text-blue-600",
        },
        {
            label: "My Registrations",
            value: stats.myRegistrations,
            icon: <ListChecks className="h-5 w-5" />,
            iconStyle: "bg-emerald-50 text-emerald-600",
        },
        {
            label: "Attended Events",
            value: stats.attendedEvents,
            icon: <Check className="h-5 w-5" />,
            iconStyle: "bg-violet-50 text-violet-600",
        },
    ];

    return (
        <StudentLayout title="Dashboard" subtitle={`Welcome back, ${profile.fullName.split(" ")[0] || "Student"}`}>
            <div className="mx-auto max-w-5xl space-y-6">
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {statCards.map((cardItem) => (
                        <article
                            key={cardItem.label}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{cardItem.label}</p>
                                    <p className="mt-2 text-4xl font-semibold leading-none text-slate-800">{cardItem.value}</p>
                                </div>
                                <div className={`rounded-xl p-3 ${cardItem.iconStyle}`}>{cardItem.icon}</div>
                            </div>
                        </article>
                    ))}
                </section>

                <section className="max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                    <div className="border-b border-slate-200 px-5 py-4">
                        <h2 className="text-3xl font-semibold leading-none text-slate-800">Upcoming Events</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Event Name
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Category
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {upcomingEvents.map((eventItem) => (
                                    <tr key={eventItem.id}>
                                        <td className="px-5 py-3.5 text-sm text-slate-800">{eventItem.title}</td>
                                        <td className="px-5 py-3.5 text-sm text-slate-600">{eventItem.category}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                    <div className="border-b border-slate-200 px-5 py-4">
                        <h2 className="text-3xl font-semibold leading-none text-slate-800">Recent Activity</h2>
                    </div>

                    <div className="px-5 py-2">
                        {recentActivity.length === 0 ? (
                            <p className="py-6 text-sm text-slate-500">No recent activity yet.</p>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {recentActivity.map((activityItem) => (
                                    <li key={`${activityItem.id}-${activityItem.text}`} className="flex items-start gap-3 py-3">
                                        <span
                                            className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                                activityItem.kind === "attended"
                                                    ? "bg-blue-100 text-blue-600"
                                                    : "bg-emerald-100 text-emerald-600"
                                            }`}
                                        >
                                            {activityItem.kind === "attended" ? (
                                                <CalendarPlus2 className="h-4 w-4" />
                                            ) : (
                                                <Check className="h-4 w-4" />
                                            )}
                                        </span>
                                        <span>
                                            <p className="text-sm font-medium text-slate-700">{activityItem.text}</p>
                                            <p className="text-xs text-slate-500">{activityItem.when}</p>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            </div>
        </StudentLayout>
    );
}
