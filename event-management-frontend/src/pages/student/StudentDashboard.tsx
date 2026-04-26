import {
  Calendar,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import StudentHeader from "../../components/StudentHeader";

// ---------------- SAFE HELPER ----------------
const toArray = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.events)) return data.events;
  if (Array.isArray(data?.activities)) return data.activities;
  return [];
};

function StudentDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [eventCounts, setEventCounts] = useState<any>({});
  const [stats, setStats] = useState<any>({});
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ---------------- FETCH EVENTS + STATS ----------------
  useEffect(() => {
    fetch("http://localhost:8080/student/events", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const safeEvents = toArray(data);
        setEvents(safeEvents);

        safeEvents.forEach((event: any) => {
          fetch(`http://localhost:8080/student/count/${event.eventId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => res.json())
            .then((count) => {
              setEventCounts((prev: any) => ({
                ...prev,
                [event.eventId]: count ?? 0,
              }));
            });
        });
      })
      .catch((err) => {
        console.error("events error:", err);
        setEvents([]);
      });

    fetch("http://localhost:8080/student/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data ?? {}))
      .catch((err) => console.error("stats error:", err))
      .finally(() => setLoading(false));
  }, []);

  // ---------------- FETCH ACTIVITY (FIXED CRASH HERE) ----------------
  useEffect(() => {
    fetch("http://localhost:8080/student/activity", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const safe = toArray(data);
        setActivities(safe);
      })
      .catch((err) => {
        console.log("activity error:", err);
        setActivities([]);
      });
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />

      {/* HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Student Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Discover and join university events
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600">Available Events</div>
              <div className="text-2xl font-bold">
                {stats.availableEvents ?? 0}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600">My Registrations</div>
              <div className="text-2xl font-bold">
                {stats.myRegistrations ?? 0}
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600">Attended</div>
              <div className="text-2xl font-bold">
                {stats.attendedEvents ?? 0}
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-orange-600">Upcoming</div>
              <div className="text-2xl font-bold">
                {stats.upcomingEvents ?? 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EVENTS TABLE */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="px-6 py-4 border-b flex justify-between">
            <h2 className="font-semibold">Upcoming Events</h2>

            <Link
              to="/studentbrowseevent"
              className="text-blue-600 font-medium"
            >
              Browse All
            </Link>
          </div>

          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : (
            <table className="w-full">
              <tbody>
                {events.map((event) => (
                  <tr key={event.eventId} className="border-b">
                    <td className="p-4 font-medium">
                      {event.name || event.eventTitle || "Untitled"}
                    </td>

                    <td>{event.category?.categoryName || "-"}</td>

                    <td>
                      <Calendar className="inline w-4 h-4 mr-1" />
                      {formatDate(event.date)}
                    </td>

                    <td>
                      <MapPin className="inline w-4 h-4 mr-1" />
                      {event.location}
                    </td>

                    <td>
                      <Users className="inline w-4 h-4 mr-1" />
                      {eventCounts[event.eventId] ?? 0} /
                      {event.maxParticipants ?? "∞"}
                    </td>

                    <td>
                      {event.isRegistered ? (
                        <span className="text-green-600">Registered</span>
                      ) : (
                        <Link
                          to={`/student/events/${event.eventId}`}
                          className="text-blue-600"
                        >
                          Register
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ACTIVITY */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Recent Activity</h2>

          {Array.isArray(activities) && activities.length > 0 ? (
            activities.map((item: any) => (
              <div
                key={item.registration_id || Math.random()}
                className="border-b py-2 flex justify-between"
              >
                <div>
                  <p className="font-medium">{item.eventName}</p>
                  <p className="text-xs text-gray-500">
                    Status: {item.status}
                  </p>
                </div>

                <div className="text-xs text-gray-400">
                  {formatDate(item.registration_date)}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No activity found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;