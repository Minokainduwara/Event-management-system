import React, { useState, useEffect } from "react";
import { apiFetch } from "../../utils/apiFetch";
import Header from "../../components/Header";
import Body from "../../components/Body";
import { Input } from "postcss";
import { useParams, useNavigate, data } from "react-router-dom";
function AdminEditEvent() {
  const [banner, setBanner] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    eventTitle: "",
    description: "",
    location: "",
    eventDate: "",
    eventTime: "",
    status: "upcoming",
    category: { id: "" },
    maxParticipants: "",
    unlimited: false,
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    return dateString.split("T")[1]?.substring(0, 5);
  };
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    apiFetch("http://localhost:8080/category/getCategories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(String(err)));
  }, []);
  useEffect(() => {
    apiFetch(`http://localhost:8080/events/getEvent/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent({
          eventTitle: data.eventTitle || "",
          description: data.description || "",
          location: data.location || "",
          eventDate: formatDate(data.eventDate),
          eventTime: formatTime(data.eventDate),
          status: data.status || "upcoming",
          category: { id: String(data.category?.categoryId || "") },
          maxParticipants: data.maxParticipants || "",
          unlimited: data.maxParticipants === null,
        });

        setExistingImage(data.image);
        setBanner(`http://localhost:8080/uploads/${data.image}`);
      })
      .catch((err) => console.error(String(err)));
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setBanner(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "category") {
      setEvent({ ...event, category: { id: String(value) } });
    } else {
      setEvent({ ...event, [name]: value });
    }
  };
  const uploadImage = async () => {
    if (!imageFile) return existingImage;

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const uploadRes = await apiFetch("http://localhost:8080/events/uploadImage", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Upload failed");
      }

      return await uploadRes.text();
    } catch (err) {
      console.error("Image upload error:", String(err));
      return existingImage;
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!event.eventTitle || !event.description || !event.location) {
      alert("Please fill all required fields");
      return;
    }

    if (!event.eventDate || !event.eventTime) {
      alert("Please select date and time");
      return;
    }

    if (!event.category.id) {
      alert("Please select a category");
      return;
    }
    const selectedDateTime = new Date(`${event.eventDate}T${event.eventTime}`);
    const now = new Date();

    if (selectedDateTime < now) {
      alert("Event date and time cannot be in the past");
      return;
    }
    let fileName = existingImage;
    if (imageFile) {
      fileName = await uploadImage();
    }
    const eventToSend = {
      ...event,
      eventDate: `${event.eventDate}T${event.eventTime}:00`,
      image: fileName,
      maxParticipants: event.unlimited ? null : Number(event.maxParticipants),
      category: {
        categoryId: Number(event.category.id),
      },
    };
    apiFetch(`http://localhost:8080/events/updateEvent/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventToSend),
    })
      .then(() => {
        alert("Event Updated Successfully!");
        navigate("/events");
      })
      .catch((err) => {
        alert("Error updating event");
        console.error(String(err));
      });
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
                        name="eventTitle"
                        required
                        placeholder="event title"
                        value={event.eventTitle}
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
                  <div className="mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={event.unlimited}
                        onChange={(e) =>
                          setEvent({
                            ...event,
                            unlimited: e.target.checked,
                            maxParticipants: e.target.checked
                              ? ""
                              : event.maxParticipants,
                          })
                        }
                      />
                      Unlimited Participants
                    </label>
                  </div>
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Maximum Participants
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="maxParticipants"
                        min={1}
                        disabled={event.unlimited}
                        value={event.maxParticipants || ""}
                        onChange={(e) => handleChange(e)}
                        placeholder="Enter maximum number of participants (optional)"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Event Image
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full border p-2 rounded"
                    />

                    {banner && (
                      <img
                        src={banner}
                        className="mt-3 w-full max-h-64 object-cover rounded-lg"
                      />
                    )}
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
