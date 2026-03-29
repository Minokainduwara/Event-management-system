import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router";

interface StudentLayoutProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
}

export function StudentLayout({ title, subtitle, children }: StudentLayoutProps) {
    const navigate = useNavigate();
    const studentName = localStorage.getItem("userName") || "Student";

    const handleLogout = () => {
        localStorage.removeItem("userRole");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-wider text-slate-500">University of Ruhuna</p>
                        <h1 className="text-2xl text-slate-900">{title}</h1>
                        {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="text-sm text-slate-600">Signed in as {studentName}</p>
                        <button
                            type="button"
                            className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-700"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
                <nav className="mx-auto flex max-w-6xl gap-2 px-4 pb-4">
                    <NavTab to="/dashboard" label="Dashboard" />
                    <NavTab to="/events" label="Events" />
                    <NavTab to="/my-registrations" label="My Registrations" />
                    <NavTab to="/profile" label="Profile" />
                </nav>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </div>
    );
}

interface NavTabProps {
    to: string;
    label: string;
}

function NavTab({ to, label }: NavTabProps) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm ${
                    isActive ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`
            }
        >
            {label}
        </NavLink>
    );
}
