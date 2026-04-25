
import { Calendar, MapPin, Search, Filter, Clock, XCircle, Eye } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import StudentHeader from "../../components/StudentHeader";
import { useEffect } from "react";

interface EventRegistration {
  registration_id: number;
  event_name: string;
  category: string;
  event_date: string;
  location: string;
  registration_date: string;
  status: string;
  event_time: string;
  event_id: number;
}

export default function MyRegisteredEvents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [registeredEvents, setRegisteredEvents] = useState<EventRegistration[]>([]);
  const [stats, setStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyRegistrations();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:8080/eventRegistrations/my/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };

  const fetchMyRegistrations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("http://localhost:8080/eventRegistrations/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch registrations");
      }

      const data = await res.json();
      setRegisteredEvents(data);
    } catch (err) {
      console.error("Error loading registrations:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSearch = async (keyword: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`http://localhost:8080/eventRegistrations/my?keyword=${keyword}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to search registrations");
      const data = await res.json();
      setRegisteredEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFilter = async (status: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`http://localhost:8080/eventRegistrations/my?status=${status}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to filter registrations");
      const data = await res.json();
      setRegisteredEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRegistration = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to cancel your registration for "${name}"?`)) return;

    try {
      const res = await fetch(`http://localhost:8080/eventRegistrations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to cancel registration");
      }

      // Refresh using the current active filter or search state
      if (searchQuery !== "") {
        fetchSearch(searchQuery);
      } else if (statusFilter !== "") {
        fetchFilter(statusFilter);
      } else {
        fetchMyRegistrations();
      }

      // Also refresh stats after a cancellation
      fetchStats();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel registration. Please try again later.");
    }
  };

  // No local filtering, backend already handles it
  const filteredEvents = registeredEvents;

  // Get status styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "attended":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  // Format datetime
  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Removed frontend stat calculations, using backend stats instead

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <StudentHeader />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">My Registered Events</h1>
          <p className="text-gray-600 mt-1">View and manage all events you have registered for</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalRegistrations || 0}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-sm text-green-600">Confirmed</div>
              <div className="text-2xl font-bold text-green-900 mt-1">{stats.confirmed || 0}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-sm text-blue-600">Attended</div>
              <div className="text-2xl font-bold text-blue-900 mt-1">{stats.attended || 0}</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="text-sm text-yellow-600">Pending</div>
              <div className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending || 0}</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="text-sm text-red-600">Cancelled</div>
              <div className="text-2xl font-bold text-red-900 mt-1">{stats.cancelled || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by event name, category, or location..."
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  if (val !== "") {
                    setStatusFilter(""); // Clear filter to ensure they are not combined
                    fetchSearch(val);
                  } else {
                    fetchMyRegistrations();
                  }
                }}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  const val = e.target.value;
                  setStatusFilter(val);
                  if (val !== "") {
                    setSearchQuery(""); // Clear search to ensure they are not combined
                    fetchFilter(val);
                  } else {
                    fetchMyRegistrations();
                  }
                }}
                className="pl-12 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white min-w-[200px]"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="attended">Attended</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading registrations...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Reg ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Event Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Event Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Registered On
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEvents.map((registration) => (
                    <tr key={registration.registration_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          #{registration.registration_id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {registration.event_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {registration.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(registration.event_date)}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {registration.event_time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {registration.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-600">
                          {formatDateTime(registration.registration_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(
                            registration.status
                          )}`}
                        >
                          {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/student/events/${registration.event_id}`}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                          {registration.status === "confirmed" && (
                            <button
                              onClick={() =>
                                handleCancelRegistration(
                                  registration.registration_id,
                                  registration.event_name
                                )
                              }
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                            >
                              <XCircle className="w-4 h-4" />
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No registrations found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Summary */}
        {!isLoading && !error && (
          <div className="mt-6 text-sm text-gray-600">
            <div>
              Showing <span className="font-semibold text-gray-900">{filteredEvents.length}</span> of{" "}
              <span className="font-semibold text-gray-900">{registeredEvents.length}</span> registrations
            </div>
          </div>
        )}
      </div>
    </div>
  );
}