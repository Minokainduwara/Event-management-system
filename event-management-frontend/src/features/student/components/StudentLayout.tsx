import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router";
import { CalendarDays, LayoutDashboard, ListChecks, LogOut, GraduationCap, User } from "lucide-react";

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
        localStorage.removeItem("userId");
        navigate("/login");
    };

    const navItems = [
        {
            to: "/dashboard",
            label: "Dashboard",
            icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
            to: "/events",
            label: "View Events",
            icon: <CalendarDays className="h-4 w-4" />,
        },
        {
            to: "/my-registrations",
            label: "My Registered Events",
            icon: <ListChecks className="h-4 w-4" />,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-100 text-slate-700">
            <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-56 md:flex-col md:border-r md:border-slate-200 md:bg-white">
                <div className="border-b border-slate-200 px-5 py-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-3xl font-semibold leading-none text-slate-800">UEMS</p>
                            <p className="text-xs text-slate-500">Student Panel</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 px-3 py-4">
                    {navItems.map((item) => (
                        <NavTab key={item.to} to={item.to} label={item.label} icon={item.icon} />
                    ))}
                </nav>

                <div className="border-t border-slate-200 p-3">
                    <NavTab to="/profile" label="Profile" icon={<User className="h-4 w-4" />} />

                    <button
                        type="button"
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </aside>

            <div className="border-b border-slate-200 bg-white px-4 py-4 md:hidden">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-lg font-semibold text-slate-800">UEMS</p>
                        <p className="text-xs text-slate-500">Student Panel</p>
                    </div>
                    <button
                        type="button"
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                    {navItems.map((item) => (
                        <NavTab key={item.to} to={item.to} label={item.label} icon={item.icon} mobile />
                    ))}
                </div>
            </div>

            <main className="md:ml-56">
                <header className="border-b border-slate-200 bg-white px-6 py-6">
                    <h1 className="text-4xl font-semibold leading-none text-slate-800">{title}</h1>
                    <p className="mt-2 text-sm text-slate-500">{subtitle || `Welcome back, ${studentName}`}</p>
                </header>

                <section className="min-h-[calc(100vh-109px)] px-4 py-6 md:px-6">{children}</section>
            </main>
        </div>
    );
}

interface NavTabProps {
    to: string;
    label: string;
    icon: ReactNode;
    mobile?: boolean;
}

function NavTab({ to, label, icon, mobile = false }: NavTabProps) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `${mobile ? "inline-flex" : "flex w-full"} items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
            }
        >
            {icon}
            {label}
        </NavLink>
    );
}
