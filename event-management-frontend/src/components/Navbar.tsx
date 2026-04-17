import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import {
    GraduationCap,
    Home,
    CalendarDays,
    PlusCircle,
    BarChart3,
    LogOut,
    User,
    Menu,
    X,
} from 'lucide-react';

export function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const userRole = localStorage.getItem('userRole') || 'student';
    const userName = localStorage.getItem('userName') || 'User';

    const isFacultyOrAdmin = userRole === 'faculty' || userRole === 'admin';

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        navigate('/login');
    };

    const navLinks = [
        { to: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
        { to: '/my-events', label: 'My Events', icon: <CalendarDays className="w-4 h-4" /> },
        ...(isFacultyOrAdmin
            ? [
                  { to: '/create-event', label: 'Create Event', icon: <PlusCircle className="w-4 h-4" /> },
                  { to: '/analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
              ]
            : []),
    ];

    const isActive = (path: string) =>
        path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

    return (
        <nav className="bg-[#1E3A8A] shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-white/10 p-1.5 rounded-lg group-hover:bg-white/20 transition-colors">
                            <GraduationCap className="w-6 h-6 text-[#FBBF24]" />
                        </div>
                        <span className="text-white font-bold text-lg tracking-tight leading-tight">
                            UniEvents
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    isActive(link.to)
                                        ? 'bg-white/20 text-white'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side: User + Logout */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Role Badge */}
                        <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                                isFacultyOrAdmin
                                    ? 'bg-[#FBBF24] text-[#1E3A8A]'
                                    : 'bg-white/10 text-white/80'
                            }`}
                        >
                            {userRole}
                        </span>

                        {/* User Info */}
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                            <User className="w-4 h-4 text-white/70" />
                            <span className="text-white text-sm font-medium">{userName}</span>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-white/10 bg-[#1a3278] px-4 pb-4 pt-2">
                    <div className="flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    isActive(link.to)
                                        ? 'bg-white/20 text-white'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}

                        <div className="border-t border-white/10 mt-2 pt-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-white/70" />
                                <span className="text-white text-sm">{userName}</span>
                                <span
                                    className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase ${
                                        isFacultyOrAdmin
                                            ? 'bg-[#FBBF24] text-[#1E3A8A]'
                                            : 'bg-white/10 text-white/80'
                                    }`}
                                >
                                    {userRole}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
