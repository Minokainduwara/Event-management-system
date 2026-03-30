import { GraduationCap } from "lucide-react";

export function FacultyDashboardPage() {
    return (
        <main className="min-h-screen bg-slate-100 p-6 md:p-10">
            <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    <GraduationCap className="h-4 w-4" />
                    Faculty Area
                </div>
                <h1 className="mt-4 text-3xl font-semibold text-slate-800">Faculty Dashboard Placeholder</h1>
                <p className="mt-2 text-sm text-slate-600">
                    This route is ready for the faculty team. Build faculty pages inside src/features/faculty without touching student code.
                </p>
            </section>
        </main>
    );
}
