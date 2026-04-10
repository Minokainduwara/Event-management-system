import { useMemo, useState } from "react";
import { StudentLayout } from "../components/StudentLayout";
import {
    getEventsByCategory,
    getRegistrationForEvent,
    getStudentProfile,
    registerForEvent,
} from "../services/studentData";
import type { EventCategory, EventItem } from "../types/student";

export function EventsPage() {
    const [activeCategory, setActiveCategory] = useState<EventCategory>("open");
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
    const [toastMessage, setToastMessage] = useState<string>("");

    const events = useMemo(() => getEventsByCategory(activeCategory), [activeCategory]);

    const handleRegister = (eventId: number) => {
        const profile = getStudentProfile();
        const result = registerForEvent(eventId, profile);
        setToastMessage(result.message);
    };

    return (
        <StudentLayout
            title="Student Events"
            subtitle="Browse open and registration-required events"
        >
            {toastMessage ? (
                <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
                    {toastMessage}
                </div>
            ) : null}

            <div className="mb-4 flex gap-2">
                <button
                    type="button"
                    onClick={() => setActiveCategory("open")}
                    className={`rounded-lg px-4 py-2 text-sm ${
                        activeCategory === "open"
                            ? "bg-slate-900 text-white"
                            : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    }`}
                >
                    Open Events
                </button>
                <button
                    type="button"
                    onClick={() => setActiveCategory("restricted")}
                    className={`rounded-lg px-4 py-2 text-sm ${
                        activeCategory === "restricted"
                            ? "bg-slate-900 text-white"
                            : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    }`}
                >
                    Registration Required
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {events.map((eventItem) => {
                    const registration = getRegistrationForEvent(eventItem.id);

                    return (
                        <article key={eventItem.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">{eventItem.date} at {eventItem.time}</p>
                            <h2 className="mt-2 text-xl text-slate-900">{eventItem.title}</h2>
                            <p className="mt-1 text-sm text-slate-600">{eventItem.location} - {eventItem.organizer}</p>
                            <p className="mt-3 text-sm text-slate-700">{eventItem.description}</p>

                            <div className="mt-4 flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedEvent(eventItem)}
                                    className="rounded-lg bg-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-300"
                                >
                                    View Details
                                </button>

                                {eventItem.category === "restricted" ? (
                                    <button
                                        type="button"
                                        onClick={() => handleRegister(eventItem.id)}
                                        disabled={Boolean(registration)}
                                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
                                    >
                                        {registration ? "Already Requested" : "Register"}
                                    </button>
                                ) : (
                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">
                                        Open Event
                                    </span>
                                )}
                            </div>
                        </article>
                    );
                })}
            </div>

            {selectedEvent ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="text-2xl text-slate-900">{selectedEvent.title}</h3>
                        <p className="mt-2 text-sm text-slate-600">
                            {selectedEvent.date} at {selectedEvent.time} - {selectedEvent.location}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">Organizer: {selectedEvent.organizer}</p>
                        <p className="mt-4 text-slate-700">{selectedEvent.description}</p>
                        <p className="mt-2 text-sm text-slate-500">Seats available: {selectedEvent.seatsAvailable}</p>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedEvent(null)}
                                className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </StudentLayout>
    );
}
