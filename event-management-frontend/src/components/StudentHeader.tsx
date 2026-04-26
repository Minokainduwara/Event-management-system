import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import Navbar from "./Navbar";

function StudentHeader() {
  return (
    <header className="bg-blue-600 text-white shadow-md">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        

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