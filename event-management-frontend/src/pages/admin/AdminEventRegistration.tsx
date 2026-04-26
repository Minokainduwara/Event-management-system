import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";
import Header from "../../components/Header";

function AdminEventRegistration() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    confirmed: 0,
    attended: 0,
    pending: 0,
    cancelled: 0,
  });

  interface Registration {
    registration_id: number;
    studentName: string;
    universityId: string;
    email: string;
    eventName: string;
    eventDate: string;
    registrationDate: string;
    status: string;
  }
  useEffect(() => {
    apiFetch("http://localhost:8080/eventRegistrations/summary")
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch((err) => console.log(String(err)));

    fetchAllRegistrations();
  }, []);

  const searchRegistrations = (keyword: string) => {
    apiFetch(`http://localhost:8080/eventRegistrations/search?keyword=${keyword}`)
      .then((res) => res.json())
      .then((data) => setRegistrations(data))
      .catch((err) => console.log(String(err)));
  };

  const fetchAllRegistrations = () => {
    apiFetch("http://localhost:8080/eventRegistrations/registration")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRegistrations(data);
        } else {
          console.log("Unexpected response:", data);
          setRegistrations([]);
        }
      })
      .catch((err) => console.log(String(err)));
  };

  const filterByStatus = (status: string) => {
    if (status === "") {
      fetchAllRegistrations();
    } else {
      apiFetch(`http://localhost:8080/eventRegistrations/filter?status=${status}`)
        .then((res) => res.json())
        .then((data) => setRegistrations(data))
        .catch((err) => console.log(String(err)));
    }
  };

  const handleRemove = (id: number) => {
    apiFetch(`http://localhost:8080/eventRegistrations/${id}`, {
      method: "DELETE",
    })
      .then(() =>
        setRegistrations(registrations.filter((r) => r.registration_id !== id)),
      )
      .catch((err) => console.log(String(err)));
  };
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (value === "") {
      filterByStatus(statusFilter);
    } else {
      searchRegistrations(value);
    }
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    filterByStatus(status);
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString();
  const formatDateTime = (date: string) => new Date(date).toLocaleString();

  const handleStatusTable = (id: number, newStatus: string) => {
    apiFetch(
      `http://localhost:8080/eventRegistrations/${id}/status?status=${newStatus}`,
      {
        method: "PUT",
      },
    )
      .then((res) => res.json())
      .then(() => {
        setRegistrations((prev) =>
          prev.map((reg) =>
            reg.registration_id === id ? { ...reg, status: newStatus } : reg,
          ),
        );
      })
      .catch((err) => console.log(String(err)));
  };

  return (
    <div>
      <Header />

      <div className="h-[300px] flex flex-col pt-8 pl-10 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">
          Event Registrations
        </h1>
        <p className="text-gray-500">
          View and manage all student event registrations
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6 pr-8">
          <div className="bg-gray-200 rounded-lg p-4 border border-gray-500 flex flex-col items-center">
            <h4 className="text-lg font-semibold text-gray-700">Total</h4>
            <h2 className="text-2xl font-bold text-gray-700">
              {summary.total}
            </h2>
          </div>

          <div className="bg-green-200 rounded-lg p-4 border border-green-500 flex flex-col items-center">
            <h4 className="text-lg font-semibold text-green-700">Confirmed</h4>
            <h2 className="text-2xl font-bold text-green-700">
              {summary.confirmed}
            </h2>
          </div>

          <div className="bg-blue-200 rounded-lg p-4 border border-blue-500 flex flex-col items-center">
            <h4 className="text-lg font-semibold text-blue-700">Attended</h4>
            <h2 className="text-2xl font-bold text-blue-700">
              {summary.attended}
            </h2>
          </div>

          <div className="bg-yellow-200 rounded-lg p-4 border border-yellow-500 flex flex-col items-center">
            <h4 className="text-lg font-semibold text-yellow-700">Pending</h4>
            <h2 className="text-2xl font-bold text-yellow-700">
              {summary.pending}
            </h2>
          </div>

          <div className="bg-red-200  rounded-lg p-4 border border-red-500 flex flex-col items-center">
            <h4 className="text-lg font-semibold text-red-700">Cancelled</h4>
            <h2 className="text-2xl font-bold text-red-700">
              {summary.cancelled}
            </h2>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow border border-gray-300 p-6 mb-6 ">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by student name..."
              value={searchQuery}
              onChange={(e) => {
                handleSearchChange(e.target.value);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            <select
              value={statusFilter}
              onChange={(e) => {
                handleStatusChange(e.target.value);
              }}
              className="px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="attended">Attended</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-300 overflow-hidden">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-200 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left text-md">Reg ID</th>
                  <th className="px-6 py-4 text-left text-md">Student Name</th>
                  <th className="px-6 py-4 text-left text-md">University ID</th>
                  <th className="px-6 py-4 text-left text-md">Email</th>
                  <th className="px-6 py-4 text-left text-md">Event</th>
                  <th className="px-6 py-4 text-left text-md">Event Date</th>
                  <th className="px-6 py-4 text-left text-md">Registered</th>
                  <th className="px-6 py-4 text-left text-md">Status</th>
                  <th className="px-6 py-4 text-left text-md">Actions</th>
                </tr>
              </thead>

              <tbody>
                {registrations.map((registration: any) => (
                  <tr
                    key={registration.registration_id}
                    className="bg-gray-50 hover:bg-gray-100"
                  >
                    <td className="px-6 py-4">
                      #{registration.registration_id}
                    </td>
                    <td className="px-6 py-4">{registration.studentName}</td>
                    <td className="px-6 py-4">{registration.universityId}</td>
                    <td className="px-6 py-4">{registration.email}</td>
                    <td className="px-6 py-4">{registration.eventName}</td>
                    <td className="px-6 py-4">
                      {formatDate(registration.eventDate)}
                    </td>
                    <td className="px-6 py-4">
                      {formatDateTime(registration.registration_date)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs bg-yellow-500 `}
                      >
                        {registration.status}
                      </span>

                      <select
                        value={registration.status}
                        onChange={(e) =>
                          handleStatusTable(
                            registration.registration_id,
                            e.target.value,
                          )
                        }
                        className="block mt-2 text-xs border rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="attended">Attended</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          handleRemove(registration.registration_id)
                        }
                        className="text-white bg-red-500 p-1 rounded"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {registrations.length === 0 && (
            <div className="text-center py-10">No registrations found</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminEventRegistration;
