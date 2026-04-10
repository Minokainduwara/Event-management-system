import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router";
import { LayoutDashboard, Calendar, ClipboardList, User, LogOut, GraduationCap } from "lucide-react";

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
        <div className="min-h-screen bg-slate-50">
            <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">University of Ruhuna</p>
                            <h1 className="text-xl font-bold text-slate-900 leading-tight">{title}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden text-right md:block">
                            <p className="text-sm font-medium text-slate-700">{studentName}</p>
                            <p className="text-xs text-slate-500">Student Account</p>
                        </div>
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-900"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
                <nav className="mx-auto flex max-w-6xl overflow-x-auto px-4 pb-0 no-scrollbar">
                    <div className="flex gap-1 border-b-2 border-transparent">
                        <NavTab to="/dashboard" label="Dashboard" icon={<LayoutDashboard className="h-4 w-4" />} />
                        <NavTab to="/events" label="Events" icon={<Calendar className="h-4 w-4" />} />
                        <NavTab to="/my-registrations" label="My Registrations" icon={<ClipboardList className="h-4 w-4" />} />
                        <NavTab to="/profile" label="Profile" icon={<User className="h-4 w-4" />} />
                    </div>
                </nav>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8">
                {subtitle && (
                    <div className="mb-6">
                        <p className="text-slate-500">{subtitle}</p>
                    </div>
                )}
                {children}
            </main>
        </div>
    );
}

interface NavTabProps {
    to: string;
    label: string;
    icon: ReactNode;
}

function NavTab({ to, label, icon }: NavTabProps) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900 text-slate-500"
                }`
            }
        >
            {icon}
            {label}
        </NavLink>
    );
}
