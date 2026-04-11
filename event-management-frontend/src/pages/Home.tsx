import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Search, Calendar, MapPin, Users, ArrowRight, Filter, Zap } from 'lucide-react';
import { Layout } from '../components/Layout';
import { MOCK_EVENTS, categoryColors } from '../types/event';
import type { Event } from '../types/event';

const ALL_CATEGORIES = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Academic'] as const;
type FilterCategory = typeof ALL_CATEGORIES[number];

export function Home() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState<FilterCategory>('All');

    const filtered = useMemo(() => {
        return MOCK_EVENTS.filter((event) => {
            const matchesSearch =
                event.title.toLowerCase().includes(search.toLowerCase()) ||
                event.description.toLowerCase().includes(search.toLowerCase()) ||
                event.venue.toLowerCase().includes(search.toLowerCase());
            const matchesCategory =
                activeCategory === 'All' || event.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [search, activeCategory]);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        });
    };

    const getProgressPercent = (registered: number, max: number) =>
        Math.round((registered / max) * 100);

    return (
        <Layout>
            {/* ── Hero Section ── */}
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] rounded-2xl px-8 py-12 mb-8 text-white relative overflow-hidden">
                {/* decorative circles */}
                <div className="absolute -top-10 -right-10 w-56 h-56 bg-white/5 rounded-full" />
                <div className="absolute -bottom-16 -left-10 w-72 h-72 bg-white/5 rounded-full" />

                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
                        Discover &amp; Manage<br />University Events
                    </h1>
                    <p className="text-white/75 text-base mb-6">
                        Explore workshops, sports meets, cultural nights, and more happening across campus.
                    </p>
                    <button
                        onClick={() => document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="inline-flex items-center gap-2 bg-[#FBBF24] text-[#1E3A8A] font-semibold px-6 py-3 rounded-xl hover:bg-[#F59E0B] transition-all duration-200 shadow-lg"
                    >
                        <Zap className="w-4 h-4" />
                        Explore Events
                    </button>
                </div>

                {/* Stats row */}
                <div className="relative z-10 mt-8 flex flex-wrap gap-3">
                    {[
                        { label: 'Total Events', value: MOCK_EVENTS.length },
                        { label: 'Upcoming', value: MOCK_EVENTS.filter(e => e.status === 'upcoming').length },
                        { label: 'Total Registered', value: MOCK_EVENTS.reduce((s, e) => s + e.registeredCount, 0) },
                    ].map(stat => (
                        <div key={stat.label} className="bg-white/10 rounded-xl px-5 py-3 backdrop-blur-sm">
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-white/70 text-xs mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Search & Filters ── */}
            <div id="events-section" className="mb-6 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        id="event-search"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search events by name, venue..."
                        className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all"
                    />
                    <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>

                {/* Category Filter Chips */}
                <div className="flex flex-wrap gap-2">
                    {ALL_CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            id={`filter-${cat.toLowerCase()}`}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                activeCategory === cat
                                    ? 'bg-[#1E3A8A] text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A]'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Results Count ── */}
            <p className="text-sm text-gray-500 mb-5 bg-white px-4 py-2 rounded-full inline-flex border border-gray-100 shadow-sm">
                Showing <span className="font-semibold text-gray-700">{filtered.length}</span> event{filtered.length !== 1 ? 's' : ''}
                {activeCategory !== 'All' && <> in <span className="font-semibold text-[#1E3A8A]">{activeCategory}</span></>}
            </p>

            {/* ── Event Cards Grid ── */}
            {filtered.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No events found</h3>
                    <p className="text-gray-500 text-sm">Try adjusting your search or filter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((event: Event) => {
                        const pct = getProgressPercent(event.registeredCount, event.maxAttendees);
                        const colors = categoryColors[event.category];
                        return (
                            <div
                                key={event.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
                            >
                                {/* Card Image */}
                                <div className="relative h-44 overflow-hidden">
                                    <img
                                        src={event.imageUrl}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Category Badge */}
                                    <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                                        {event.category}
                                    </span>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-bold text-gray-900 text-base mb-1.5 line-clamp-2 leading-snug">
                                        {event.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                                        {event.description}
                                    </p>

                                    {/* Meta Info */}
                                    <div className="space-y-1.5 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                                            <span>{formatDate(event.date)} · {event.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPin className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                                            <span className="truncate">{event.venue}</span>
                                        </div>
                                    </div>

                                    {/* Registration Progress */}
                                    <div className="mb-5 mt-auto">
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3.5 h-3.5" />
                                                {event.registeredCount}/{event.maxAttendees} registered
                                            </span>
                                            <span className="font-semibold text-[#1E3A8A]">{pct}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div
                                                className="bg-[#FBBF24] h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* View Details Button */}
                                    <button
                                        id={`view-event-${event.id}`}
                                        onClick={() => navigate(`/events/${event.id}`)}
                                        className="w-full bg-[#1E3A8A] text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#1e3a8aee] transition-colors group"
                                    >
                                        View Details
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Layout>
    );
}
