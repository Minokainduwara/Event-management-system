import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";

function EditAnnoucement() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });

  useEffect(() => {
    apiFetch("http://localhost:8080/announcement/all")
      .then((res) => res.json())
      .then((data) => {
        const ann = data.find((a: any) => a.announcementId == id);
        if (ann) {
          setFormData({
            title: ann.title,
            message: ann.message,
          });
        }
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await apiFetch(`http://localhost:8080/announcement/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Updated successfully!");
      navigate("/showannouncement");
    } else {
      alert("Update failed");
    }
  };

  return (
    <div>
      <Header />

      <form onSubmit={handleSubmit} className="p-6 bg-white shadow max-w-md mx-auto mt-10">
        <input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="border w-full p-2 mb-3"
          placeholder="Title"
        />

        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="border w-full p-2 mb-3"
          placeholder="Message"
        />

        <button className="bg-blue-600 text-white px-4 py-2 w-full">
          Update
        </button>

        <button
          type="button"
          onClick={() => navigate("/showannouncement")}
          className="bg-red-500 text-white px-4 py-2 w-full mt-2"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditAnnoucement;