import { LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";
import { clearAuthSession } from "../../../shared/types/auth";

export function AdminDashboardPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        clearAuthSession();
        navigate("/login");
    };

    return (
        <main className="min-h-screen bg-slate-100 p-6 md:p-10">
            <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        <ShieldCheck className="h-4 w-4" />
                        Admin Area
                    </div>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
                <h1 className="mt-4 text-3xl font-semibold text-slate-800">Admin Dashboard Placeholder</h1>
                <p className="mt-2 text-sm text-slate-600">
                    This route is ready for the admin team. Build admin pages inside src/features/admin without touching student code.
                </p>
            </section>
        </main>
    );
}
