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

        

      </div>
    </header>
  );
}

export default Header;