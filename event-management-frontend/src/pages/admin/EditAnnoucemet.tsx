import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router";
function EditAnnoucemet() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });

  useEffect(() => {
    apiFetch(`http://localhost:8080/announcement/all`)
      .then((res) => res.json())
      .then((data) => {
        const announcement = data.find((a: any) => a.announcementId == id);

        if (announcement) {
          setFormData({
            title: announcement.title,
            message: announcement.message,
          });
        }
      })
      .catch((err) => console.log(String(err)));
  }, [id]);
  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();

    apiFetch(`http://localhost:8080/announcement/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: formData.title,
        message: formData.message,
      }),
    })
      .then((res) => {
        if (res.ok) {
          alert("Updated successfully!");
          navigate("/showannouncement");
        } else {
          alert("Update failed");
        }
      })
      .catch(() => alert("Error updating"));
  };
  return (
    <div>
      <Header />
      <div>
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between p-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Annoucement
              </h1>
              <p className="text-gray-600 mt-1">
                Edit all university announcements
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
          <div>
            <form className="bg-white w-[420px] p-6 rounded-xl shadow-lg mt-4">
              <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
                Edit Annoucemnent
              </h2>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Id <span className="text-red-500">*</span>
                </label>
                <input
                  readOnly
                  type="text"
                  name="id"
                  value={id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                ></textarea>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full mb-2 py-2 text-white transition duration-200 bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => navigate("/showannouncement")}
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

export default EditAnnoucemet;
