import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    const role = localStorage.getItem("userRole");

    const isGuest = !role;
    const isStudent = role === "STUDENT";
    const isAdmin = role === "ADMIN";
    const isFaculty = role === "FACULTY";

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
            {/* ================= LOGO ================= */}
            <Link
                to="/"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    textDecoration: "none",
                }}
            >
                <div
                    style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9,
                        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        color: "#fff",
                        fontWeight: 800,
                    }}
                >
                    ✦
                </div>
                <span
                    style={{
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 17,
                    }}
                >
                    EventHub
                </span>
            </Link>

            {/* ================= NAV LINKS ================= */}
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {/* PUBLIC */}
                <Link className="nav-link" to="/">
                    Home
                </Link>

                <Link className="nav-link" to="/browse-events">
                    Events
                </Link>

                {/* STUDENT */}
                {isStudent && (
                    <>
                        <Link className="nav-link" to="/student/events">
                            My Events
                        </Link>
                        <Link className="nav-link" to="/student/profile">
                            Profile
                        </Link>
                    </>
                )}

                {/* ADMIN */}
                {isAdmin && (
                    <>
                        <Link className="nav-link" to="/admin">
                            Dashboard
                        </Link>
                        <Link className="nav-link" to="/events">
                            Manage
                        </Link>
                    </>
                )}

                {/* FACULTY */}
                {isFaculty && (
                    <Link className="nav-link" to="/faculty">
                        Faculty
                    </Link>
                )}

                {/* AUTH BUTTONS */}
                {isGuest ? (
                    <Link className="btn-login" to="/login">
                        Login
                    </Link>
                ) : (
                    <button className="btn-logout" onClick={handleLogout}>
                        Logout
                    </button>
                )}
            </div>

            {/* ================= STYLES ================= */}
            <style>{`
                .nav-link {
                    color: rgba(255,255,255,0.75);
                    font-size: 14px;
                    font-weight: 500;
                    padding: 6px 12px;
                    border-radius: 8px;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }

                .nav-link:hover {
                    background: rgba(255,255,255,0.1);
                    color: #fff;
                }

                .btn-login {
                    background: rgba(99,102,241,0.25);
                    border: 1px solid rgba(99,102,241,0.4);
                    color: #c7d2fe;
                    padding: 8px 16px;
                    border-radius: 999px;
                    font-size: 13px;
                    font-weight: 600;
                    text-decoration: none;
                }

                .btn-logout {
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.15);
                    color: rgba(255,255,255,0.7);
                    padding: 8px 16px;
                    border-radius: 999px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                }
            `}</style>
        </nav>
    );
}