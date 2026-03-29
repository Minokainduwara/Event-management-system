import { StudentLayout } from "../components/StudentLayout";
import { getAllEvents, getRegistrations } from "../services/studentData";

export function MyRegistrationsPage() {
    const registrations = getRegistrations();
    const events = getAllEvents();

    return (
        <StudentLayout
            title="My Registrations"
            subtitle="Track your requested and approved event registrations"
        >
            {registrations.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
                    You have not registered for any events yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {registrations.map((registration) => {
                        const eventItem = events.find((eventData) => eventData.id === registration.eventId);
                        if (!eventItem) {
                            return null;
                        }

                        return (
                            <article key={registration.eventId} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <h2 className="text-lg text-slate-900">{eventItem.title}</h2>
                                        <p className="text-sm text-slate-600">
                                            {eventItem.date} at {eventItem.time} - {eventItem.location}
                                        </p>
                                    </div>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs ${
                                            registration.status === "pending"
                                                ? "bg-amber-100 text-amber-700"
                                                : "bg-emerald-100 text-emerald-700"
                                        }`}
                                    >
                                        {registration.status === "pending" ? "Pending Approval" : "Registered"}
                                    </span>
                                </div>
                                <p className="mt-2 text-xs text-slate-500">
                                    Requested on {new Date(registration.requestedAt).toLocaleString()}
                                </p>
                            </article>
                        );
                    })}
                </div>
            )}
        </StudentLayout>
    );
}
