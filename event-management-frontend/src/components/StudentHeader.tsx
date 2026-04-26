import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import Navbar from "./Navbar";

function StudentHeader() {
  return (
    <header>
      <Navbar
        profilePath="/student/profile"
        links={[
          { label: "Home", path: "/student" },
          { label: "Events", path: "/browse-events" },
          { label: "My Events", path: "/student/registered-events" },
          { label: "Announcements", path: "/student/announcements" },
        ]}
      />
    </header>
  );
}

export default StudentHeader;