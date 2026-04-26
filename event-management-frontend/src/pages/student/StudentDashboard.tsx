
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
      /* ================= EVENTS ================= */

      const eventsRes = await fetch(
        "http://localhost:8080/student/events"
      );

      const eventsData = await eventsRes.json();

      setEvents(Array.isArray(eventsData) ? eventsData : []);

      /* ================= COUNTS ================= */

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

      /* ================= DASHBOARD STATS ================= */

      try {
        const statsRes = await fetch(
          "http://localhost:8080/student/dashboard"
        );

        const statsData = await statsRes.json();

        setStats(statsData || {});
      } catch (err) {
        console.error(err);
      }

      /* ================= ACTIVITIES ================= */

      try {
        const activityRes = await fetch(
          "http://localhost:8080/student/activity"
        );

        if (activityRes.ok) {
          const activityData =
            await activityRes.json();

          setActivities(
            Array.isArray(activityData)
              ? activityData
              : []
          );
        } else {
          setActivities([]);
        }
      } catch (err) {
        console.error(err);

        setActivities([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (
    dateString: string
  ) => {
    const date = new Date(dateString);

    return date.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <StudentHeader />

      {/* ================= HEADER ================= */}

      <div className="bg-white border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-6 py-8">

          <h1 className="text-3xl font-bold text-gray-900">
            Student Dashboard
          </h1>

          <p className="text-gray-600 mt-1">
            Welcome back student
          </p>

          {/* ================= STATS ================= */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-sm text-blue-600">
                Available Events
              </div>

              <div className="text-2xl font-bold text-blue-900 mt-1">
                {stats.availableEvents || 0}
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-sm text-green-600">
                My Registrations
              </div>

              <div className="text-2xl font-bold text-green-900 mt-1">
                {stats.myRegistrations || 0}
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="text-sm text-purple-600">
                Attended Events
              </div>

              <div className="text-2xl font-bold text-purple-900 mt-1">
                {stats.attendedEvents || 0}
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="text-sm text-orange-600">
                Upcoming Events
              </div>

              <div className="text-2xl font-bold text-orange-900 mt-1">
                {stats.upcomingEvents || 0}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= BODY ================= */}

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ================= EVENTS ================= */}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">

          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Upcoming Events
              </h2>

              <p className="text-sm text-gray-600 mt-1">
                Featured university events
              </p>
            </div>

            <Link
              to="/browse-events"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Browse Events
            </Link>

          </div>

          <div className="overflow-x-auto">

            {loading ? (
              <div className="p-6 text-center">
                Loading...
              </div>
            ) : (
              <table className="w-full">

                <thead className="bg-gray-50 border-b border-gray-200">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold">
                      Event
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold">
                      Location
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold">
                      Availability
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-200">

                  {events.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        No events found
                      </td>
                    </tr>
                  ) : (
                    events.map((event) => (

                      <tr key={event.eventId}>

                        <td className="px-6 py-4">
                          {event.name}
                        </td>

                        <td className="px-6 py-4">
                          {event.category}
                        </td>

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-1">

                            <Calendar className="w-4 h-4" />

                            {formatDate(event.date)}

                          </div>

                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">

                            <Clock className="w-3 h-3" />

                            {event.time}

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

                            {eventCounts[event.eventId] || 0}
                            /

                            {event.maxParticipants ||
                              "Unlimited"}

                          </div>

                        </td>

                        <td className="px-6 py-4">

                          {event.isRegistered ? (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                              Registered
                            </span>
                          ) : (
                            <Link
                              to={`/student/event/${event.eventId}`}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                            >
                              Register
                            </Link>
                          )}

                        </td>

                      </tr>

                    ))
                  )}

                </tbody>

              </table>
            )}

          </div>

        </div>

        {/* ================= ACTIVITY ================= */}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">

          <div className="px-6 py-4 border-b border-gray-200">

            <h2 className="text-lg font-semibold">
              Recent Activity
            </h2>

          </div>

          <div className="p-4">

            {activities.length === 0 ? (

              <p className="text-gray-500 text-center">
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

                    {new Date(
                      item.registration_date
                    ).toLocaleString()}

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

