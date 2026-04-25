import { authFetch } from "../../utils/authFetch";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  Clock,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import StudentHeader from "../../components/StudentHeader";

function StudentBrowseEvents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);
  type CategoryCount = {
    category: string;
    count: number;
  };
  useEffect(() => {
    authFetch("http://localhost:8080/student/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.log(err));

    authFetch("http://localhost:8080/events/category-counts")
      .then((res) => res.json())
      .then((data) => setCategoryCounts(data))
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    if (searchQuery === "") return;

    authFetch(`http://localhost:8080/student/events/search?keyword=${searchQuery}`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.log(err));
  }, [searchQuery]);


  useEffect(() => {
    if (categoryFilter === "") return;

    authFetch(`http://localhost:8080/student/events/filter?categoryId=${categoryFilter}`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.log(err));
  }, [categoryFilter]);
  const categoryMap = categoryCounts.reduce((acc: any, item: any) => {
    acc[item.category] = item.count;
    return acc;
  }, {});
  const totalEvents = categoryCounts.reduce((sum, item) => sum + item.count, 0);
  const categories = Array.from(
    new Set(events.map((e) => e.category))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Events</h1>
          <p className="text-gray-600 mt-1">
            Discover and register for upcoming university events
          </p>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600">All Events</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {totalEvents}
              </div>
            </div>
            {categoryCounts.map((cat: any) => (
              <div
                key={cat.category}
                className="bg-blue-50 rounded-lg p-4 border"
              >
                <div className="text-sm text-blue-600">{cat.category}</div>
                <div className="text-2xl font-bold text-blue-900">
                  {cat.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events by name, description, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-12 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white min-w-[200px]"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Event Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Availability
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {event.eventTitle}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                        {event.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(event.eventDate)}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {event.eventTime}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {event.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        {event.registered}/{event.maxParticipants}
                      </div>
                      <div className="mt-1">
                        <div className="w-24 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{
                              width: `${(event.registered / event.maxParticipants) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/studenteventdetails/${event.id}`}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          {events.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No events found matching your criteria.
              </p>
            </div>
          )}
        </div>


        <div className="mt-6 text-sm text-gray-600">
          <div>
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {events.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">{events.length}</span>{" "}
            events
          </div>
        </div>
      </div>
    </div>
  );
}
export default StudentBrowseEvents;
