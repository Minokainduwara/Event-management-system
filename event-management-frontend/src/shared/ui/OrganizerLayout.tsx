import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV_LINKS = [
    { path: "/organizer", label: "Home", icon: "🏠" },
    { path: "/organizer/my-events", label: "My Events", icon: "📅" },
    { path: "/organizer/create-event", label: "Create Event", icon: "➕" },
    { path: "/organizer/analytics", label: "Analytics", icon: "📊" },
    { path: "/organizer/announcements", label: "Announcements", icon: "📢" },
];

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Segoe UI', sans-serif" }}>
            {/* Navbar */}
            <nav style={{
                background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
                padding: "0 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "64px",
                boxShadow: "0 2px 12px rgba(30,58,138,0.3)",
                position: "sticky",
                top: 0,
                zIndex: 100,
            }}>
                {/* Logo */}
                <Link to="/organizer" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                    <span style={{ fontSize: "22px" }}>🎓</span>
                    <span style={{ color: "#fff", fontWeight: 700, fontSize: "17px", letterSpacing: "0.3px" }}>
            University Events
          </span>
                </Link>

                {/* Nav Links */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {NAV_LINKS.map(link => {
                        const active = location.pathname === link.path ||
                            (link.path !== "/organizer" && location.pathname.startsWith(link.path));
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                style={{
                                    color: active ? "#fff" : "rgba(255,255,255,0.75)",
                                    background: active ? "rgba(255,255,255,0.15)" : "transparent",
                                    padding: "8px 14px",
                                    borderRadius: "8px",
                                    textDecoration: "none",
                                    fontSize: "14px",
                                    fontWeight: active ? 600 : 400,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    transition: "all 0.2s",
                                }}
                            >
                                <span style={{ fontSize: "14px" }}>{link.icon}</span>
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right side */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Link
                        to="/organizer/profile"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            background: "rgba(255,255,255,0.12)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "10px",
                            padding: "6px 12px",
                            textDecoration: "none",
                            cursor: "pointer",
                        }}
                    >
                        <div style={{
                            width: "32px", height: "32px", borderRadius: "50%",
                            background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontWeight: 700, fontSize: "14px",
                        }}>
                            {(user.name || "U")[0].toUpperCase()}
                        </div>
                        <div>
                            <div style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>
                                {user.name || "Organizer"}
                            </div>
                            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px" }}>
                                {user.role || "Faculty"}
                            </div>
                        </div>
                    </Link>

                    <button
                        onClick={handleLogout}
                        style={{
                            display: "flex", alignItems: "center", gap: "6px",
                            background: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "8px",
                            color: "#fff",
                            padding: "8px 14px",
                            cursor: "pointer",
                            fontSize: "14px",
                            transition: "all 0.2s",
                        }}
                    >
                        🚪 Logout
                    </button>
                </div>
            </nav>

            {/* Page Content */}
            <main style={{ minHeight: "calc(100vh - 64px)" }}>
                {children}
            </main>
        </div>
    );
}