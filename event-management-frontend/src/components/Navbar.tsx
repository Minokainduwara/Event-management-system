import React from "react";
import { Link, useNavigate } from "react-router-dom";

type NavLink = {
    label: string;
    path: string;
};

type Props = {
    links?: NavLink[];
    profilePath?: string;
};

export default function Navbar({ links = [], profilePath }: Props) {
    const navigate = useNavigate();

    const role = localStorage.getItem("userRole");

    const isGuest = !role;

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        navigate("/login");
    };

    return (
        <nav
            style={{
                position: "sticky",
                top: 0,
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 48px",
                background: "rgba(15,23,42,0.7)",
                backdropFilter: "blur(16px)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
        >
            {/* LOGO */}
            <Link to="/" style={{ textDecoration: "none", color: "#fff", fontWeight: 800 }}>
                EventHub
            </Link>

            {/* CENTER LINKS (IMPORTANT FIX) */}
            <div style={{ display: "flex", gap: 6 }}>
                {links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        style={{
                            color: "rgba(255,255,255,0.75)",
                            fontSize: 14,
                            fontWeight: 500,
                            padding: "6px 12px",
                            borderRadius: 8,
                            textDecoration: "none",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                        }
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            {/* RIGHT SIDE */}
            <div style={{ display: "flex", gap: 10 }}>
                {profilePath && role && (
                    <Link
                        to={profilePath}
                        style={{
                            color: "#c7d2fe",
                            padding: "8px 14px",
                            borderRadius: 999,
                            background: "rgba(99,102,241,0.25)",
                            border: "1px solid rgba(99,102,241,0.4)",
                            textDecoration: "none",
                            fontSize: 13,
                            fontWeight: 600,
                        }}
                    >
                        Profile
                    </Link>
                )}

                {isGuest ? (
                    <Link
                        to="/login"
                        style={{
                            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                            color: "#fff",
                            padding: "8px 14px",
                            borderRadius: 999,
                            textDecoration: "none",
                            fontSize: 13,
                            fontWeight: 700,
                        }}
                    >
                        Login
                    </Link>
                ) : (
                    <button
                        onClick={handleLogout}
                        style={{
                            background: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.15)",
                            color: "rgba(255,255,255,0.7)",
                            padding: "8px 14px",
                            borderRadius: 999,
                            cursor: "pointer",
                            fontSize: 13,
                            fontWeight: 600,
                        }}
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}