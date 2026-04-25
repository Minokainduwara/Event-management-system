import { Link, useLocation } from "react-router";
import { LogOut, User } from "lucide-react";

 function StudentHeader() {

  const location = useLocation();

  

  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-white p-2 rounded">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
              </svg>
            </div>

            <span className="text-xl font-semibold">
              University Events
            </span>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-6">

            <Link
              to="/studentdashboard"
              className={`px-4 py-2 rounded transition 
              }`}
            >
              Home
            </Link>

            <Link
              to="/studentbrowseevent"
              className={`px-4 py-2 rounded transition 
              }`}
            >
              Events
            </Link>

            <Link
              to="/studentevents"
              className={`px-4 py-2 rounded transition
              }`}
            >
              My Events
            </Link>

            <Link 
              to="/studentannoucement"
              className={`px-4 py-2 rounded transition 
              }`}
            >
              Announcements
            </Link>

          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">

            <Link
              to="/studentprofile"
              className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded transition"
            >
              <User className="w-5 h-5" />
              Profile
            </Link>

            <Link
              to="/"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Link>

          </div>

        </div>
      </div>
    </nav>
  );
}
export default StudentHeader;