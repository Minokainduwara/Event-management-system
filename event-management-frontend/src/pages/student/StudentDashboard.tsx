import {
  Calendar,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import StudentHeader from "../../components/StudentHeader";

function StudentDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [eventCounts, setEventCounts] = useState<any>({});
  const [stats, setStats] = useState<any>({});
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ---------------- FORMAT DATE ----------------
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ---------------- FETCH EVENTS + STATS ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // EVENTS
        const eventRes = await fetch("http://localhost:8080/student/events", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const eventData = await eventRes.json();
        const safeEvents = Array.isArray(eventData) ? eventData : [];

        setEvents(safeEvents);

        // EVENT COUNTS
        safeEvents.forEach(async (event: any) => {
          try {
            const res = await fetch(
              `http://localhost:8080/student/count/${event.eventId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const count = await res.json();

            setEventCounts((prev: any) => ({
              ...prev,
              [event.eventId]: count ?? 0,
            }));
          } catch (err) {
            console.log("Count error:", err);
          }
        });

        // DASHBOARD STATS
        const statsRes = await fetch(
          "http://localhost:8080/student/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const statsData = await statsRes.json();
        setStats(statsData ?? {});
      } catch (err) {
        console.log("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ---------------- FETCH ACTIVITY ----------------
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/student/activity",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        // 🔥 FIX: ensure array ALWAYS
        const safeData = Array.isArray(data)
          ? data
          : Array.isArray(data?.activities)
          ? data.activities
          : [];

        setActivities(safeData);
      } catch (err) {
        console.log("Activity error:", err);
        setActivities([]);
      }
    };

    fetchActivity();
  }, []);

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

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg border">
              <div className="text-sm text-blue-600">Available Events</div>
              <div className="text-2xl font-bold">
                {stats.availableEvents ?? 0}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border">
              <div className="text-sm text-green-600">My Registrations</div>
              <div className="text-2xl font-bold">
                {stats.myRegistrations ?? 0}
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border">
              <div className="text-sm text-purple-600">Attended</div>
              <div className="text-2xl font-bold">
                {stats.attendedEvents ?? 0}
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border">
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
        <div className="bg-white rounded-lg border shadow-sm mb-8">
          <div className="p-6 border-b flex justify-between">
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
            <Link
              to="/studentbrowseevent"
              className="text-blue-600 font-medium"
            >
              Browse All
            </Link>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left">Name</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Availability</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {events.map((event) => (
                    <tr key={event.eventId} className="border-t">
                      <td className="p-4">{event.name}</td>

                      <td>
                        <span className="bg-blue-100 px-2 py-1 rounded">
                          {event.category}
                        </span>
                      </td>

                      <td>
                        <Calendar className="inline w-4 h-4 mr-1" />
                        {formatDate(event.date)}
                        <div className="text-xs text-gray-500">
                          <Clock className="inline w-3 h-3 mr-1" />
                          {event.time}
                        </div>
                      </td>

                      <td>
                        <MapPin className="inline w-4 h-4 mr-1" />
                        {event.location}
                      </td>

                      <td>
                        <Users className="inline w-4 h-4 mr-1" />
                        {eventCounts[event.eventId] ?? 0}/
                        {event.maxParticipants ?? "Unlimited"}
                      </td>

                      <td>
                        {event.isRegistered ? (
                          <span className="text-green-600 font-medium">
                            Registered
                          </span>
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
        </div>

        {/* ACTIVITY */}
        <div className="bg-white border rounded-lg">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Recent Activity</h2>
          </div>

          <div className="p-4">
            {activities.length === 0 ? (
              <p className="text-gray-500 text-center">
                No activity found
              </p>
            ) : (
              activities.map((item: any, index: number) => (
                <div
                  key={item.registration_id ?? index}
                  className="border-b py-2 flex justify-between"
                >
                  <div>
                    <p className="font-medium">{item.eventName}</p>
                    <p className="text-xs text-gray-500">
                      Status: {item.status}
                    </p>
                  </div>

                  <div className="text-xs text-gray-400">
                    {new Date(item.registration_date).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;