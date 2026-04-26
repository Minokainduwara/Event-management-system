import React from "react";
import { apiFetch } from "../../utils/apiFetch";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function AdminAddAnnoucement() {


  const [formData, setFormData] = useState({
    title: "",
    message: "",
    createdBy: "",
  });
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!formData.createdBy) {
      alert("Admin Id is must required");
      return;
    }

    try {
      const response = await apiFetch(`http://localhost:8080/announcement/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          message: formData.message,
          createdBy: {
            userId: Number(formData.createdBy)
          }
        }),
      });

      if (response.ok) {
        alert("Announcement added successfully!");
        navigate("/showannouncement");
      } else {
        alert("Failed to add announcement");
      }
    } catch (error) {
      console.error(String(error));
      alert("Error connecting to server");
    }
  };
  const navigate = useNavigate();
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
            <Link
              to="/showannouncement"
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Show All Annoucement
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
          <div>
            <form
              onSubmit={handleSubmit}
              className="bg-white w-[420px] p-6 rounded-xl shadow-lg mt-4"
            >
              <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
                Add Annoucemnent
              </h2>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Admin ID *
                </label>
                <input
                  type="number"
                  name="createdBy"
                  value={formData.createdBy}
                  onChange={handleChange}
                  placeholder="Enter admin ID"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter message"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full mb-2 py-2 text-white transition duration-200 bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full py-2 text-white transition duration-200 bg-red-500 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAddAnnoucement;
