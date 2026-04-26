import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import Navbar from "./Navbar";

function StudentHeader() {
  return (
    <header className="bg-blue-600 text-white shadow-md">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LEFT - Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg">
            <h1 className="text-blue-600 font-bold text-xl">UE</h1>
          </div>

          <h1 className="text-xl font-bold">
            University Events
          </h1>
        </div>

        {/* CENTER - Reusable Navbar */}
        <Navbar
          profilePath="/studentprofile"
          links={[
            { label: "Home", path: "/student" },
            { label: "Events", path: "/studentbrowseevent" },
            { label: "My Events", path: "/studentevents" },
            { label: "Announcements", path: "/studentannoucement" },
          ]}
        />

        {/* RIGHT - Actions */}
        <div className="flex items-center gap-4">

          <Link
            to="/studentprofile"
            className="hover:bg-white/10 px-4 py-2 rounded-lg transition"
          >
            Profile
          </Link>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>

        </div>

      </div>
    </header>
  );
}

export default StudentHeader;