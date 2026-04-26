import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Body from "../../components/Body";
import { apiFetch } from "../../utils/apiFetch";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [studentCount, setStudentCount] = useState<number>(0);
  const [announcementCount, setAnnouncementCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [eventsRes, catRes, studentRes, announcementRes] =
        await Promise.all([
          apiFetch("http://localhost:8080/events/allEvents"),
          apiFetch("http://localhost:8080/category/getCategories"),
          apiFetch("http://localhost:8080/users/students/count"),
          apiFetch("http://localhost:8080/announcement/count"),
        ]);

      const eventsData = await eventsRes.json();
      const categoriesData = await catRes.json();
      const studentData = await studentRes.json();
      const announcementData = await announcementRes.text();

      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setStudentCount(Number(studentData) || 0);
      setAnnouncementCount(Number(announcementData) || 0);
    } catch (err) {
      console.error("Dashboard load error:", String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      {/* HERO */}
      <Body>
        <div className="bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 text-white">
          <div className="max-w-7xl mx-auto px-6 py-20 text-center">
            <h1 className="text-5xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-xl text-blue-100 mb-8">
              Manage events, categories, registrations and announcements in one place
            </p>

            <Link
              to="/events"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-3 rounded-full font-semibold"
            >
              Explore Events →
            </Link>
          </div>
        </div>
      </Body>

      {/* STATS */}
      <Body>
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Stat title="Total Events" value={events.length} />
          <Stat title="Total Categories" value={categories.length} />
          <Stat title="Total Students" value={studentCount} />
          <Stat title="Total Announcements" value={announcementCount} />
        </div>
      </Body>

      {/* ACTIONS */}
      <Body>
        <div className="max-w-7xl mx-auto px-6 flex gap-4">
          <ActionLink to="/admin/events/add" color="blue">
            + Add Event
          </ActionLink>
          <ActionLink to="/admin/category/add" color="green">
            + Add Category
          </ActionLink>
          <ActionLink to="/admin/announcement" color="purple">
            + Add Announcement
          </ActionLink>
        </div>
      </Body>

      {/* TABLE */}
      <Body>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold">Manage Events</h2>
            <span>{events.length} records</span>
          </div>

          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Max</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No events found
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.eventId} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{event.eventId}</td>
                      <td className="px-4 py-3 font-medium">{event.event_title}</td>
                      <td className="px-4 py-3">{event.eventDate}</td>
                      <td className="px-4 py-3">{event.location}</td>
                      <td className="px-4 py-3">{event.maxParticipants ?? "-"}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs bg-yellow-400 rounded">
                          {event.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <Link
                          to={`/admin/events/edit/${event.eventId}`}
                          className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                        >
                          Edit
                        </Link>
                        <button className="bg-red-500 text-white px-3 py-1 rounded">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Body>
    </>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-gray-200 border rounded-lg p-5 text-center shadow">
      <h2 className="text-sm text-gray-600">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function ActionLink({
  children,
  to,
  color,
}: {
  children: React.ReactNode;
  to: string;
  color: "blue" | "green" | "purple";
}) {
  const colors = {
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    purple: "bg-purple-500 hover:bg-purple-600",
  };

  return (
    <Link
      to={to}
      className={`${colors[color]} text-white px-5 py-2 rounded shadow`}
    >
      {children}
    </Link>
  );
}

export default AdminDashboard;