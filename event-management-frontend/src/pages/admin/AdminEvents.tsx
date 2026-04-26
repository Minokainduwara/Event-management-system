import React, { useState, useEffect } from "react";
import { apiFetch } from "../../utils/apiFetch";
import Header from "../../components/Header";
import Body from "../../components/Body";
import { Link } from "react-router-dom";

type EventType = {
  eventId: number;
  eventTitle: string;
  category?: { categoryName: string };
  eventDate: string;
  location: string;
  maxParticipants: number | null;
  status: string;
  unlimited?: boolean;
};

type Category = {
  categoryId: number;
  categoryName: string;
};

function AdminEvents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [events, setEvents] = useState<EventType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [eventCounts, setEventCounts] = useState<Record<number, number>>({});

  // ───────── Load Events ─────────
  const loadEvents = async () => {
    try {
      const res = await apiFetch("http://localhost:8080/events/allEvents");
      const data: EventType[] = await res.json();
      setEvents(data);

      // load counts safely
      data.forEach(async (event) => {
        try {
          const countRes = await apiFetch(
            `http://localhost:8080/eventRegistrations/count/${event.eventId}`
          );
          const count = await countRes.json();

          setEventCounts((prev) => ({
            ...prev,
            [event.eventId]: count,
          }));
        } catch (err) {
          console.log("Count error:", String(err));
        }
      });
    } catch (err) {
      console.log(String(err));
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // ───────── Load Categories ─────────
  useEffect(() => {
    apiFetch("http://localhost:8080/category/getCategories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(String(err)));
  }, []);

  // ───────── Search ─────────
  const handleSearch = async (value: string) => {
    setSearchQuery(value);

    try {
      const url =
        value === ""
          ? "http://localhost:8080/events/allEvents"
          : `http://localhost:8080/events/searchEvent?keyword=${value}`;

      const res = await apiFetch(url);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.log(String(err));
    }
  };

  // ───────── Category Filter ─────────
  const handleCategoryChange = async (value: string) => {
    setCategoryFilter(value);

    try {
      const url =
        value === ""
          ? "http://localhost:8080/events/allEvents"
          : `http://localhost:8080/events/filter?categoryId=${value}`;

      const res = await apiFetch(url);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.log(String(err));
    }
  };

  // ───────── Delete Event ─────────
  const handleDelete = async (id: number) => {
    try {
      await apiFetch(`http://localhost:8080/events/deleteEvent/${id}`, {
        method: "DELETE",
      });

      setEvents((prev) => prev.filter((e) => e.eventId !== id));
    } catch (err) {
      console.log(String(err));
    }
  };

  // ───────── Status Change ─────────
  const handleStatusChange = async (id: number, newStatus: string) => {
    const oldEvents = [...events];

    setEvents((prev) =>
      prev.map((e) =>
        e.eventId === id ? { ...e, status: newStatus } : e
      )
    );

    try {
      const res = await apiFetch(
        `http://localhost:8080/events/updateStatus/${id}?status=${newStatus}`,
        {
          method: "PUT",
        }
      );

      if (!res.ok) {
        setEvents(oldEvents);
      }
    } catch (err) {
      console.log(String(err));
      setEvents(oldEvents);
    }
  };

  return (
    <div>
      <Header />
      <Body>
        {/* HEADER */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between p-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Event Management
              </h1>
              <p className="text-gray-600 mt-1">Manage all university events</p>
            </div>

            <Link
              to="/admin/events/add"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Create Event
            </Link>
          </div>
        </div>

        {/* FILTERS */}
        <div className="max-w-7xl mx-auto px-6 py-6 flex gap-4">
          <input
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search events..."
            className="flex-1 border p-3 rounded-lg"
          />

          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="border p-3 rounded-lg"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="max-w-7xl mx-auto px-6 pb-10">
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3">ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {events.length === 0 ? (
                  <tr>
                    <td className="text-center p-4" colSpan={8}>
                      No events found
                    </td>
                  </tr>
                ) : (
                  events.map((event) => {
                    const confirmed = eventCounts[event.eventId] || 0;
                    const max = event.maxParticipants;

                    const isFull =
                      max !== null &&
                      !event.unlimited &&
                      confirmed >= max;

                    return (
                      <tr key={event.eventId} className="border-t">
                        <td className="p-3">{event.eventId}</td>
                        <td>{event.eventTitle}</td>
                        <td>{event.category?.categoryName}</td>
                        <td>{new Date(event.eventDate).toLocaleString()}</td>
                        <td>{event.location}</td>

                        <td className="text-center">
                          {event.unlimited || max === null ? (
                            "Unlimited"
                          ) : (
                            <>
                              {max}
                              <div className="text-xs text-gray-500">
                                {confirmed} joined
                              </div>
                              {isFull && (
                                <div className="text-red-500 text-xs">
                                  FULL
                                </div>
                              )}
                            </>
                          )}
                        </td>

                        <td>
                          <select
                            value={event.status}
                            onChange={(e) =>
                              handleStatusChange(
                                event.eventId,
                                e.target.value
                              )
                            }
                            className="border p-1 rounded"
                          >
                            <option>upcoming</option>
                            <option>ongoing</option>
                            <option>completed</option>
                            <option>cancelled</option>
                          </select>
                        </td>

                        <td className="flex gap-2 p-2">
                          <Link
                            to={`/admin/events/edit/${event.eventId}`}
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(event.eventId)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Body>
    </div>
  );
}

export default AdminEvents;