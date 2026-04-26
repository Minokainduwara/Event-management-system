import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";
import Header from "../../components/Header";

interface Registration {
  registration_id: number;
  studentName: string;
  universityId: string;
  email: string;
  eventName: string;
  eventDate: string;
  registrationDate: string;
  status: "pending" | "confirmed" | "attended" | "cancelled";
}

interface Summary {
  total: number;
  confirmed: number;
  attended: number;
  pending: number;
  cancelled: number;
}

function AdminEventRegistration() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [summary, setSummary] = useState<Summary>({
    total: 0,
    confirmed: 0,
    attended: 0,
    pending: 0,
    cancelled: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // ─────────────────────────────────────────────
  // Load initial data
  // ─────────────────────────────────────────────
  useEffect(() => {
    fetchSummary();
    fetchAllRegistrations();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await apiFetch("http://localhost:8080/eventRegistrations/summary");
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error("Summary error:", err);
    }
  };

  const fetchAllRegistrations = async () => {
    try {
      const res = await apiFetch("http://localhost:8080/eventRegistrations/registration");
      const data = await res.json();
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // ─────────────────────────────────────────────
  // Search
  // ─────────────────────────────────────────────
  const searchRegistrations = async (keyword: string) => {
    try {
      const res = await apiFetch(
        `http://localhost:8080/eventRegistrations/search?keyword=${keyword}`
      );
      const data = await res.json();
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  // ─────────────────────────────────────────────
  // Filter by status
  // ─────────────────────────────────────────────
  const filterByStatus = async (status: string) => {
    try {
      if (!status) {
        fetchAllRegistrations();
        return;
      }

      const res = await apiFetch(
        `http://localhost:8080/eventRegistrations/filter?status=${status}`
      );
      const data = await res.json();
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  // ─────────────────────────────────────────────
  // Search handler
  // ─────────────────────────────────────────────
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (value.trim() === "") {
      filterByStatus(statusFilter);
    } else {
      searchRegistrations(value);
    }
  };

  // ─────────────────────────────────────────────
  // Status filter handler
  // ─────────────────────────────────────────────
  const handleStatusChange = (status: string) => {
    setStatusFilter(status);

    if (searchQuery.trim() === "") {
      filterByStatus(status);
    } else {
      searchRegistrations(searchQuery);
    }
  };

  // ─────────────────────────────────────────────
  // Update status
  // ─────────────────────────────────────────────
  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await apiFetch(
        `http://localhost:8080/eventRegistrations/${id}/status?status=${newStatus}`,
        { method: "PUT" }
      );

      setRegistrations((prev) =>
        prev.map((r) =>
          r.registration_id === id ? { ...r, status: newStatus as any } : r
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ─────────────────────────────────────────────
  // Delete registration
  // ─────────────────────────────────────────────
  const handleRemove = async (id: number) => {
    try {
      await apiFetch(`http://localhost:8080/eventRegistrations/${id}`, {
        method: "DELETE",
      });

      setRegistrations((prev) =>
        prev.filter((r) => r.registration_id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────
  const formatDate = (date: string) =>
    date ? new Date(date).toLocaleDateString() : "-";

  const formatDateTime = (date: string) =>
    date ? new Date(date).toLocaleString() : "-";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "attended":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  return (
    <div>
      <Header />

      {/* HEADER + SUMMARY */}
      <div className="h-[300px] flex flex-col pt-8 pl-10 border-b border-gray-200">
        <h1 className="text-3xl font-bold">Event Registrations</h1>
        <p className="text-gray-500">
          Manage all student registrations
        </p>

        <div className="grid grid-cols-5 gap-4 mt-6 pr-8">
          <SummaryBox label="Total" value={summary.total} />
          <SummaryBox label="Confirmed" value={summary.confirmed} color="green" />
          <SummaryBox label="Attended" value={summary.attended} color="blue" />
          <SummaryBox label="Pending" value={summary.pending} color="yellow" />
          <SummaryBox label="Cancelled" value={summary.cancelled} color="red" />
        </div>
      </div>

      {/* FILTERS */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white p-4 rounded shadow flex gap-4">
          <input
            className="border p-2 w-full"
            placeholder="Search student..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />

          <select
            className="border p-2"
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="attended">Attended</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="mt-6 bg-white shadow rounded overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Uni ID</th>
                <th>Email</th>
                <th>Event</th>
                <th>Event Date</th>
                <th>Registered</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {registrations.map((r) => (
                <tr key={r.registration_id} className="border-t">
                  <td>#{r.registration_id}</td>
                  <td>{r.studentName}</td>
                  <td>{r.universityId}</td>
                  <td>{r.email}</td>
                  <td>{r.eventName}</td>
                  <td>{formatDate(r.eventDate)}</td>
                  <td>{formatDateTime(r.registrationDate)}</td>

                  <td>
                    <span
                      className={`text-white px-2 py-1 rounded ${getStatusColor(
                        r.status
                      )}`}
                    >
                      {r.status}
                    </span>

                    <select
                      value={r.status}
                      onChange={(e) =>
                        handleStatusUpdate(r.registration_id, e.target.value)
                      }
                      className="block mt-2 border"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="attended">Attended</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td>
                    <button
                      onClick={() => handleRemove(r.registration_id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {registrations.length === 0 && (
            <div className="text-center p-6 text-gray-500">
              No registrations found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Summary Box Component
// ─────────────────────────────────────────────
function SummaryBox({
  label,
  value,
  color = "gray",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className={`bg-${color}-100 p-4 rounded text-center`}>
      <h4 className="font-semibold">{label}</h4>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}

export default AdminEventRegistration;