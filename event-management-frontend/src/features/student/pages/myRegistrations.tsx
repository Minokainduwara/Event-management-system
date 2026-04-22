import { useEffect, useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { StudentLayout } from "../components/StudentLayout";
import { getAllEvents, getRegistrations, refreshEventsFromApi, refreshRegistrationsFromApi } from "../services/studentData";
import type { EventItem, StudentRegistration } from "../../../shared/types/student";

type RegistrationView = {
    eventId: number;
    eventName: string;
    date: string;
    location: string;
    status: "pending" | "confirmed" | "attended";
    registeredOn: string;
};

function formatRegisteredDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function getStatusPill(status: RegistrationView["status"]): string {
    if (status === "confirmed") {
        return "bg-emerald-100 text-emerald-700";
    }

    if (status === "attended") {
        return "bg-blue-100 text-blue-700";
    }

    return "bg-amber-100 text-amber-700";
}

function getStatusLabel(status: RegistrationView["status"]): string {
    if (status === "confirmed") {
        return "Confirmed";
    }

    if (status === "attended") {
        return "Attended";
    }

    return "Pending";
}

export function MyRegistrationsPage() {
    const [registrations, setRegistrations] = useState<StudentRegistration[]>([]);
    const [allEvents, setAllEvents] = useState<EventItem[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [eventsFromApi, registrationsFromApi] = await Promise.all([
                    refreshEventsFromApi(),
                    refreshRegistrationsFromApi(),
                ]);
                setAllEvents(eventsFromApi);
                setRegistrations(registrationsFromApi);
            } catch {
                setAllEvents(getAllEvents());
                setRegistrations(getRegistrations());
            }
        };

        void loadData();
    }, []);

    const mappedRegistrations: RegistrationView[] = registrations
        .map((registration) => {
            const eventItem = allEvents.find((eventData) => eventData.id === registration.eventId);
            if (!eventItem) {
                return null;
            }

            return {
                eventId: registration.eventId,
                eventName: eventItem.title,
                date: eventItem.date,
                location: eventItem.location,
                status: registration.status,
                registeredOn: formatRegisteredDate(registration.requestedAt),
            } satisfies RegistrationView;
        })
        .filter((item): item is RegistrationView => Boolean(item));

    return (
        <StudentLayout title="My Registered Events" subtitle="View all events you have registered for">
            <div className="mx-auto max-w-6xl space-y-6">
                {mappedRegistrations.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                        You have not registered for any events yet.
                    </div>
                ) : (
                    <>
                        <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Event Name
                                            </th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Date
                                            </th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Location
                                            </th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Status
                                            </th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Registered On
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-200">
                                        {mappedRegistrations.map((item) => (
                                            <tr key={item.eventId}>
                                                <td className="px-5 py-3.5 text-sm text-slate-800">{item.eventName}</td>
                                                <td className="px-5 py-3.5 text-sm text-slate-600">{item.date}</td>
                                                <td className="px-5 py-3.5 text-sm text-slate-600">{item.location}</td>
                                                <td className="px-5 py-3.5 text-sm">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusPill(item.status)}`}
                                                    >
                                                        {getStatusLabel(item.status)}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 text-sm text-slate-600">{item.registeredOn}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section className="space-y-4">
                            {mappedRegistrations.map((item) => (
                                <article
                                    key={`card-${item.eventId}`}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.05)]"
                                >
                                    <h2 className="text-3xl font-semibold leading-tight text-slate-800">{item.eventName}</h2>
                                    <span
                                        className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusPill(item.status)}`}
                                    >
                                        {getStatusLabel(item.status)}
                                    </span>

                                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                                        <p className="flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4 text-slate-500" />
                                            {item.date}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-slate-500" />
                                            {item.location}
                                        </p>
                                        <p className="text-xs text-slate-500">Registered on: {item.registeredOn}</p>
                                    </div>
                                </article>
                            ))}
                        </section>
                    </>
                )}
            </div>
        </StudentLayout>
    );
}
