import { Link } from "react-router-dom";
import Navbar from "./Navbar";

function Header() {
  return (
    <header >

      
        {/* LEFT - Logo */}
       

        {/* CENTER - Reusable Navbar */}
        <Navbar
          links={[
            { label: "Dashboard", path: "/admin" },
            { label: "Events", path: "/admin/events" },
            { label: "Categories", path: "/admin/category" },
            { label: "Students", path: "/admin/viewstudents" },
            { label: "Registrations", path: "/admin/registration" },
            { label: "Announcements", path: "/admin/announcements" },
          ]}
          profilePath="/profile"
        />

        


    </header>
  );
}

export default Header;