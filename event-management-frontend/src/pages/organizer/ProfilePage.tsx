import { useEffect, useState } from "react";
import OrganizerLayout from "../../shared/ui/OrganizerLayout";
import { profileApi, type User } from "../../shared/api/organizerApi";

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [tab, setTab] = useState<"profile" | "password">("profile");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "", email: "", phone: "", department: "", year: "",
    });

    const [pwForm, setPwForm] = useState({
        currentPassword: "", newPassword: "", confirmPassword: "",
    });

    const [pwErrors, setPwErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        profileApi.get()
            .then(u => {
                setUser(u);
                setForm({
                    name: u.name || "",
                    email: u.email || "",
                    phone: u.phone || "",
                    department: u.department || "",
                    year: u.year || "",
                });
            })
            .catch(() => setError("Failed to load profile."))
            .finally(() => setLoading(false));
    }, []);

    const handleSaveProfile = async () => {
        setSaving(true);
        setSuccess(""); setError("");
        try {
            const updated = await profileApi.update(form);
            setUser(updated);
            // Update localStorage too
            const stored = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({ ...stored, ...form }));
            setSuccess("Profile updated successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch {
            setError("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        const errs: Record<string, string> = {};
        if (!pwForm.currentPassword) errs.currentPassword = "Required";
        if (!pwForm.newPassword || pwForm.newPassword.length < 6)
            errs.newPassword = "At least 6 characters";
        if (pwForm.newPassword !== pwForm.confirmPassword)
            errs.confirmPassword = "Passwords don't match";
        setPwErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setSaving(true); setSuccess(""); setError("");
        try {
            await profileApi.changePassword({
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword,
            });
            setSuccess("Password changed successfully!");
            setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setTimeout(() => setSuccess(""), 3000);
        } catch {
            setError("Failed to change password. Check your current password.");
        } finally {
            setSaving(false);
        }
    };

    const inputStyle = (hasError?: boolean) => ({
        width: "100%",
        padding: "12px 14px",
        borderRadius: "10px",
        border: `1.5px solid ${hasError ? "#ef4444" : "#e5e7eb"}`,
        outline: "none",
        fontSize: "14px",
        color: "#374151",
        boxSizing: "border-box" as const,
        fontFamily: "inherit",
        background: "#fff",
        transition: "border-color 0.2s",
    });

    const labelStyle = {
        display: "block" as const,
        fontWeight: 700,
        color: "#374151",
        fontSize: "13px",
        marginBottom: "6px",
    };

    if (loading) {
        return (
            <OrganizerLayout>
                <div style={{ textAlign: "center", padding: "120px", color: "#6b7280" }}>⏳ Loading profile...</div>
            </OrganizerLayout>
        );
    }

    const initials = (user?.name || "U").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

    return (
        <OrganizerLayout>
            <div style={{ padding: "40px 48px", maxWidth: "800px" }}>
                {/* Header with avatar */}
                <div style={{
                    background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
                    borderRadius: "20px",
                    padding: "32px",
                    marginBottom: "28px",
                    display: "flex",
                    alignItems: "center",
                    gap: "24px",
                    boxShadow: "0 4px 20px rgba(30,58,138,0.3)",
                }}>
                    <div style={{
                        width: "80px", height: "80px", borderRadius: "50%",
                        background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "28px", fontWeight: 800, color: "#fff",
                        border: "3px solid rgba(255,255,255,0.3)",
                        flexShrink: 0,
                    }}>
                        {initials}
                    </div>
                    <div>
                        <h1 style={{ margin: 0, color: "#fff", fontSize: "24px", fontWeight: 800 }}>
                            {user?.name || "Organizer"}
                        </h1>
                        <div style={{ color: "rgba(255,255,255,0.7)", marginTop: "4px", fontSize: "14px" }}>
                            {user?.role || "Faculty"} · {user?.department || "University"}
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.6)", marginTop: "2px", fontSize: "13px" }}>
                            {user?.email}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{
                    display: "flex", background: "#fff", borderRadius: "14px",
                    padding: "6px", marginBottom: "24px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                    width: "fit-content",
                }}>
                    {[
                        { key: "profile", label: "👤 Edit Profile" },
                        { key: "password", label: "🔒 Change Password" },
                    ].map(t => (
                        <button
                            key={t.key}
                            onClick={() => { setTab(t.key as any); setSuccess(""); setError(""); }}
                            style={{
                                padding: "10px 24px",
                                borderRadius: "10px",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: 600,
                                transition: "all 0.2s",
                                background: tab === t.key
                                    ? "linear-gradient(135deg, #1e3a8a, #2563eb)"
                                    : "transparent",
                                color: tab === t.key ? "#fff" : "#6b7280",
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Alerts */}
                {success && (
                    <div style={{
                        background: "#d1fae5", border: "1px solid #6ee7b7",
                        borderRadius: "12px", padding: "14px 20px",
                        color: "#065f46", marginBottom: "20px",
                        display: "flex", alignItems: "center", gap: "8px",
                    }}>
                        ✅ {success}
                    </div>
                )}
                {error && (
                    <div style={{
                        background: "#fee2e2", border: "1px solid #fca5a5",
                        borderRadius: "12px", padding: "14px 20px",
                        color: "#991b1b", marginBottom: "20px",
                    }}>
                        ⚠ {error}
                    </div>
                )}

                {/* Profile Form */}
                {tab === "profile" && (
                    <div style={{
                        background: "#fff", borderRadius: "20px", padding: "32px",
                        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                    }}>
                        <h2 style={{ margin: "0 0 24px", color: "#1e3a8a", fontSize: "18px", fontWeight: 700 }}>
                            Personal Information
                        </h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                            {/* Name & Email */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
                                <div>
                                    <label style={labelStyle}>Full Name *</label>
                                    <input
                                        style={inputStyle()}
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        onFocus={e => (e.target.style.borderColor = "#2563eb")}
                                        onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Email Address *</label>
                                    <input
                                        type="email"
                                        style={inputStyle()}
                                        value={form.email}
                                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        onFocus={e => (e.target.style.borderColor = "#2563eb")}
                                        onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label style={labelStyle}>Phone Number</label>
                                <input
                                    type="tel"
                                    style={inputStyle()}
                                    placeholder="+1 (555) 000-0000"
                                    value={form.phone}
                                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                    onFocus={e => (e.target.style.borderColor = "#2563eb")}
                                    onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                                />
                            </div>

                            {/* Department & Year */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
                                <div>
                                    <label style={labelStyle}>Department</label>
                                    <input
                                        style={inputStyle()}
                                        placeholder="e.g., Computer Science"
                                        value={form.department}
                                        onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                                        onFocus={e => (e.target.style.borderColor = "#2563eb")}
                                        onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Year</label>
                                    <input
                                        style={inputStyle()}
                                        placeholder="e.g., 2024"
                                        value={form.year}
                                        onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                                        onFocus={e => (e.target.style.borderColor = "#2563eb")}
                                        onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                                    />
                                </div>
                            </div>

                            {/* Read-only University ID */}
                            {user?.university_id && (
                                <div>
                                    <label style={labelStyle}>University ID</label>
                                    <input
                                        style={{ ...inputStyle(), background: "#f9fafb", color: "#9ca3af", cursor: "not-allowed" }}
                                        value={user.university_id}
                                        readOnly
                                    />
                                    <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
                                        University ID cannot be changed
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            style={{
                                marginTop: "28px",
                                width: "100%",
                                padding: "14px",
                                background: saving ? "#93c5fd" : "linear-gradient(135deg, #1e3a8a, #2563eb)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "15px",
                                fontWeight: 700,
                                cursor: saving ? "not-allowed" : "pointer",
                                boxShadow: saving ? "none" : "0 4px 15px rgba(37,99,235,0.3)",
                                transition: "all 0.2s",
                            }}
                        >
                            {saving ? "⏳ Saving..." : "💾 Save Changes"}
                        </button>
                    </div>
                )}

                {/* Password Form */}
                {tab === "password" && (
                    <div style={{
                        background: "#fff", borderRadius: "20px", padding: "32px",
                        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                    }}>
                        <h2 style={{ margin: "0 0 8px", color: "#1e3a8a", fontSize: "18px", fontWeight: 700 }}>
                            Change Password
                        </h2>
                        <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 24px" }}>
                            Use a strong password with at least 6 characters
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                            <div>
                                <label style={labelStyle}>Current Password *</label>
                                <input
                                    type="password"
                                    style={inputStyle(!!pwErrors.currentPassword)}
                                    value={pwForm.currentPassword}
                                    onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                                    placeholder="Enter current password"
                                    onFocus={e => (e.target.style.borderColor = "#2563eb")}
                                    onBlur={e => (e.target.style.borderColor = pwErrors.currentPassword ? "#ef4444" : "#e5e7eb")}
                                />
                                {pwErrors.currentPassword && (
                                    <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>⚠ {pwErrors.currentPassword}</p>
                                )}
                            </div>

                            <div>
                                <label style={labelStyle}>New Password *</label>
                                <input
                                    type="password"
                                    style={inputStyle(!!pwErrors.newPassword)}
                                    value={pwForm.newPassword}
                                    onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                                    placeholder="At least 6 characters"
                                    onFocus={e => (e.target.style.borderColor = "#2563eb")}
                                    onBlur={e => (e.target.style.borderColor = pwErrors.newPassword ? "#ef4444" : "#e5e7eb")}
                                />
                                {pwErrors.newPassword && (
                                    <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>⚠ {pwErrors.newPassword}</p>
                                )}
                            </div>

                            <div>
                                <label style={labelStyle}>Confirm New Password *</label>
                                <input
                                    type="password"
                                    style={inputStyle(!!pwErrors.confirmPassword)}
                                    value={pwForm.confirmPassword}
                                    onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                                    placeholder="Repeat new password"
                                    onFocus={e => (e.target.style.borderColor = "#2563eb")}
                                    onBlur={e => (e.target.style.borderColor = pwErrors.confirmPassword ? "#ef4444" : "#e5e7eb")}
                                />
                                {pwErrors.confirmPassword && (
                                    <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>⚠ {pwErrors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        {/* Password strength indicator */}
                        {pwForm.newPassword && (
                            <div style={{ marginTop: "12px" }}>
                                <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>Password strength</div>
                                <div style={{ display: "flex", gap: "4px" }}>
                                    {[1, 2, 3, 4].map(i => {
                                        const strength = pwForm.newPassword.length >= 6
                                            ? pwForm.newPassword.length >= 10
                                                ? /[^a-zA-Z0-9]/.test(pwForm.newPassword) ? 4 : 3
                                                : 2
                                            : 1;
                                        return (
                                            <div key={i} style={{
                                                flex: 1, height: "4px", borderRadius: "2px",
                                                background: i <= strength
                                                    ? strength <= 1 ? "#ef4444"
                                                        : strength <= 2 ? "#f59e0b"
                                                            : strength <= 3 ? "#3b82f6"
                                                                : "#10b981"
                                                    : "#e5e7eb",
                                                transition: "background 0.3s",
                                            }} />
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleChangePassword}
                            disabled={saving}
                            style={{
                                marginTop: "28px",
                                width: "100%",
                                padding: "14px",
                                background: saving ? "#93c5fd" : "linear-gradient(135deg, #1e3a8a, #2563eb)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "15px",
                                fontWeight: 700,
                                cursor: saving ? "not-allowed" : "pointer",
                                boxShadow: saving ? "none" : "0 4px 15px rgba(37,99,235,0.3)",
                            }}
                        >
                            {saving ? "⏳ Updating..." : "🔒 Change Password"}
                        </button>
                    </div>
                )}
            </div>
        </OrganizerLayout>
    );
}