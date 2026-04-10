import React, { useState } from "react";
import Header from "../components/Header";

type Status = "pending" | "confirmed" | "attended" | "cancelled";

interface Registration {
  registration_id: number;
  student_name: string;
  university_id: string;
  email: string;
  event_name: string;
  event_date: string;
  registration_date: string;
  status: Status | string;
}

function AdminEventRegistration() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [registrations, setRegistrations] = useState<Registration[]>([
    {
      registration_id: 1,
      student_name: "Sasindu",
      university_id: "ICT001",
      email: "sasindu@gmail.com",
      event_name: "Tech Summit",
      event_date: "2026-04-10",
      registration_date: "2026-04-01T10:00:00",
      status: "pending",
    },
    {
      registration_id: 2,
      student_name: "Kamal",
      university_id: "ICT002",
      email: "kamal@gmail.com",
      event_name: "AI Workshop",
      event_date: "2026-04-15",
      registration_date: "2026-04-01T12:00:00",
      status: "confirmed",
    },
  ]);

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.university_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.event_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "" || reg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

//   const handleStatusChange = (registrationId, newStatus) => {
//     setRegistrations((prev) =>
//       prev.map((reg) =>
//         reg.registration_id === registrationId
//           ? { ...reg, status: newStatus }
//           : reg,
//       ),
//     );
//   };

  const handleStatusChange = (
    registrationId: number,
    newStatus: Status | string,
  ) => {
    setRegistrations((prev) =>
      prev.map((reg) =>
        reg.registration_id === registrationId
          ? { ...reg, status: newStatus }
          : reg,
      ),
    );
  };

  const handleRemove = (id: number) => {
    setRegistrations((prev) =>
      prev.filter((reg) => reg.registration_id !== id),
    );
  };

  const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString();
  const formatDateTime = (date: string | Date) =>
    new Date(date).toLocaleString();

  const getStatusStyle = (status: Status | string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "attended":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <Header />

      {/* Top Section */}
      <div className="h-[300px] flex flex-col pt-8 pl-10 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">
          Event Registrations
        </h1>
        <p className="text-gray-500">
          View and manage all student event registrations
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col items-center w-50 h-30">
            <h4 className="text-sm font-medium text-gray-600">Total</h4>
            <h2 className="text-2xl font-bold text-gray-900">{registrations.length}</h2>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200 flex flex-col items-center w-50 h-30">
            <h4 className="text-sm font-medium text-green-600">Confirmed</h4>
            <h2 className="text-2xl font-bold text-green-900">
              {registrations.filter((r) => r.status === "confirmed").length}
            </h2>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 flex flex-col items-center w-50 h-30">
            <h4 className="text-sm font-medium text-blue-600">Attended</h4>
            <h2 className="text-2xl font-bold text-blue-900">
              {registrations.filter((r) => r.status === "attended").length}
            </h2>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 flex flex-col items-center w-50 h-30">
            <h4 className="text-sm font-medium text-yellow-600">Pending</h4>
            <h2 className="text-2xl font-bold text-yellow-900">
              {registrations.filter((r) => r.status === "pending").length}
            </h2>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-200 flex flex-col items-center w-50 h-30">
            <h4 className="text-sm font-medium text-red-600">Cancelled</h4>
            <h2 className="text-2xl font-bold text-red-900">
              {registrations.filter((r) => r.status === "cancelled").length}
            </h2>
          </div>
        </div>
      </div>

      
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by student name, university ID, or event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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

        
        <div className="bg-white rounded-lg shadow border border-gray-400 overflow-hidden">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-100 sticky top-0">
                <tr >
                  <th className="px-6 py-4 text-left text-sm">Reg ID</th>
                  <th className="px-6 py-4 text-left text-sm">Student Name</th>
                  <th className="px-6 py-4 text-left text-sm">University ID</th>
                  <th className="px-6 py-4 text-left text-sm">Email</th>
                  <th className="px-6 py-4 text-left text-sm">Event</th>
                  <th className="px-6 py-4 text-left text-sm">Event Date</th>
                  <th className="px-6 py-4 text-left text-sm">Registered</th>
                  <th className="px-6 py-4 text-left text-sm">Status</th>
                  <th className="px-6 py-4 text-left text-sm">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRegistrations.map((registration) => (
                  <tr key={registration.registration_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      #{registration.registration_id}
                    </td>
                    <td className="px-6 py-4">{registration.student_name}</td>
                    <td className="px-6 py-4">{registration.university_id}</td>
                    <td className="px-6 py-4">{registration.email}</td>
                    <td className="px-6 py-4">{registration.event_name}</td>
                    <td className="px-6 py-4">
                      {formatDate(registration.event_date)}
                    </td>
                    <td className="px-6 py-4">
                      {formatDateTime(registration.registration_date)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${getStatusStyle(registration.status)}`}
                      >
                        {registration.status}
                      </span>

                      <select
                        value={registration.status}
                        onChange={(e) =>
                          handleStatusChange(
                            registration.registration_id,
                            e.target.value,
                          )
                        }
                        className="block mt-2 text-xs border border-gray-200 rounded"
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
                        className="text-white bg-red-500 p-1 rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRegistrations.length === 0 && (
            <div className="text-center py-10">No registrations found</div>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default AdminEventRegistration;
