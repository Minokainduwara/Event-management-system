import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import {
    CalendarDays,
    Users,
    TrendingUp,
    Star,
    BarChart3,
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { MOCK_EVENTS } from '../types/event';

// ── Mock analytics data ──
const participationTrends = [
    { month: 'Jan', participants: 120 },
    { month: 'Feb', participants: 198 },
    { month: 'Mar', participants: 145 },
    { month: 'Apr', participants: 280 },
    { month: 'May', participants: 390 },
    { month: 'Jun', participants: 310 },
    { month: 'Jul', participants: 420 },
];

const categoryData = [
    { name: 'Technical',  value: 35, color: '#3B82F6' },
    { name: 'Cultural',   value: 25, color: '#8B5CF6' },
    { name: 'Sports',     value: 20, color: '#10B981' },
    { name: 'Workshop',   value: 15, color: '#14B8A6' },
    { name: 'Academic',   value: 5,  color: '#F59E0B' },
];

const departmentAttendance = [
    { dept: 'Engineering', attended: 320, registered: 380 },
    { dept: 'IT',          attended: 210, registered: 250 },
    { dept: 'Business',    attended: 180, registered: 200 },
    { dept: 'Arts',        attended: 140, registered: 170 },
    { dept: 'Science',     attended: 95,  registered: 120 },
    { dept: 'Medicine',    attended: 60,  registered: 80  },
];

const totalParticipants = MOCK_EVENTS.reduce((s, e) => s + e.registeredCount, 0);
const avgAttendance = Math.round(totalParticipants / MOCK_EVENTS.length);

const STAT_CARDS = [
    {
        label: 'Total Events',
        value: MOCK_EVENTS.length,
        icon: <CalendarDays className="w-5 h-5 text-[#1E3A8A]" />,
        bg: 'bg-blue-50',
        iconBg: 'bg-[#1E3A8A]/10',
        change: '+2 this month',
        positive: true,
    },
    {
        label: 'Total Participants',
        value: totalParticipants,
        icon: <Users className="w-5 h-5 text-purple-600" />,
        bg: 'bg-purple-50',
        iconBg: 'bg-purple-100',
        change: '+18% vs last month',
        positive: true,
    },
    {
        label: 'Avg Attendance',
        value: avgAttendance,
        icon: <TrendingUp className="w-5 h-5 text-teal-600" />,
        bg: 'bg-teal-50',
        iconBg: 'bg-teal-100',
        change: '+5% vs last month',
        positive: true,
    },
    {
        label: 'Top Rated Event',
        value: '4.8 ★',
        icon: <Star className="w-5 h-5 text-[#FBBF24]" />,
        bg: 'bg-yellow-50',
        iconBg: 'bg-yellow-100',
        change: 'Hackathon 2025',
        positive: true,
    },
];

// Custom tooltip for pie charts
const PieTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-2 text-sm">
                <p className="font-semibold text-gray-700">{payload[0].name}</p>
                <p className="text-[#1E3A8A] font-bold">{payload[0].value}%</p>
            </div>
        );
    }
    return null;
};

export function Analytics() {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    // Route guard
    useEffect(() => {
        if (userRole !== 'faculty' && userRole !== 'admin') {
            navigate('/');
        }
    }, [userRole, navigate]);

    return (
        <Layout>
            {/* ── Page Header ── */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <div className="bg-[#1E3A8A] p-2 rounded-xl">
                        <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                </div>
                <p className="text-gray-500 text-sm ml-12">
                    Overview of event performance, participation trends, and department engagement.
                </p>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {STAT_CARDS.map((card) => (
                    <div
                        key={card.label}
                        className={`${card.bg} rounded-2xl p-5 border border-white shadow-sm`}
                    >
                        <div className={`${card.iconBg} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
                            {card.icon}
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-0.5">{card.value}</p>
                        <p className="text-xs text-gray-500 mb-2">{card.label}</p>
                        <p className={`text-xs font-medium ${card.positive ? 'text-green-600' : 'text-red-500'}`}>
                            {card.positive ? '↑' : '↓'} {card.change}
                        </p>
                    </div>
                ))}
            </div>

            {/* ── Charts Row 1: Line + Pie ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                {/* Line Chart — Participation Trends */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-1">Event Participation Trends</h2>
                    <p className="text-xs text-gray-400 mb-5">Monthly participant count across all events</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={participationTrends} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                            <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="participants"
                                stroke="#1E3A8A"
                                strokeWidth={3}
                                dot={{ fill: '#1E3A8A', r: 5, strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 7, fill: '#FBBF24' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart — Category Distribution */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-1">Event Categories</h2>
                    <p className="text-xs text-gray-400 mb-4">Distribution by category</p>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {categoryData.map((entry) => (
                                    <Cell key={entry.name} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<PieTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Legend */}
                    <div className="mt-3 space-y-1.5">
                        {categoryData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1.5">
                                    <span
                                        className="w-2.5 h-2.5 rounded-full shrink-0"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-gray-600">{item.name}</span>
                                </span>
                                <span className="font-semibold text-gray-700">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Chart Row 2: Bar — Attendance by Department ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-900 mb-1">Attendance by Department</h2>
                <p className="text-xs text-gray-400 mb-5">Registered vs. actual attendance per department</p>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={departmentAttendance} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                        <XAxis dataKey="dept" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
                        />
                        <Bar dataKey="registered" name="Registered" fill="#BFDBFE" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="attended"   name="Attended"   fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Layout>
    );
}
