import {
  User,
  Mail,
  GraduationCap,
  Hash,
  Calendar,
  Phone,
  FileText,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import StudentHeader from "../../components/StudentHeader";
import { apiFetch } from "../../shared/api/api";
type StudentProfile = {
  name: string;
  email: string;
  universityId: string;
  userId?: number;
  department: string;
  year: string;
  phone: string;
  createdAt: string;
};
type FormType = {
  name: string;
  email: string;
  universityId: string;
  phone: string;
  department: string;
  year: string;
};
function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState<FormType>({
    name: "",
    email: "",
    universityId: "",
    phone: "",
    department: "",
    year: "",
  });
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await apiFetch("/users/profile");
      setProfile(data);
      setForm({
        name: data.name || "",
        email: data.email || "",
        universityId: data.universityId || "",
        phone: data.phone || "",
        department: data.department || "",
        year: data.year || "",
      });
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };
  type UpdateProfileResponse = {
    profile: StudentProfile;
    token?: string;
  };
  const updateProfile = async () => {
    try {
      const res: UpdateProfileResponse = await apiFetch("/users/profile", {
        method: "PUT",
        body: JSON.stringify(form),
      });

      setProfile(res.profile);
      setIsEditing(false);
      setShowSuccess(true);

      if (res.token) {
        localStorage.setItem("token", res.token);
      }
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordMsg("New passwords do not match");
      return;
    }

    try {
      await apiFetch("/users/change-password", {
        method: "PUT",
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      setPasswordMsg("Password updated successfully");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMsg("Password update failed");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <StudentHeader />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">
            View and manage your profile information
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 mb-6">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-sm font-semibold text-green-900">
                Profile Updated Successfully
              </div>
              <div className="text-xs text-green-700">
                Your changes have been saved.
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <User className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {profile?.name}
                </h2>
                <p className="text-sm text-gray-600">{profile?.department}</p>
                <p className="text-xs text-gray-500 mt-1">{profile?.year}</p>
              </div>

              {/* Quick Info */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{profile?.universityId}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 truncate">
                    {profile?.email}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Joined {formatDate(profile?.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Profile Information
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* Read-Only Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </div>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${!isEditing
                        ? "bg-gray-50 text-gray-600 cursor-not-allowed"
                        : ""
                        }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </div>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${!isEditing
                        ? "bg-gray-50 text-gray-600 cursor-not-allowed"
                        : ""
                        }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        University ID
                      </div>
                    </label>
                    <input
                      type="text"
                      name="universityId"
                      value={form.universityId}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${!isEditing
                        ? "bg-gray-50 text-gray-600 cursor-not-allowed"
                        : ""
                        }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Department
                      </div>
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${!isEditing
                        ? "bg-gray-50 text-gray-600 cursor-not-allowed"
                        : ""
                        }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Year of Study
                      </div>
                    </label>
                    <input
                      type="text"
                      name="year"
                      value={form.year}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing
                        ? "bg-gray-50 text-gray-600 cursor-not-allowed"
                        : ""
                        }`}
                    />
                  </div>
                </div>

                {/* Editable Fields */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Editable Information
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone Number
                        </div>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={isEditing ? form.phone : profile?.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing
                          ? "bg-gray-50 text-gray-600 cursor-not-allowed"
                          : ""
                          }`}
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Change Password
                  </h3>

                  <div className="space-y-4">
                    <input
                      type="password"
                      placeholder="Old Password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />

                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />

                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />

                    {passwordMsg && (
                      <p className="text-sm text-blue-600">{passwordMsg}</p>
                    )}

                    <button
                      onClick={changePassword}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Change Password
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateProfile}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default StudentProfile;
