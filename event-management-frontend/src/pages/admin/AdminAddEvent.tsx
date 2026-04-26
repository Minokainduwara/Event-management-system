import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { client } from "../../api/client";
import type { Category } from "../../types";

function AdminAddEvent() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  const [event, setEvent] = useState({
    eventTitle: "",
    description: "",
    eventDate: "",
    location: "",
    status: "UPCOMING", // ✅ FIXED ENUM
    maxParticipants: "",
    categoryId: "",
  });

  // LOAD CATEGORIES
  useEffect(() => {
    client.get("/category/getCategories").then((res: any) => {
      setCategories(res.data ?? res);
    });
  }, []);

  // INPUT HANDLER
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setEvent({
      ...event,
      [e.target.name]: e.target.value,
    });
  };

  // SAFE DATETIME BUILDER
  const formatDateTime = (value: string) => {
    if (!value) return null;

    // datetime-local: YYYY-MM-DDTHH:mm
    const date = new Date(value);

    if (isNaN(date.getTime())) return null;

    return date.toISOString().slice(0, 19); // YYYY-MM-DDTHH:mm:ss
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventDateTime = formatDateTime(event.eventDate);

    if (!eventDateTime) {
      alert("Invalid event date/time");
      return;
    }

    if (!event.categoryId) {
      alert("Please select a category");
      return;
    }

    const payload = {
      eventTitle: event.eventTitle,
      description: event.description,
      eventDate: eventDateTime, // ✅ SAFE FORMAT
      location: event.location,
      status: event.status, // UPCOMING
      maxParticipants: event.maxParticipants
        ? Number(event.maxParticipants)
        : null,
      category: {
        categoryId: Number(event.categoryId),
      },
    };

    try {
      await client.post("/events/saveEvent", payload);

      alert("Event created successfully");
      navigate("/admin/events");
    } catch (error: any) {
      console.error("Event creation failed:", error?.response?.data || error);
      alert("Failed to create event");
    }
  };

  return (
    <div>
      <Header />

      <form
        onSubmit={handleSubmit}
        className="p-6 max-w-xl mx-auto flex flex-col gap-3"
      >
        <input
          name="eventTitle"
          placeholder="Title"
          onChange={handleChange}
          className="border p-2"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="border p-2"
          required
        />

        <input
          type="datetime-local"
          name="eventDate"
          onChange={handleChange}
          className="border p-2"
          required
        />

        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          className="border p-2"
          required
        />

        <select
          name="categoryId"
          onChange={handleChange}
          className="border p-2"
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.categoryId} value={c.categoryId}>
              {c.categoryName}
            </option>
          ))}
        </select>

        <input
          name="maxParticipants"
          placeholder="Max Participants"
          onChange={handleChange}
          className="border p-2"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}

export default AdminAddEvent;