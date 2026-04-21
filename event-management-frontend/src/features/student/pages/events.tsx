import { useEffect, useMemo, useState } from "react";
import { CalendarDays, MapPin, Search } from "lucide-react";
import { StudentLayout } from "../components/StudentLayout";
import {
    getAllEvents,
    getStudentProfile,
    getRegistrations,
    refreshEventsFromApi,
    refreshRegistrationsFromApi,
    registerForEvent,
} from "../services/studentData";
import type { EventItem, StudentRegistration } from "../../../shared/types/student";

export function EventsPage() {
    const [searchText, setSearchText] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [toastMessage, setToastMessage] = useState("");
    const [events, setEvents] = useState<EventItem[]>([]);
    const [registrations, setRegistrations] = useState<StudentRegistration[]>([]);

    const categories = Array.from(new Set(events.map((eventItem) => eventItem.category)));

    useEffect(() => {
        const loadData = async () => {
            try {
                const [eventsFromApi, registrationsFromApi] = await Promise.all([refreshEventsFromApi(), refreshRegistrationsFromApi()]);
                setEvents(eventsFromApi);
                setRegistrations(registrationsFromApi);
            } catch {
                setEvents(getAllEvents());
                setRegistrations(getRegistrations());
                setToastMessage("Could not refresh events/registrations from backend.");
            }
        };

        void loadData();
    }, []);

    const filteredEvents = useMemo(() => {
        const normalizedSearch = searchText.trim().toLowerCase();

        return events.filter((eventItem) => {
            const matchesCategory = categoryFilter === "all" || eventItem.category === categoryFilter;
            const matchesSearch =
                normalizedSearch.length === 0 ||
                eventItem.title.toLowerCase().includes(normalizedSearch) ||
                eventItem.description.toLowerCase().includes(normalizedSearch);

            return matchesCategory && matchesSearch;
        });
    }, [categoryFilter, events, searchText]);

    const handleRegister = async (eventId: number) => {
        const profile = getStudentProfile();
        const result = await registerForEvent(eventId, profile);
        setToastMessage(result.message);

        if (result.ok) {
            setRegistrations(getRegistrations());
        }
    };

    return (
        <StudentLayout title="View Events" subtitle="Browse and register for upcoming events">
            <div className="mx-auto max-w-5xl">
                {toastMessage ? (
                    <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">{toastMessage}</div>
                ) : null}

                <section className="mb-6 grid gap-3 md:grid-cols-[1fr_180px]">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="search"
                            value={searchText}
                            onChange={(event) => setSearchText(event.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                            placeholder="Search events..."
                        />
                    </div>

                    <select
                        value={categoryFilter}
                        onChange={(event) => setCategoryFilter(event.target.value)}
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((categoryItem) => (
                            <option key={categoryItem} value={categoryItem}>
                                {categoryItem}
                            </option>
                        ))}
                    </select>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                    {filteredEvents.map((eventItem) => {
                        const registration = registrations.find((item) => item.eventId === eventItem.id);

                        return (
                            <article
                                key={eventItem.id}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.05)]"
                            >
                                <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                                    {eventItem.category}
                                </span>

                                <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-800">{eventItem.title}</h2>
                                <p className="mt-2 min-h-16 text-sm leading-6 text-slate-600">{eventItem.description}</p>

                                <div className="mt-4 space-y-2 text-sm text-slate-600">
                                    <p className="flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4 text-slate-500" />
                                        {eventItem.date}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-slate-500" />
                                        {eventItem.location}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        void handleRegister(eventItem.id);
                                    }}
                                    disabled={Boolean(registration)}
                                    className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                                >
                                    {registration ? "Already Registered" : "Register Now"}
                                </button>
                            </article>
                        );
                    })}
                </section>

                {filteredEvents.length === 0 ? (
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                        No events found for your current search.
                    </div>
                ) : null}
            </div>
        </StudentLayout>
    );
}
