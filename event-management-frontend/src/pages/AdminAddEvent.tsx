import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Body from "../components/Body";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router";
function AdminAddEvent() {
  const [banner, setBanner] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const [category, setCategories] = useState([]);
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBanner(URL.createObjectURL(file));
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
    category: { id: "" },
  });
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "category") {
      setEventData({ ...eventData, category: { id: value } });
    } else if (name === "maxParticipants") {
      setEventData({ ...eventData, maxParticipants: value });
    } else {
      setEventData({ ...eventData, [name]: value });
    }
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();

    const eventToSend = {
      ...eventData,
      category: {
        categoryId: Number(eventData.category.id),
      },
    };

    fetch("http://localhost:8080/events/saveEvent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventToSend),
    })
      .then(() => navigate("/events"))
      .catch((err) => console.error(err));
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
                  name="maxParticipants"
                  value={eventData.maxParticipants}
                  onChange={handleChange}
                  placeholder="Enter maximum number of participants (optional)"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Event Category<span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={eventData.category.id}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {category.map((cat: any) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.category_name}
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
