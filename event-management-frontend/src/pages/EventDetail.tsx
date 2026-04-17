import { useParams, useNavigate } from 'react-router';
import {
    Calendar,
    MapPin,
    Users,
    Clock,
    User,
    ArrowLeft,
    CheckCircle,
    Tag,
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { MOCK_EVENTS, categoryColors } from '../types/event';

export function EventDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const event = MOCK_EVENTS.find((e) => e.id === Number(id));

    if (!event) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center py-32 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <Calendar className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
                    <p className="text-gray-500 mb-6">The event you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 bg-[#1E3A8A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1e3a8aee] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Events
                    </button>
                </div>
            </Layout>
        );
    }

    const pct = Math.round((event.registeredCount / event.maxAttendees) * 100);
    const seatsLeft = event.maxAttendees - event.registeredCount;
    const colors = categoryColors[event.category];
    const isFull = seatsLeft <= 0;

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        });

    return (
        <Layout>
            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-500 hover:text-[#1E3A8A] text-sm font-medium mb-6 transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to Events
            </button>

            {/* ── Hero Banner ── */}
            <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-lg">
                <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Category Badge */}
                <span className={`absolute top-5 left-5 text-xs font-semibold px-3 py-1.5 rounded-full ${colors.bg} ${colors.text}`}>
                    {event.category}
                </span>

                {/* Title on image */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
                        {event.title}
                    </h1>
                    <p className="text-white/75 text-sm flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Organized by {event.organizer}
                    </p>
                </div>
            </div>

            {/* ── Two Column Layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT — About Section */}
                <div className="lg:col-span-2 space-y-6">

                    {/* About */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-3">About this Event</h2>
                        <p className="text-gray-600 leading-relaxed">{event.description}</p>
                    </div>

                    {/* Event Details Grid */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Event Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                {
                                    icon: <Calendar className="w-5 h-5 text-[#1E3A8A]" />,
                                    label: 'Date',
                                    value: formatDate(event.date),
                                },
                                {
                                    icon: <Clock className="w-5 h-5 text-[#1E3A8A]" />,
                                    label: 'Time',
                                    value: event.time,
                                },
                                {
                                    icon: <MapPin className="w-5 h-5 text-[#1E3A8A]" />,
                                    label: 'Venue',
                                    value: event.venue,
                                },
                                {
                                    icon: <User className="w-5 h-5 text-[#1E3A8A]" />,
                                    label: 'Organizer',
                                    value: event.organizer,
                                },
                                {
                                    icon: <Tag className="w-5 h-5 text-[#1E3A8A]" />,
                                    label: 'Category',
                                    value: event.category,
                                },
                                {
                                    icon: <Users className="w-5 h-5 text-[#1E3A8A]" />,
                                    label: 'Total Capacity',
                                    value: `${event.maxAttendees} participants`,
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                                >
                                    <div className="bg-white p-2 rounded-lg shadow-sm shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium mb-0.5">{item.label}</p>
                                        <p className="text-sm text-gray-800 font-semibold">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT — Registration Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24 space-y-5">
                        <h2 className="text-lg font-bold text-gray-900">Registration</h2>

                        {/* Progress */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500 flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    Registered
                                </span>
                                <span className="font-bold text-[#1E3A8A]">
                                    {event.registeredCount} / {event.maxAttendees}
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 mb-1">
                                <div
                                    className={`h-3 rounded-full transition-all duration-500 ${pct >= 90 ? 'bg-red-500' : 'bg-[#FBBF24]'}`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <p className="text-right text-xs text-gray-400">{pct}% filled</p>
                        </div>

                        {/* Seats Left */}
                        <div className={`rounded-xl px-4 py-3 flex items-center gap-3 ${isFull ? 'bg-red-50' : 'bg-blue-50'}`}>
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isFull ? 'bg-red-100' : 'bg-[#1E3A8A]/10'}`}>
                                <Users className={`w-5 h-5 ${isFull ? 'text-red-500' : 'text-[#1E3A8A]'}`} />
                            </div>
                            <div>
                                <p className={`font-bold text-lg leading-tight ${isFull ? 'text-red-600' : 'text-[#1E3A8A]'}`}>
                                    {isFull ? 'Fully Booked' : `${seatsLeft} seats left`}
                                </p>
                                <p className="text-xs text-gray-500">out of {event.maxAttendees} total</p>
                            </div>
                        </div>

                        {/* Register Button */}
                        <button
                            id="register-btn"
                            disabled={isFull}
                            className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                                isFull
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#1E3A8A] text-white hover:bg-[#1e3a8aee] shadow-md hover:shadow-lg active:scale-[0.98]'
                            }`}
                        >
                            <CheckCircle className="w-4 h-4" />
                            {isFull ? 'Registration Closed' : 'Register for Event'}
                        </button>

                        {!isFull && (
                            <p className="text-xs text-center text-gray-400">
                                Free registration · No credit card required
                            </p>
                        )}

                        {/* Quick Info */}
                        <div className="border-t border-gray-100 pt-4 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                                {event.time}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                                {event.venue}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
