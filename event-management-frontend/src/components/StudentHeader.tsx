import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import Navbar from "./Navbar";

function StudentHeader() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div>
            <Link
              to="/"
              className={`px-4 py-2 rounded transition 
              }`}
            >
              Home
            </Link>

        

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

        

      </div>
    </header>
  );
}

export default StudentHeader;