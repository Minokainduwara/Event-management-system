import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Body from "../components/Body";
import { Link } from "react-router-dom";
function AdminEvents() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("");
  const [events, setEvents] = React.useState<EventType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [eventCounts, setEventCounts] = useState<Record<number, number>>({});
  type EventType = {
    eventId: number;
    eventTitle: string;
    category?: { categoryName: string };
    eventDate: string;
    location: string;
    maxParticipants: number;
    status: string;
  };
  type Category = {
    categoryId: number;
    categoryName: string;
  };
  useEffect(() => {
    fetch("http://localhost:8080/events/allEvents")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);

        data.forEach((event: any) => {
          fetch(
            `http://localhost:8080/eventRegistrations/count/${event.eventId}`,
          )
            .then((res) => res.json())
            .then((count) => {
              setEventCounts((prev) => ({
                ...prev,
                [event.eventId]: count,
              }));
            });
        });
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/category/getCategories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleSearch = (value: string) => {
    setSearchQuery(value);

    if (value === "") {
      fetch("http://localhost:8080/events/allEvents")
        .then((res) => res.json())
        .then((data) => setEvents(data));
    } else {
      fetch(`http://localhost:8080/events/searchEvent?keyword=${value}`)
        .then((res) => res.json())
        .then((data) => setEvents(data));
    }
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);

    if (value === "") {
      fetch("http://localhost:8080/events/allEvents")
        .then((res) => res.json())

        .then((data) => setEvents(data));
    } else {
      fetch(`http://localhost:8080/events/filter?categoryId=${value}`)
        .then((res) => res.json())
        .then((data) => setEvents(data));
    }
  };

  const handleDelete = (id: number) => {
    console.log("delete id:", id);
    fetch(`http://localhost:8080/events/deleteEvent/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setEvents(events.filter((event) => (event as any).event_id !== id));
      })
      .catch((err) => console.log(err));
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((e) =>
        e.eventId === id ? { ...e, status: newStatus } : e,
      ),
    );

    try {
      const res = await fetch(
        `http://localhost:8080/events/updateStatus/${id}?status=${newStatus}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!res.ok) {
        console.error("Failed to update status", res.status);

        setEvents((prevEvents) =>
          prevEvents.map((e) =>
            e.eventId === id ? { ...e, status: e.status } : e,
          ),
        );
        return;
      }

      const updatedEvent = await res.json();

      setEvents((prevEvents) =>
        prevEvents.map((e) => (e.eventId === id ? updatedEvent : e)),
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };
  return (
    <div>
      <Header />
      <Body>
        <div>
          <div className="bg-white border-b border-gray-200">
            <div className="flex items-center justify-between p-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Event Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage all university events
                </p>
              </div>
              <Link
                to="/admin/events/add"
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create New Event
              </Link>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="76"
                    height="76"
                    viewBox="0 0 76 76"
                    fill="none"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  >
                    <path
                      d="M34.3995 59.4171C48.2164 59.4171 59.4173 48.2163 59.4173 34.3994C59.4173 20.5824 48.2164 9.38159 34.3995 9.38159C20.5826 9.38159 9.38171 20.5824 9.38171 34.3994C9.38171 48.2163 20.5826 59.4171 34.3995 59.4171Z"
                      stroke="#99A1AF"
                      strokeWidth="6.25444"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M65.6717 65.6715L52.2246 52.2245"
                      stroke="#99A1AF"
                      strokeWidth="6.25444"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search events by name..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="140"
                    height="140"
                    viewBox="0 0 140 140"
                    fill="none"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  >
                    <path
                      d="M58.0221 116.044C58.0216 117.122 58.3216 118.179 58.8883 119.097C59.4551 120.014 60.2662 120.755 61.2307 121.237L72.8351 127.039C73.7199 127.481 74.7031 127.69 75.6912 127.645C76.6793 127.6 77.6396 127.304 78.4808 126.783C79.322 126.263 80.0163 125.536 80.4976 124.672C80.9789 123.808 81.2313 122.835 81.2309 121.846V81.2308C81.2322 78.3552 82.3012 75.5824 84.2306 73.4501L126.14 27.0964C126.891 26.2641 127.385 25.2321 127.562 24.125C127.739 23.0179 127.591 21.8833 127.137 20.8583C126.683 19.8333 125.942 18.9619 125.003 18.3493C124.064 17.7368 122.967 17.4094 121.846 17.4067H17.4068C16.2847 17.4071 15.1868 17.7329 14.246 18.3446C13.3053 18.9563 12.5621 19.8276 12.1065 20.853C11.6509 21.8785 11.5024 23.014 11.679 24.1221C11.8556 25.2303 12.3498 26.2634 13.1016 27.0964L55.0224 73.4501C56.9518 75.5824 58.0208 78.3552 58.0221 81.2308V116.044Z"
                      stroke="#99A1AF"
                      strokeWidth="11.6044"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <select
                    value={categoryFilter}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="pl-12 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white min-w-[200px]"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category: any) => (
                      <option value={category.categoryId}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg  overflow-x-auto max-h-[400px]">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">Id</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Location</th>
                    <th className="px-4 py-3 text-left">
                      Maximum Participants
                    </th>
                    <th className="px-4 py-3 text-left flex justify-center">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {events.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-4 text-gray-500"
                      >
                        No events found
                      </td>
                    </tr>
                  ) : (
                    events.map((event: any) => {
                      const confirmed = eventCounts[event.eventId] || 0;
                      const max = event.maxParticipants;
                      const isUnlimited = event.unlimited || max === null;

                      const isFull =
                        !isUnlimited && max !== null && confirmed >= max;

                      return (
                        <tr key={event.eventId} className="hover:bg-gray-100">
                          <td className="px-4 py-3 font-semibold text-md">
                            {event.eventId}
                          </td>

                          <td className="px-4 py-3 font-semibold text-md">
                            {event.eventTitle}
                          </td>

                          <td className="px-4 py-3 font-semibold text-md">
                            {event.category?.categoryName ||
                              event.category?.category_name}
                          </td>

                          <td className="px-4 py-3 font-semibold text-md">
                            {new Date(event.eventDate).toLocaleString()}
                          </td>

                          <td className="px-4 py-3 font-semibold text-md">
                            {event.location}
                          </td>

                          <td className="px-4 py-3 flex flex-col items-center font-semibold text-md">
                            {event.unlimited ||
                            event.maxParticipants === null ? (
                              <span className="text-green-600 font-semibold">
                                No limit
                              </span>
                            ) : (
                              <>
                                <span>{event.maxParticipants}</span>

                                <span className="text-xs text-gray-500">
                                  {confirmed} filled
                                </span>

                                {isFull && (
                                  <span className="text-red-600 text-xs font-bold">
                                    FULL
                                  </span>
                                )}
                              </>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-yellow-500">
                                {event.status}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-3 text-center space-x-2">
                            <Link
                              to={`/admin/events/edit/${event.eventId}`}
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 "
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() => handleDelete(event.eventId)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mt-3"
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
        </div>
      </Body>
    </div>
  );
}

export default AdminEvents;
