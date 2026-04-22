import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Tag,
    FileText,
    Image,
    PlusCircle,
    X,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import { Layout } from '../components/Layout';

interface FormData {
    title: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    category: string;
    maxAttendees: string;
    imageUrl: string;
}

const CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Academic'];

const INITIAL_FORM: FormData = {
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: '',
    maxAttendees: '',
    imageUrl: '',
};

export function CreateEvent() {
    const navigate = useNavigate();
    const [form, setForm] = useState<FormData>(INITIAL_FORM);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Partial<FormData>>({});

    const userRole = localStorage.getItem('userRole');

    // Route guard — redirect non-faculty/admin to home
    useEffect(() => {
        if (userRole !== 'faculty' && userRole !== 'admin') {
            navigate('/');
        }
    }, [userRole, navigate]);

    const validate = (): boolean => {
        const newErrors: Partial<FormData> = {};
        if (!form.title.trim()) newErrors.title = 'Event name is required';
        if (!form.description.trim()) newErrors.description = 'Description is required';
        if (!form.date) newErrors.date = 'Date is required';
        if (!form.time) newErrors.time = 'Time is required';
        if (!form.venue.trim()) newErrors.venue = 'Venue is required';
        if (!form.category) newErrors.category = 'Category is required';
        if (!form.maxAttendees || Number(form.maxAttendees) < 1)
            newErrors.maxAttendees = 'Enter a valid number of attendees';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Clear error on change
        if (errors[name as keyof FormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        // In real app: POST to API
        setSubmitted(true);
    };

    const handleReset = () => {
        setForm(INITIAL_FORM);
        setErrors({});
        setSubmitted(false);
    };

    // ── Success Screen ──
    if (submitted) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center py-28 text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Created!</h2>
                    <p className="text-gray-500 text-sm mb-2">
                        <span className="font-semibold text-[#1E3A8A]">"{form.title}"</span> has been submitted successfully.
                    </p>
                    <p className="text-gray-400 text-sm mb-8">
                        It will appear in the events list once approved.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={handleReset}
                            className="px-6 py-3 rounded-xl border-2 border-[#1E3A8A] text-[#1E3A8A] font-semibold text-sm hover:bg-blue-50 transition-colors"
                        >
                            Create Another
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 rounded-xl bg-[#1E3A8A] text-white font-semibold text-sm hover:bg-[#1e3a8aee] transition-colors shadow-md"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* ── Page Header ── */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <div className="bg-[#1E3A8A] p-2 rounded-xl">
                        <PlusCircle className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create New Event</h1>
                </div>
                <p className="text-gray-500 text-sm ml-12">
                    Fill in the details below to publish a new university event.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ── Form (left 2/3) ── */}
                <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">

                    {/* Event Name */}
                    <FormField
                        id="title"
                        label="Event Name"
                        icon={<FileText className="w-4 h-4 text-[#1E3A8A]" />}
                        error={errors.title}
                    >
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g. Inter-University Hackathon 2025"
                            className={inputClass(!!errors.title)}
                        />
                    </FormField>

                    {/* Description */}
                    <FormField
                        id="description"
                        label="Description"
                        icon={<FileText className="w-4 h-4 text-[#1E3A8A]" />}
                        error={errors.description}
                    >
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe the event, its purpose, and what participants can expect..."
                            className={`${inputClass(!!errors.description)} resize-none`}
                        />
                    </FormField>

                    {/* Date & Time row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            id="date"
                            label="Event Date"
                            icon={<Calendar className="w-4 h-4 text-[#1E3A8A]" />}
                            error={errors.date}
                        >
                            <input
                                id="date"
                                name="date"
                                type="date"
                                value={form.date}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                className={inputClass(!!errors.date)}
                            />
                        </FormField>

                        <FormField
                            id="time"
                            label="Start Time"
                            icon={<Clock className="w-4 h-4 text-[#1E3A8A]" />}
                            error={errors.time}
                        >
                            <input
                                id="time"
                                name="time"
                                type="time"
                                value={form.time}
                                onChange={handleChange}
                                className={inputClass(!!errors.time)}
                            />
                        </FormField>
                    </div>

                    {/* Venue */}
                    <FormField
                        id="venue"
                        label="Venue"
                        icon={<MapPin className="w-4 h-4 text-[#1E3A8A]" />}
                        error={errors.venue}
                    >
                        <input
                            id="venue"
                            name="venue"
                            type="text"
                            value={form.venue}
                            onChange={handleChange}
                            placeholder="e.g. Engineering Block, Lab 3"
                            className={inputClass(!!errors.venue)}
                        />
                    </FormField>

                    {/* Category & Max Attendees row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            id="category"
                            label="Category"
                            icon={<Tag className="w-4 h-4 text-[#1E3A8A]" />}
                            error={errors.category}
                        >
                            <select
                                id="category"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className={inputClass(!!errors.category)}
                            >
                                <option value="">Select a category</option>
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </FormField>

                        <FormField
                            id="maxAttendees"
                            label="Max Attendees"
                            icon={<Users className="w-4 h-4 text-[#1E3A8A]" />}
                            error={errors.maxAttendees}
                        >
                            <input
                                id="maxAttendees"
                                name="maxAttendees"
                                type="number"
                                min="1"
                                value={form.maxAttendees}
                                onChange={handleChange}
                                placeholder="e.g. 100"
                                className={inputClass(!!errors.maxAttendees)}
                            />
                        </FormField>
                    </div>

                    {/* Banner Image URL */}
                    <FormField
                        id="imageUrl"
                        label="Banner Image URL (optional)"
                        icon={<Image className="w-4 h-4 text-[#1E3A8A]" />}
                        error={errors.imageUrl}
                    >
                        <input
                            id="imageUrl"
                            name="imageUrl"
                            type="url"
                            value={form.imageUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/banner.jpg"
                            className={inputClass(!!errors.imageUrl)}
                        />
                    </FormField>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            type="submit"
                            id="create-event-btn"
                            className="flex-1 bg-[#1E3A8A] text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#1e3a8aee] transition-colors shadow-md hover:shadow-lg active:scale-[0.98]"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Create Event
                        </button>
                        <button
                            type="button"
                            id="cancel-event-btn"
                            onClick={() => navigate('/')}
                            className="flex-1 sm:flex-none sm:px-8 border-2 border-gray-200 text-gray-600 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:border-red-300 hover:text-red-500 transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                    </div>
                </form>

                {/* ── Sidebar Tips (right 1/3) ── */}
                <div className="lg:col-span-1 space-y-4">
                    {/* Preview Card */}
                    {form.imageUrl && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <img
                                src={form.imageUrl}
                                alt="Banner preview"
                                className="w-full h-36 object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                            <p className="text-xs text-center text-gray-400 py-2">Banner Preview</p>
                        </div>
                    )}

                    {/* Tips */}
                    <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                        <h3 className="font-semibold text-[#1E3A8A] mb-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Tips for a great event
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="text-[#FBBF24] mt-0.5">•</span>
                                Use a clear, descriptive event name
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#FBBF24] mt-0.5">•</span>
                                Include what participants will gain
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#FBBF24] mt-0.5">•</span>
                                Set a realistic capacity number
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#FBBF24] mt-0.5">•</span>
                                Add a high-quality banner image URL
                            </li>
                        </ul>
                    </div>

                    {/* Faculty badge */}
                    <div className="bg-[#FBBF24]/10 rounded-2xl p-4 border border-[#FBBF24]/30 flex items-center gap-3">
                        <div className="bg-[#FBBF24] p-2 rounded-lg">
                            <Users className="w-4 h-4 text-[#1E3A8A]" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-[#92400e]">Faculty Access</p>
                            <p className="text-xs text-gray-500">Only faculty &amp; admins can create events</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

// ── Reusable Field Wrapper ──
function FormField({
    id,
    label,
    icon,
    error,
    children,
}: {
    id: string;
    label: string;
    icon: React.ReactNode;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label htmlFor={id} className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                {icon}
                {label}
            </label>
            {children}
            {error && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </p>
            )}
        </div>
    );
}

const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl border text-sm text-gray-700 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${
        hasError
            ? 'border-red-400 focus:ring-red-200'
            : 'border-gray-200 focus:ring-[#1E3A8A]/30 focus:border-[#1E3A8A]'
    }`;
