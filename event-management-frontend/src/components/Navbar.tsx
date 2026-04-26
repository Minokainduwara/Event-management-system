// components/Navbar.tsx

import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";

type NavItem = {
  label: string;
  path: string;
};

type NavbarProps = {
  links: NavItem[];
  profilePath: string;
};

function Navbar({ links, profilePath }: NavbarProps) {
  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded">
            <span className="text-blue-600 font-bold">UE</span>
          </div>

          <h1 className="text-xl font-bold">
            University Events
          </h1>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="hover:bg-white/10 px-4 py-2 rounded transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to={profilePath}
            className="flex items-center gap-2 hover:bg-white/10 px-4 py-2 rounded transition"
          >
            <User className="w-4 h-4" />
            Profile
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;