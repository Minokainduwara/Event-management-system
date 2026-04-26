import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrganizerLayout from "../../shared/ui/OrganizerLayout";
import { eventsApi, categoriesApi, type Category } from "../../shared/api/organizerApi";

export default function CreateEventPage() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [form, setForm] = useState({
        event_title: "",
        description: "",
        event_date: "",
        event_time: "",
        location: "",
        category_id: 0,
        max_participants: "",
        image: "",
    });

    useEffect(() => {
        categoriesApi.getAll().then(cats => {
            setCategories(cats);
            if (cats.length > 0) setForm(f => ({ ...f, category_id: cats[0].category_id }));
        });
    }, []);

    const set = (field: string, value: string | number) =>
        setForm(f => ({ ...f, [field]: value }));

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.event_title.trim()) errs.event_title = "Event name is required";
        if (!form.description.trim()) errs.description = "Description is required";
        if (!form.event_date) errs.event_date = "Date is required";
        if (!form.event_time) errs.event_time = "Time is required";
        if (!form.location.trim()) errs.location = "Venue is required";
        if (!form.max_participants || Number(form.max_participants) < 1)
            errs.max_participants = "Must be at least 1";
        if (!form.category_id) errs.category_id = "Category is required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);
        try {
            await eventsApi.create({
                event_title: form.event_title,
                description: form.description,
                event_date: form.event_date,
                event_time: form.event_time,
                location: form.location,
                max_participants: Number(form.max_participants),
                category_id: form.category_id,
                image: form.image || undefined,
            });
            setSuccess(true);
            setTimeout(() => navigate("/organizer/my-events"), 2000);
        } catch {
            alert("Failed to create event. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // Styles
    const inputStyle = (hasError: boolean) => ({
        width: "100%",
        padding: "12px 16px",
        borderRadius: "10px",
        border: `1.5px solid ${hasError ? "#ef4444" : "#e5e7eb"}`,
        outline: "none",
        fontSize: "15px",
        color: "#374151",
        boxSizing: "border-box" as const,
        fontFamily: "inherit",
        background: "#fff",
        transition: "border-color 0.2s",
    });

    const labelStyle = {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontWeight: 700,
        color: "#1e3a8a",
        fontSize: "14px",
        marginBottom: "8px",
    };

    if (success) {
        return (
            <OrganizerLayout>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎉</div>
                        <h2 style={{ color: "#1e3a8a", fontSize: "24px", fontWeight: 800 }}>Event Created Successfully!</h2>
                        <p style={{ color: "#6b7280", marginTop: "8px" }}>Redirecting to My Events...</p>
                        <div style={{
                            marginTop: "20px", width: "200px", height: "4px",
                            background: "#e5e7eb", borderRadius: "2px", margin: "20px auto 0",
                            overflow: "hidden",
                        }}>
                            <div style={{
                                height: "100%", background: "#1e40af", borderRadius: "2px",
                                animation: "progress 2s linear forwards",
                            }} />
                        </div>
                    </div>
                </div>
            </OrganizerLayout>
        );
    }

    return (
        <OrganizerLayout>
            <div style={{ padding: "48px", maxWidth: "800px", margin: "0 auto" }}>
                {/* Header */}
                <div style={{ marginBottom: "32px" }}>
                    <h1 style={{ margin: 0, color: "#1e3a8a", fontSize: "28px", fontWeight: 800 }}>
                        Create New Event
                    </h1>
                    <p style={{ color: "#6b7280", marginTop: "6px" }}>
                        Fill in the details to create a new university event
                    </p>
                </div>

                {/* Form Card */}
                <div style={{
                    background: "#fff",
                    borderRadius: "20px",
                    padding: "36px",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                }}>
                    {/* Event Name */}
                    <div style={{ marginBottom: "24px" }}>
                        <label style={labelStyle}>
                            <span style={{ fontSize: "16px" }}>🔤</span> Event Name *
                        </label>
                        <input
                            style={inputStyle(!!errors.event_title)}
                            placeholder="Enter event name"
                            value={form.event_title}
                            onChange={e => set("event_title", e.target.value)}
                            onFocus={e => (e.target.style.borderColor = "#2563eb")}
                            onBlur={e => (e.target.style.borderColor = errors.event_title ? "#ef4444" : "#e5e7eb")}
                        />
                        {errors.event_title && (
                            <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>⚠ {errors.event_title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: "24px" }}>
                        <label style={labelStyle}>
                            <span style={{ fontSize: "16px" }}>📝</span> Description *
                        </label>
                        <textarea
                            style={{ ...inputStyle(!!errors.description), height: "120px", resize: "vertical" }}
                            placeholder="Describe your event..."
                            value={form.description}
                            onChange={e => set("description", e.target.value)}
                            onFocus={e => (e.target.style.borderColor = "#2563eb")}
                            onBlur={e => (e.target.style.borderColor = errors.description ? "#ef4444" : "#e5e7eb")}
                        />
                        {errors.description && (
                            <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>⚠ {errors.description}</p>
                        )}
                    </div>

                    {/* Date & Time */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                        <div>
                            <label style={labelStyle}>
                                <span style={{ fontSize: "16px" }}>📅</span> Date *
                            </label>
                            <input
                                type="date"
                                style={inputStyle(!!errors.event_date)}
                                value={form.event_date}
                                min={new Date().toISOString().split("T")[0]}
                                onChange={e => set("event_date", e.target.value)}
                                onFocus={e => (e.target.style.borderColor = "#2563eb")}
                                onBlur={e => (e.target.style.borderColor = errors.event_date ? "#ef4444" : "#e5e7eb")}
                            />
                            {errors.event_date && (
                                <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>⚠ {errors.event_date}</p>
                            )}
                        </div>
                        <div>
                            <label style={labelStyle}>
                                <span style={{ fontSize: "16px" }}>⏰</span> Time *
                            </label>
                            <input
                                type="time"
                                style={inputStyle(!!errors.event_time)}
                                value={form.event_time}
                                onChange={e => set("event_time", e.target.value)}
                                onFocus={e => (e.target.style.borderColor = "#2563eb")}
                                onBlur={e => (e.target.style.borderColor = errors.event_time ? "#ef4444" : "#e5e7eb")}
                            />
                            {errors.event_time && (
                                <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>⚠ {errors.event_time}</p>
                            )}
                        </div>
                    </div>

                    {/* Venue */}
                    <div style={{ marginBottom: "24px" }}>
                        <label style={labelStyle}>
                            <span style={{ fontSize: "16px" }}>📍</span> Venue *
                        </label>
                        <input
                            style={inputStyle(!!errors.location)}
                            placeholder="Enter venue location"
                            value={form.location}
                            onChange={e => set("location", e.target.value)}
                            onFocus={e => (e.target.style.borderColor = "#2563eb")}
                            onBlur={e => (e.target.style.borderColor = errors.location ? "#ef4444" : "#e5e7eb")}
                        />
                        {errors.location && (
                            <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>⚠ {errors.location}</p>
                        )}
                    </div>

                    {/* Category & Max Attendees */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                        <div>
                            <label style={labelStyle}>
                                <span style={{ fontSize: "16px" }}>🏷</span> Category *
                            </label>
                            <select
                                style={inputStyle(!!errors.category_id)}
                                value={form.category_id}
                                onChange={e => set("category_id", Number(e.target.value))}
                                onFocus={e => (e.target.style.borderColor = "#2563eb")}
                                onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                            >
                                {categories.length === 0 && <option>Loading...</option>}
                                {categories.map(c => (
                                    <option key={c.category_id} value={c.category_id}>
                                        {c.category_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>
                                <span style={{ fontSize: "16px" }}>👥</span> Max Attendees *
                            </label>
                            <input
                                type="number"
                                style={inputStyle(!!errors.max_participants)}
                                placeholder="e.g., 100"
                                value={form.max_participants}
                                min={1}
                                onChange={e => set("max_participants", e.target.value)}
                                onFocus={e => (e.target.style.borderColor = "#2563eb")}
                                onBlur={e => (e.target.style.borderColor = errors.max_participants ? "#ef4444" : "#e5e7eb")}
                            />
                            {errors.max_participants && (
                                <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>⚠ {errors.max_participants}</p>
                            )}
                        </div>
                    </div>

                    {/* Event Image URL */}
                    <div style={{ marginBottom: "32px" }}>
                        <label style={labelStyle}>
                            <span style={{ fontSize: "16px" }}>🖼</span> Event Image URL
                        </label>
                        <input
                            style={inputStyle(false)}
                            placeholder="https://example.com/image.jpg"
                            value={form.image}
                            onChange={e => set("image", e.target.value)}
                            onFocus={e => (e.target.style.borderColor = "#2563eb")}
                            onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                        />
                        <p style={{ color: "#9ca3af", fontSize: "12px", marginTop: "6px" }}>
                            Optional: Provide a URL for the event banner image
                        </p>

                        {/* Image Preview */}
                        {form.image && (
                            <div style={{ marginTop: "12px", borderRadius: "12px", overflow: "hidden", maxHeight: "200px" }}>
                                <img
                                    src={form.image}
                                    alt="Preview"
                                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                                    onError={e => ((e.target as HTMLImageElement).style.display = "none")}
                                />
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: "16px" }}>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            style={{
                                flex: 3,
                                padding: "15px",
                                background: submitting
                                    ? "#93c5fd"
                                    : "linear-gradient(135deg, #1e3a8a, #2563eb)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "16px",
                                fontWeight: 700,
                                cursor: submitting ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                transition: "all 0.2s",
                                boxShadow: submitting ? "none" : "0 4px 15px rgba(37,99,235,0.3)",
                            }}
                        >
                            {submitting ? "⏳ Creating Event..." : "🎉 Create Event"}
                        </button>
                        <button
                            onClick={() => navigate("/organizer")}
                            style={{
                                flex: 1,
                                padding: "15px",
                                background: "#fff",
                                color: "#374151",
                                border: "1.5px solid #e5e7eb",
                                borderRadius: "12px",
                                fontSize: "15px",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s",
                            }}
                            onMouseOver={e => (e.currentTarget.style.borderColor = "#d1d5db")}
                            onMouseOut={e => (e.currentTarget.style.borderColor = "#e5e7eb")}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </OrganizerLayout>
    );
}