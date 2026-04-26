import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";
import Header from "../../components/Header";
import { Link } from "react-router-dom";

type Announcement = {
  announcementId: number;
  title: string;
  message: string;
  createdAt: string;
  createdBy?: {
    name: string;
  };
};

function ShowAllAnnoucement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const fetchAnnouncements = async () => {
    try {
      const res = await apiFetch("http://localhost:8080/announcement/all");
      const data = await res.json();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(String(err));
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "";

    const d = new Date(dateString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await apiFetch(
        `http://localhost:8080/announcement/delete/${id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setAnnouncements((prev) =>
          prev.filter((a) => a.announcementId !== id)
        );
      }
    } catch (err) {
      console.log(String(err));
    }
  };

  return (
    <div>
      <Header />

      <div className="p-6">
        <h1 className="text-3xl font-bold">Announcement Management</h1>
        <p className="text-gray-600">Manage all announcements</p>
      </div>

      <div className="overflow-x-auto p-6">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Message</th>
              <th>User</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {announcements.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No announcements found
                </td>
              </tr>
            ) : (
              announcements.map((item) => (
                <tr key={item.announcementId} className="hover:bg-gray-50">
                  <td>{item.announcementId}</td>
                  <td>{item.title}</td>
                  <td>{item.message}</td>
                  <td>{item.createdBy?.name ?? "Admin"}</td>
                  <td>{formatDateTime(item.createdAt)}</td>

                  <td className="space-x-2">
                    <Link
                      to={`/editannoucement/${item.announcementId}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(item.announcementId)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
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
  );
}

export default ShowAllAnnoucement;