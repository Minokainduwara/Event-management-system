import React from "react";
import Header from "../../components/Header";
import Body from "../../components/Body";
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";
import { Link } from "react-router-dom";
function AdminDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [studentCount, setStudentCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const totalEvents = events.length;
  const totalCategories = categories.length;
  const totalStudents = studentCount;
  const totalAnnouncements = announcementCount;

  useEffect(() => {
    apiFetch("http://localhost:8080/events/allEvents")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", String(err));
        setLoading(false);
      });
    apiFetch("http://localhost:8080/category/getCategories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(String(err)));
    apiFetch("http://localhost:8080/users/students/count")
      .then((res) => res.json())
      .then((data) => setStudentCount(data))
      .catch((err) => console.error(String(err)));
    apiFetch("http://localhost:8080/announcement/count")
      .then((res) => res.text())
      .then((data) => setAnnouncementCount(Number(data)))
      .catch((err) => console.error(String(err)));
  }, []);

  return (
    <>
      <Header />
      <Body>
        <div className="bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 text-white">
          <div className="max-w-7xl mx-auto px-6 py-20 text-center">
            <h1 className="text-5xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-xl mb-8 text-blue-100">
              Manage your campus events, categories, and announcements all in
              one
              <br />
              place to enhance your university experience
            </p>
            <Link
              to="/events"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-3 rounded-full font-semibold text-lg transition-colors"
            >
              Explore Events →
            </Link>
          </div>
        </div>
      </Body>

      <Body>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-200 border border-gray-300 rounded-lg shadow-lg p-5 text-center">
              <h2 className="text-gray-600 text-sm font-semibold">
                Total Events
              </h2>
              <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
            </div>
            <div className="bg-gray-200 border border-gray-300 rounded-lg shadow-lg p-5 text-center">
              <h2 className="text-gray-600 text-sm font-semibold">
                Total categories
              </h2>
              <p className="text-2xl font-bold text-gray-900">
                {totalCategories}
              </p>
            </div>
            <div className="bg-gray-200 border border-gray-300 rounded-lg shadow-lg p-5 text-center">
              <h2 className="text-gray-600 text-sm font-semibold">
                Total Students
              </h2>
              <p className="text-2xl font-bold text-gray-900">
                {totalStudents}
              </p>
            </div>
            <div className="bg-gray-200 border border-gray-300 rounded-lg shadow-lg p-5 text-center">
              <h2 className="text-gray-600 text-sm font-semibold">
                Total Annoucements
              </h2>
              <p className="text-2xl font-bold text-gray-900">
                {totalAnnouncements}
              </p>
            </div>
          </div>
        </div>
      </Body>

      <Body>
        <div className="max-w-7xl mx-auto px-6 flex gap-4">
          <Link
            to="/admin/events/add"
            className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 shadow-lg"
          >
            + Add Event
          </Link>
          <Link
            to="/admin/catogory/add"
            className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600 shadow-lg"
          >
            + Add Category
          </Link>
          <Link
            to="/announcement"
            className="bg-purple-500 text-white px-5 py-2 rounded hover:bg-purple-600 shadow-lg"
          >
            + Add Announcement
          </Link>
        </div>
      </Body>

      <Body>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Manage Events</h2>
            <span className="text-gray-900 font-semibold">
              {events.length} records
            </span>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full border border-gray-300 ">
              <thead className="bg-gray-200">
                <tr className="border-none border">
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Max Participants</th>
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
                    <tr key={event.id} className=" hover:bg-gray-100">
                      <td className="px-4 py-3">{event.eventId}</td>
                      <td className="px-4 py-3 font-medium">
                        {event.event_title}
                      </td>
                      <td className="px-4 py-3">{event.eventDate}</td>
                      <td className="px-4 py-3">{event.location}</td>
                      <td className="px-4 py-3">{event.maxParticipants}</td>
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

export default AdminDashboard;
