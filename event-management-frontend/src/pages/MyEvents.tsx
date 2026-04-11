import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
    Calendar,
    MapPin,
    Clock,
    ArrowRight,
    Search,
    CalendarDays,
    CheckCircle2,
    Hourglass,
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { MOCK_EVENTS, categoryColors } from '../types/event';
import type { Event } from '../types/event';

type Tab = 'all' | 'upcoming' | 'completed';

// Simulate: current user has registered for events with id 1, 3, 4
const MY_EVENT_IDS = [1, 3, 4];

export function MyEvents() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('all');

    const userName = localStorage.getItem('userName') || 'User';

    // Filter to only "my" registered events
    const myEvents: Event[] = MOCK_EVENTS.filter((e) => MY_EVENT_IDS.includes(e.id));

    const filteredEvents = myEvents.filter((e) => {
        if (activeTab === 'upcoming') return e.status === 'upcoming';
        if (activeTab === 'completed') return e.status === 'completed';
        return true;
    });

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        });

    const tabs: { key: Tab; label: string; icon: React.ReactNode; count: number }[] = [
        {
            key: 'all',
            label: 'All Events',
            icon: <CalendarDays className="w-4 h-4" />,
            count: myEvents.length,
        },
        {
            key: 'upcoming',
            label: 'Upcoming',
            icon: <Hourglass className="w-4 h-4" />,
            count: myEvents.filter((e) => e.status === 'upcoming').length,
        },
        {
            key: 'completed',
            label: 'Completed',
            icon: <CheckCircle2 className="w-4 h-4" />,
            count: myEvents.filter((e) => e.status === 'completed').length,
        },
    ];

    return (
        <Layout>
            {/* ── Page Header ── */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">My Events</h1>
                <p className="text-gray-500 text-sm">
                    Welcome back, <span className="font-semibold text-[#1E3A8A]">{userName}</span> — here are all events you've registered for.
                </p>
            </div>

            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                    {
                        label: 'Total Registered',
                        value: myEvents.length,
                        icon: <CalendarDays className="w-5 h-5 text-[#1E3A8A]" />,
                        bg: 'bg-blue-50',
                    },
                    {
                        label: 'Upcoming',
                        value: myEvents.filter((e) => e.status === 'upcoming').length,
                        icon: <Hourglass className="w-5 h-5 text-[#FBBF24]" />,
                        bg: 'bg-yellow-50',
                    },
                    {
                        label: 'Completed',
                        value: myEvents.filter((e) => e.status === 'completed').length,
                        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
                        bg: 'bg-green-50',
                    },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className={`${stat.bg} rounded-2xl p-4 border border-white shadow-sm flex items-center gap-4`}
                    >
                        <div className="bg-white w-10 h-10 rounded-xl shadow-sm flex items-center justify-center shrink-0">
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Tab Switcher ── */}
            <div className="flex gap-2 mb-6 bg-gray-100 p-1.5 rounded-xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        id={`tab-${tab.key}`}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            activeTab === tab.key
                                ? 'bg-white text-[#1E3A8A] shadow-sm font-semibold'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                        <span
                            className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                                activeTab === tab.key
                                    ? 'bg-[#1E3A8A] text-white'
                                    : 'bg-gray-200 text-gray-500'
                            }`}
                        >
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* ── Events List ── */}
            {filteredEvents.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5">
                        <Search className="w-9 h-9 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">
                        No {activeTab === 'all' ? '' : activeTab} events yet
                    </h3>
                    <p className="text-gray-400 text-sm mb-6 max-w-xs">
                        {activeTab === 'completed'
                            ? "You haven't completed any events yet. Check your upcoming events!"
                            : "You haven't registered for any events yet. Browse and join one!"}
                    </p>
                    <button
                        id="browse-events-btn"
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 bg-[#1E3A8A] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#1e3a8aee] transition-colors shadow-md"
                    >
                        Browse Events
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredEvents.map((event) => {
                        const colors = categoryColors[event.category];
                        const pct = Math.round((event.registeredCount / event.maxAttendees) * 100);
                        return (
                            <div
                                key={event.id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col sm:flex-row"
                            >
                                {/* Thumbnail */}
                                <div className="sm:w-48 h-40 sm:h-auto shrink-0 relative overflow-hidden">
                                    <img
                                        src={event.imageUrl}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Status badge */}
                                    <span
                                        className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
                                            event.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}
                                    >
                                        {event.status === 'completed' ? '✓ Completed' : '⏳ Upcoming'}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-5 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <h3 className="font-bold text-gray-900 text-base leading-snug">
                                                {event.title}
                                            </h3>
                                            <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                                                {event.category}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-gray-500 mb-3">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-[#1E3A8A]" />
                                                {formatDate(event.date)}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-[#1E3A8A]" />
                                                {event.time}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-[#1E3A8A]" />
                                                {event.venue}
                                            </span>
                                        </div>

                                        {/* Mini progress bar */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                                                <div
                                                    className="bg-[#FBBF24] h-1.5 rounded-full"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-400 shrink-0">
                                                {event.registeredCount}/{event.maxAttendees}
                                            </span>
                                        </div>
                                    </div>

                                    {/* View Details */}
                                    <div className="mt-4">
                                        <button
                                            id={`my-event-detail-${event.id}`}
                                            onClick={() => navigate(`/events/${event.id}`)}
                                            className="flex items-center gap-1.5 text-sm font-semibold text-[#1E3A8A] hover:text-[#2563EB] transition-colors group"
                                        >
                                            View Details
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Layout>
    );
}
