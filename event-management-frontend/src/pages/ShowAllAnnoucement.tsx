import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Link } from "react-router";
function ShowAllAnnoucement() {
  const [announcements, setAnnouncement] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/announcement/all")
      .then((response) => response.json())
      .then((data) => setAnnouncement(data))
      .catch((error) => console.error(error));
  }, []);

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "";

    const d = new Date(dateString);

    return (
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0") +
      " " +
      String(d.getHours()).padStart(2, "0") +
      ":" +
      String(d.getMinutes()).padStart(2, "0")
    );
  };
  const handleDelete = (id: number) => {
    fetch(`http://localhost:8080/announcement/delete/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          alert("Deleted successfully");

          setAnnouncement((prev: any) =>
            prev.filter((item: any) => item.announcementId !== id),
          );
        } else {
          alert("Delete failed");
        }
      })
      .catch(() => alert("Error deleting"));
  };
  return (
    <div>
      <Header />
      <div>
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between p-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Annoucement Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage all university announcements
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg  overflow-x-auto max-h-[400px]">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Annoucement Id</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Message</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Date</th>

              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {announcements.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No announcements found
                </td>
              </tr>
            ) : (
              announcements.map((item: any) => (
                <tr key={item.announcementId} className=" hover:bg-gray-50">
                  <td className="px-4 py-3">{item.announcementId}</td>
                  <td className="px-4 py-3">{item.title}</td>

                  <td className="px-4 py-3">{item.message}</td>
                  <td className="px-4 py-3">{item.createdBy?.name}</td>
                  <td className="px-4 py-3 ">
                    {formatDateTime(item.createdAt)}
                  </td>

                  <td className="px-4 py-3 text-center space-x-2">
                    <Link
                      to={`/editannoucement/${item.announcementId}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 "
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(item.announcementId)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mt-2"
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
