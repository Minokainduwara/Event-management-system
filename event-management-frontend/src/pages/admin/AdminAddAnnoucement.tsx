import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { client } from "../../api/client";
import type { Announcement } from "../../types";

function AdminAddAnnouncement() {
  const navigate = useNavigate();

  const [form, setForm] = useState<Announcement>({
    title: "",
    message: "",
    createdBy: { userId: 0 },
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "createdBy") {
      setForm({ ...form, createdBy: { userId: Number(value) } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.title || !form.message || !form.createdBy.userId) {
      alert("Fill all fields");
      return;
    }

    try {
      await client.post("/announcement/add", form);
      alert("Announcement added");
      navigate("/admin/showannouncement");
    } catch {
      alert("Failed");
    }
  };

  return (
    <div>
      <Header />

      <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto">
        <input name="createdBy" placeholder="Admin ID" onChange={handleChange} />
        <input name="title" placeholder="Title" onChange={handleChange} />
        <textarea name="message" placeholder="Message" onChange={handleChange} />

        <button className="bg-blue-500 text-white px-4 py-2">
          Add
        </button>
      </form>
    </div>
  );
}

export default AdminAddAnnouncement;