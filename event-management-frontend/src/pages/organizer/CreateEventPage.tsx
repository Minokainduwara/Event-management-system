import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrganizerLayout from "../../shared/ui/OrganizerLayout";
import { apiFetch } from "../../utils/apiFetch";

type Category = {
    category_id: number;
    category_name: string;
};

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

    // ================= GET CATEGORIES =================
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await apiFetch(
                    "http://localhost:8080/api/category/getCategories"
                );
                const data = await res.json();
                setCategories(data);

                if (data.length > 0) {
                    setForm(f => ({ ...f, category_id: data[0].category_id }));
                }
            } catch (err) {
                console.error("Failed to load categories", err);
            }
        };

        loadCategories();
    }, []);

    const set = (field: keyof typeof form, value: string | number) =>
        setForm(f => ({ ...f, [field]: value }));

    // ================= VALIDATION =================
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

    // ================= SUBMIT =================
    const handleSubmit = async () => {
        if (!validate()) return;

        setSubmitting(true);

        try {
            const res = await apiFetch(
                "http://localhost:8080/api/events/saveEvent",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        event_title: form.event_title,
                        description: form.description,
                        event_date: form.event_date,
                        event_time: form.event_time,
                        location: form.location,
                        max_participants: Number(form.max_participants),
                        category_id: form.category_id,
                        image: form.image || null,
                    }),
                }
            );

            if (!res.ok) throw new Error("Failed");

            setSuccess(true);
            setTimeout(() => navigate("/organizer/my-events"), 2000);
        } catch (err: unknown) {
            console.error(err);
            alert("Failed to create event");
        } finally {
            setSubmitting(false);
        }
    };

    // ================= UI (unchanged) =================
    if (success) {
        return (
            <OrganizerLayout>
                <div style={{ textAlign: "center", marginTop: "100px" }}>
                    <h2>🎉 Event Created Successfully!</h2>
                </div>
            </OrganizerLayout>
        );
    }

    return (
        <OrganizerLayout>
            <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
                <h1>Create Event</h1>

                {/* EVENT TITLE */}
                <input
                    placeholder="Event Title"
                    value={form.event_title}
                    onChange={(e) => set("event_title", e.target.value)}
                />
                {errors.event_title && <p>{errors.event_title}</p>}

                {/* DESCRIPTION */}
                <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                />

                {/* DATE */}
                <input
                    type="date"
                    value={form.event_date}
                    onChange={(e) => set("event_date", e.target.value)}
                />

                {/* TIME */}
                <input
                    type="time"
                    value={form.event_time}
                    onChange={(e) => set("event_time", e.target.value)}
                />

                {/* LOCATION */}
                <input
                    placeholder="Location"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                />

                {/* CATEGORY */}
                <select
                    value={form.category_id}
                    onChange={(e) => set("category_id", Number(e.target.value))}
                >
                    {categories.map((c) => (
                        <option key={c.category_id} value={c.category_id}>
                            {c.category_name}
                        </option>
                    ))}
                </select>

                {/* MAX PARTICIPANTS */}
                <input
                    type="number"
                    placeholder="Max Participants"
                    value={form.max_participants}
                    onChange={(e) => set("max_participants", e.target.value)}
                />

                {/* IMAGE */}
                <input
                    placeholder="Image URL"
                    value={form.image}
                    onChange={(e) => set("image", e.target.value)}
                />

                {/* BUTTON */}
                <button onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "Creating..." : "Create Event"}
                </button>
            </div>
        </OrganizerLayout>
    );
}