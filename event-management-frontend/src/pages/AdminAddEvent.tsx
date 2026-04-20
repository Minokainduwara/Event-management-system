import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Body from "../components/Body";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router";
function AdminAddEvent() {
  const [banner, setBanner] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const [category, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [noLimit, setNoLimit] = useState(false);
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBanner(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  useEffect(() => {
    fetch("http://localhost:8080/category/getCategories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  const [eventData, setEventData] = React.useState({
    event_title: "",
    description: "",
    eventDate: "",
    eventTime: "",
    location: "",
    status: "Upcoming",
    maxParticipants: "",
    category: { categoryId: "" },
  });
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "category") {
      setEventData({ ...eventData, category: { categoryId: value } });
    } else if (name === "maxParticipants") {
      setEventData({ ...eventData, maxParticipants: value });
    } else {
      setEventData({ ...eventData, [name]: value });
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const max = Number(eventData.maxParticipants);
    if (!noLimit && max < 1) {
      alert("Maximum participants must be at least 1 or select no limit");
      return;
    }

    if (
      !eventData.event_title ||
      !eventData.description ||
      !eventData.eventDate ||
      !eventData.eventTime ||
      !eventData.location ||
      !eventData.category.categoryId
    ) {
      alert("Please fill all required fields");
      return;
    }
    const selectedDateTime = new Date(
      `${eventData.eventDate}T${eventData.eventTime}`,
    );
    const now = new Date();

    if (selectedDateTime < now) {
      alert("Event date and time cannot be in the past");
      return;
    }

    let fileName = "";
    if (imageFile) {
      try {
        fileName = await uploadImage();
      } catch (err) {
        console.error("Error uploading image:", err);
        return;
      }
    }
    const eventToSend = {
      event_title: eventData.event_title,
      description: eventData.description,
      eventDate: `${eventData.eventDate}T${eventData.eventTime}:00`,
      location: eventData.location,
      status: eventData.status,
      maxParticipants: noLimit
        ? null
        : eventData.maxParticipants
          ? Number(eventData.maxParticipants)
          : null,

      category: {
        categoryId: Number(eventData.category.categoryId || 0),
      },

      image: fileName,
    };
    console.log("Event to send:", eventToSend);
    const res = await fetch("http://localhost:8080/events/saveEvent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(eventToSend),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Save failed:", errorText);
      return;
    }

    navigate("/events");
  };

  const uploadImage = async () => {
    const formData = new FormData();
    if (!imageFile) return "";
    formData.append("file", imageFile);

    const res = await fetch("http://localhost:8080/events/uploadImage", {
      method: "POST",
      body: formData,
    });

    const fileName = await res.text();
    return fileName;
  };

  return (
    <div>
      <Header />
      <Body>
        <div className="h-[140px] flex flex-col pt-8 pl-10 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
          <p className="text-gray-500">
            Fill in the details to create a new university event
          </p>
        </div>
        <div className="flex items-center justify-center min-h-screen bg-gray-100 pt-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Create New Event
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Event Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="event_title"
                value={eventData.event_title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter event name"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                placeholder="Enter event description"
                rows={5}
                name="description"
                value={eventData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Event Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                name="eventDate"
                value={eventData.eventDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Event Time<span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="eventTime"
                required
                value={eventData.eventTime}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Event Location<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                required
                value={eventData.location}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter location"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Event Status<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="status"
                readOnly
                value={eventData.status}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter status"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Maximum Participants
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={1}
                  name="maxParticipants"
                  value={eventData.maxParticipants}
                  onChange={handleChange}
                  disabled={noLimit}
                  placeholder="Enter maximum number of participants (optional)"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mb-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={noLimit}
                  onChange={(e) => setNoLimit(e.target.checked)}
                />
                No participant limit
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Event Category<span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                required
                value={eventData.category.categoryId}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {category.map((cat: any) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Banner <span className="text-red-500">*</span>
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="block w-full text-gray-700 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {banner && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Preview:</p>
                  <img
                    src={banner}
                    alt="Event Banner Preview"
                    className="w-full max-h-64 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 transition-colors"
            >
              Create Event
            </button>
            <button
              type="button"
              onClick={() => navigate("/events")}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md w-full hover:bg-red-700 transition-colors"
            >
              Cancel
            </button>
          </form>
        </div>
      </Body>
    </div>
  );
}

export default AdminAddEvent;
