import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Body from "../components/Body";
import { Input } from "postcss";
import { useParams, useNavigate } from "react-router-dom";
function AdminEditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    event_title: "",
    description: "",
    location: "",
    eventDate: "",
    eventTime: "",
    status: "upcoming",
    category: { id: "" },
    maxParticipants: 0,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/category/getCategories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);
  useEffect(() => {
    fetch(`http://localhost:8080/events/getEvent/${id}`)
      .then((res) => res.json())
      .then((data) =>
        setEvent({
          ...data,
          category: { id: String(data.category?.categoryId) },
        }),
      );
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "category") {
      setEvent({ ...event, category: { id: String(value) } });
    } else {
      setEvent({ ...event, [name]: value });
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const eventToSend = {
      ...event,
      category: {
        categoryId: Number(event.category.id),
      },
    };
    fetch(`http://localhost:8080/events/updateEvent/${id}`, {
      method: "PUT",
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
          <p className="text-gray-500">Fill in the details to edit the event</p>
        </div>
        <div>
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 py-8">
              <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Event Title <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="event_title"
                        required
                        placeholder="event title"
                        value={event.event_title}
                        onChange={(e) => handleChange(e)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      name="description"
                      placeholder="Event description"
                      value={event.description}
                      onChange={(e) => handleChange(e)}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="category"
                          required
                          value={event.category.id}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        >
                          <option value="">Select a category</option>
                          {categories.map((category: any) => (
                            <option
                              key={category.categoryId}
                              value={String(category.categoryId)}
                            >
                              {category.categoryName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Event Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        name="status"
                        value={event.status}
                        onChange={(e) => handleChange(e)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Event Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="eventDate"
                          required
                          value={event.eventDate}
                          onChange={(e) => handleChange(e)}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Event Time <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          name="eventTime"
                          required
                          value={event.eventTime}
                          onChange={(e) => handleChange(e)}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="location"
                        required
                        value={event.location}
                        onChange={(e) => handleChange(e)}
                        placeholder="Event location"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Maximum Participants
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="maxParticipants"
                        min="0"
                        value={event.maxParticipants}
                        onChange={(e) => handleChange(e)}
                        placeholder="Enter maximum number of participants (optional)"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => navigate("/events")}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Body>
    </div>
  );
}

export default AdminEditEvent;
