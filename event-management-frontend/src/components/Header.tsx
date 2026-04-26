import { Link } from "react-router-dom";
import Navbar from "./Navbar";

function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-md">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LEFT - Logo */}
       

        {/* CENTER - Reusable Navbar */}
        <Navbar
          links={[
            { label: "Dashboard", path: "/admin" },
            { label: "Events", path: "/events" },
            { label: "Categories", path: "/catogory" },
            { label: "Students", path: "/viewstudents" },
            { label: "Registrations", path: "/registration" },
            { label: "Announcements", path: "/announcement" },
          ]}
          profilePath="/profile"
        />

        {/* RIGHT - Actions */}
        <div className="flex items-center gap-4">

          <Link
            to="/profile"
            className="hover:bg-white/10 px-4 py-2 rounded-lg transition"
          >
            Admin Profile
          </Link>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition font-semibold"
          >
            Logout
          </button>

        </div>

      </div>
    </header>
  );
}

export default Header;