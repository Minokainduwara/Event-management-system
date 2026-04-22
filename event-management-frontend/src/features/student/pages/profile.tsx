import { useEffect, useState } from "react";
import { StudentLayout } from "../components/StudentLayout";
import {
    getStudentProfile,
    refreshStudentProfileFromApi,
    saveStudentProfileToApi,
} from "../services/studentData";
import type { StudentProfile } from "../../../shared/types/student";

interface ProfileErrors {
    fullName?: string;
    registrationNumber?: string;
    email?: string;
}

function validateProfile(profile: StudentProfile): ProfileErrors {
    const errors: ProfileErrors = {};

    if (!profile.fullName.trim()) {
        errors.fullName = "Full name is required.";
    }

    if (!profile.registrationNumber.trim()) {
        errors.registrationNumber = "Registration number is required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
        errors.email = "Enter a valid email address.";
    }

    return errors;
}

export function ProfilePage() {
    const cachedProfile = getStudentProfile();
    const [initialProfile, setInitialProfile] = useState<StudentProfile>(cachedProfile);
    const [profile, setProfile] = useState<StudentProfile>(cachedProfile);
    const [errors, setErrors] = useState<ProfileErrors>({});
    const [toastMessage, setToastMessage] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const serverProfile = await refreshStudentProfileFromApi();
                setInitialProfile(serverProfile);
                setProfile(serverProfile);
            } catch {
                setToastMessage("Using cached profile. Login may be required to sync with server.");
            }
        };

        void loadProfile();
    }, []);

    const isDirty =
        profile.fullName !== initialProfile.fullName ||
        profile.registrationNumber !== initialProfile.registrationNumber ||
        profile.email !== initialProfile.email;

    const handleSave = async () => {
        const validationErrors = validateProfile(profile);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            setToastMessage("Please fix validation errors before saving.");
            return;
        }

        try {
            setIsSaving(true);
            await saveStudentProfileToApi(profile);
            setInitialProfile(profile);
            setToastMessage("Profile updated successfully.");
        } catch {
            setToastMessage("Could not update profile in database. Please login again and retry.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setProfile(initialProfile);
        setErrors({});
        setToastMessage("Changes were discarded.");
    };

    return (
        <StudentLayout
            title="Student Profile"
            subtitle="Update your details used for event registration"
        >
            {toastMessage ? (
                <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
                    {toastMessage}
                </div>
            ) : null}

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="profile-full-name" className="mb-1 block text-sm text-slate-600">Full Name</label>
                        <input
                            id="profile-full-name"
                            value={profile.fullName}
                            onChange={(event) => setProfile({ ...profile, fullName: event.target.value })}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        />
                        {errors.fullName ? <p className="mt-1 text-xs text-red-600">{errors.fullName}</p> : null}
                    </div>

                    <div>
                        <label htmlFor="profile-registration-number" className="mb-1 block text-sm text-slate-600">Registration Number</label>
                        <input
                            id="profile-registration-number"
                            value={profile.registrationNumber}
                            onChange={(event) => setProfile({ ...profile, registrationNumber: event.target.value })}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        />
                        {errors.registrationNumber ? (
                            <p className="mt-1 text-xs text-red-600">{errors.registrationNumber}</p>
                        ) : null}
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="profile-email" className="mb-1 block text-sm text-slate-600">Email</label>
                        <input
                            id="profile-email"
                            value={profile.email}
                            onChange={(event) => setProfile({ ...profile, email: event.target.value })}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        />
                        {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
                    </div>
                </div>

                <div className="mt-6 flex gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            void handleSave();
                        }}
                        disabled={!isDirty || isSaving}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={!isDirty}
                        className="rounded-lg bg-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-300 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </StudentLayout>
    );
}
