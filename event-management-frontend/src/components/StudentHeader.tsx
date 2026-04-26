import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import Navbar from "./Navbar";

function StudentHeader() {
  return (
    <header >

      

        

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

        


    </header>
  );
}

export default StudentHeader;