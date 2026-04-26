import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";

function AdminEditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState("");

  const [event, setEvent] = useState({
    eventTitle: "",
    description: "",
    location: "",
    eventDate: "",
    eventTime: "",
    status: "upcoming",
    categoryId: "",
    maxParticipants: "",
    unlimited: false,
  });

  useEffect(() => {
    apiFetch("http://localhost:8080/category/getCategories")
      .then((r) => r.json())
      .then(setCategories);

    apiFetch(`http://localhost:8080/events/getEvent/${id}`)
      .then((r) => r.json())
      .then((data) => {
        const dt = new Date(data.eventDate);
        setEvent({
          eventTitle: data.eventTitle,
          description: data.description,
          location: data.location,
          eventDate: dt.toISOString().split("T")[0],
          eventTime: dt.toTimeString().slice(0, 5),
          status: data.status,
          categoryId: data.category?.categoryId || "",
          maxParticipants: data.maxParticipants || "",
          unlimited: !data.maxParticipants,
        });

        setExistingImage(data.image);
      });
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setEvent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const uploadImage = async () => {
    if (!imageFile) return existingImage;

    const formData = new FormData();
    formData.append("file", imageFile);

    const res = await apiFetch("http://localhost:8080/events/uploadImage", {
      method: "POST",
      body: formData,
    });

    return await res.text();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const image = await uploadImage();

    const payload = {
      ...event,
      image,
      eventDate: `${event.eventDate}T${event.eventTime}:00`,
      maxParticipants: event.unlimited ? null : Number(event.maxParticipants),
      category: { categoryId: Number(event.categoryId) },
    };

    await apiFetch(`http://localhost:8080/events/updateEvent/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    alert("Updated!");
    navigate("/events");
  };

  return (
    <div>
      <Header />

      <form onSubmit={handleSubmit} className="p-6 max-w-3xl mx-auto">
        <input name="eventTitle" value={event.eventTitle} onChange={handleChange} className="border p-2 w-full mb-2" />

        <textarea name="description" value={event.description} onChange={handleChange} className="border p-2 w-full mb-2" />

        <input name="location" value={event.location} onChange={handleChange} className="border p-2 w-full mb-2" />

        <select name="categoryId" value={event.categoryId} onChange={handleChange} className="border p-2 w-full mb-2">
          <option value="">Select</option>
          {categories.map((c) => (
            <option key={c.categoryId} value={c.categoryId}>
              {c.categoryName}
            </option>
          ))}
        </select>

        <input type="date" name="eventDate" value={event.eventDate} onChange={handleChange} className="border p-2 w-full mb-2" />
        <input type="time" name="eventTime" value={event.eventTime} onChange={handleChange} className="border p-2 w-full mb-2" />

        <button className="bg-blue-500 text-white p-2 w-full">Save</button>
      </form>
    </div>
  );
}

export default AdminEditEvent;