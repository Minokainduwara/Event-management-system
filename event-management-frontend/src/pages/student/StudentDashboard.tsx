import {
  Calendar,
  ListChecks,
  CheckCircle,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import StudentHeader from "../../components/StudentHeader";

function StudentDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [eventCounts, setEventCounts] = useState<any>({});
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/student/events", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);

        data.forEach((event: any) => {
          fetch(`http://localhost:8080/student/count/${event.eventId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
            .then((res) => res.json())
            .then((count) => {
              setEventCounts((prev: any) => ({
                ...prev,
                [event.eventId]: count,
              }));
            });
        });
      })
      .catch((err) => console.error(err));

    fetch("http://localhost:8080/student/dashboard", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/student/activity", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setActivities(data);
      })
      .catch((err) => console.log(err));
  }, []);




  const formatDate = (dateString: string) => {
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

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Student Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back, Student! Discover and join university events
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-sm text-blue-600">Available Events</div>
              <div className="text-2xl font-bold text-blue-900 mt-1">
                {stats.availableEvents}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-sm text-green-600">My Registrations</div>
              <div className="text-2xl font-bold text-green-900 mt-1">
                {stats.myRegistrations}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="text-sm text-purple-600">Attended Events</div>
              <div className="text-2xl font-bold text-purple-900 mt-1">
                {stats.attendedEvents}
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="text-sm text-orange-600">Upcoming Events</div>
              <div className="text-2xl font-bold text-orange-900 mt-1">
                {stats.upcomingEvents}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Upcoming Events
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Featured events happening soon
              </p>
            </div>
            <Link
              to="/studentbrowseevent"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Browse All Events
            </Link>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading...</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Event Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase ">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Availability
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr
                      key={event.eventId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {event.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {event.category?.categoryName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(event.date)}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {event.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          {eventCounts[event.eventId] ?? 0}/
                          {event.maxParticipants === null
                            ? "Unlimited"
                            : event.maxParticipants}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {event.isRegistered ? (
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Registered
                          </span>
                        ) : (
                          <Link
                            to={`/student/events/${event.eventId}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
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


        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Your latest event interactions
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow">


            {activities.length === 0 ? (
              <p className="text-gray-500 text-center">No activity found</p>
            ) : (
              activities.map((item: any) => (
                <div
                  key={item.registration_id}
                  className="border-b py-2 flex justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {item.eventName}
                    </p>

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
