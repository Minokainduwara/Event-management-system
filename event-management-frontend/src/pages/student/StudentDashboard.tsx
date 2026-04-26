// src/pages/student/StudentDashboard.tsx

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

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const eventsRes = await fetch("http://localhost:8080/student/events");
      const eventsData = await eventsRes.json();

      setEvents(Array.isArray(eventsData) ? eventsData : []);

      if (Array.isArray(eventsData)) {
        eventsData.forEach(async (event: any) => {
          try {
            const countRes = await fetch(
              `http://localhost:8080/student/count/${event.eventId}`
            );
            const count = await countRes.json();

            setEventCounts((prev: any) => ({
              ...prev,
              [event.eventId]: count,
            }));
          } catch (err) {
            console.error(err);
          }
        });
      }

      const statsRes = await fetch("http://localhost:8080/student/dashboard");
      const statsData = await statsRes.json();
      setStats(statsData || {});

      const activityRes = await fetch("http://localhost:8080/student/activity");

      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setActivities(Array.isArray(activityData) ? activityData : []);
      } else {
        setActivities([]);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";

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
            Welcome back student
          </p>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

            <div className="bg-blue-50 p-4 rounded-lg border">
              <div className="text-sm text-blue-600">Available Events</div>
              <div className="text-2xl font-bold">
                {stats.availableEvents || 0}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border">
              <div className="text-sm text-green-600">My Registrations</div>
              <div className="text-2xl font-bold">
                {stats.myRegistrations || 0}
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border">
              <div className="text-sm text-purple-600">Attended</div>
              <div className="text-2xl font-bold">
                {stats.attendedEvents || 0}
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border">
              <div className="text-sm text-orange-600">Upcoming</div>
              <div className="text-2xl font-bold">
                {stats.upcomingEvents || 0}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="bg-white rounded-lg shadow-sm border mb-8">

          <div className="px-6 py-4 border-b flex justify-between items-center">

            <div>
              <h2 className="text-lg font-semibold">
                Upcoming Events
              </h2>
              <p className="text-sm text-gray-600">
                Featured university events
              </p>
            </div>

            <Link
              to="/browse-events"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Browse Events
            </Link>

          </div>

          <div className="overflow-x-auto">

            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : (
              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>
                    <th className="px-6 py-3 text-left text-xs">Event</th>
                    <th className="px-6 py-3 text-left text-xs">Category</th>
                    <th className="px-6 py-3 text-left text-xs">Date</th>
                    <th className="px-6 py-3 text-left text-xs">Location</th>
                    <th className="px-6 py-3 text-left text-xs">Availability</th>
                    <th className="px-6 py-3 text-left text-xs">Action</th>
                  </tr>

                </thead>

                <tbody>

                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-gray-500">
                        No events found
                      </td>
                    </tr>
                  ) : (
                    events.map((event) => {

                      const count = eventCounts[event.eventId] || 0;
                      const max = event.maxParticipants || 0;

                      return (
                        <tr key={event.eventId} className="border-t">

                          <td className="px-6 py-4 font-medium">
                            {event.eventTitle}
                          </td>

                          <td className="px-6 py-4">
                            {event.category?.categoryName}
                          </td>

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(event.eventDate)}
                            </div>

                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {event.eventTime}
                            </div>

                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {event.location}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {count}/{max}
                            </div>
                          </td>

                          <td className="px-6 py-4">

                            {event.isRegistered ? (
                              <span className="text-green-600 font-semibold">
                                Registered
                              </span>
                            ) : (
                              <Link
                                to={`/student/event/${event.eventId}`}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                              >
                                View
                              </Link>
                            )}

                          </td>

                        </tr>
                      );
                    })
                  )}

                </tbody>

              </table>
            )}

          </div>

        </div>

        {/* ACTIVITY */}
        <div className="bg-white rounded-lg shadow-sm border">

          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>

          <div className="p-4">

            {activities.length === 0 ? (
              <p className="text-center text-gray-500">
                No activity found
              </p>
            ) : (
              activities.map((item: any) => (
                <div
                  key={item.registration_id}
                  className="border-b py-3 flex justify-between"
                >
                  <div>
                    <p className="font-semibold">
                      {item.eventName}
                    </p>
                    <p className="text-sm text-gray-500">
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