import { authFetch } from "../../utils/authFetch";
import { Search, Filter, Megaphone, Clock, AlertCircle } from "lucide-react";
import { useState,useEffect } from "react";
import StudentHeader from "../../components/StudentHeader";

function StudentAnnouncements() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
type Announcement = {
  announcement_id: number;
  title: string;
  content: string;
  created_by: string;
  created_at: string;
  isImportant: boolean;
};
 const [announcements, setAnnouncements] = useState<Announcement[]>([]);
const [loading, setLoading] = useState(true);
  
type AnnouncementFromBackend = {
  announcementId: number;
  title: string;
  message: string;
  createdBy?: {
    name?: string;
  };
  createdAt: string;
};
useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await authFetch(
          "http://localhost:8080/announcement/all"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch announcements");
        }

        const data: AnnouncementFromBackend[] = await response.json();

        const formattedData = data.map((item) => ({
          announcement_id: item.announcementId,
          title: item.title,
          content: item.message,
          created_by: item.createdBy?.name || "Admin",
          created_at: item.createdAt,
          isImportant: false,
          
        }));

        
        const sortedData:Announcement[] = formattedData.sort(
  (a, b) =>
    new Date(b.created_at).getTime() -
    new Date(a.created_at).getTime()
);

setAnnouncements(sortedData);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [])
  // Format datetime
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

 
  
  return (
    <div className="min-h-screen bg-gray-50">
      
      <StudentHeader/>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-1">Stay updated with the latest university news and announcements</p>

       
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.announcement_id}
              className={`bg-white rounded-lg shadow-sm border overflow-hidden transition-all hover:shadow-md ${
                announcement.isImportant
                  ? "border-l-4 border-l-blue-600 border-r border-r-gray-200 border-t border-t-gray-200 border-b border-b-gray-200"
                  : "border-gray-200"
              }`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${announcement.isImportant ? "bg-blue-100" : "bg-gray-100"}`}>
                      {announcement.isImportant ? (
                        <AlertCircle className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Megaphone className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                        {announcement.isImportant && (
                          <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Important
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDateTime(announcement.created_at)}
                        </span>
                        <span>•</span>
                        <span>By {announcement.created_by}</span>
                        <span>•</span>
                        
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="ml-14">
                  <p className="text-gray-600 text-sm leading-relaxed">{announcement.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {announcements.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No announcements found matching your criteria.</p>
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 text-sm text-gray-600">
          <div>
            Showing <span className="font-semibold text-gray-900">{announcements.length}</span> of{" "}
            <span className="font-semibold text-gray-900">{announcements.length}</span> announcements
          </div>
        </div>
      </div>
    </div>
  );
}
export default StudentAnnouncements;
