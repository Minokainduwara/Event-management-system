import { User, Mail, GraduationCap, Hash, Calendar, Phone, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { apiFetch } from "../../utils/apiFetch";

function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    universityId: "",
    phone: "",
    department: "",
    year: "",
  });

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    apiFetch("/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
          universityId: data.universityId || "",
          phone: data.phone || "",
          department: data.department || "",
          year: data.year || "",
        });
      })
      .catch((err) => console.log(String(err)));
  }, []);

  const updateProfile = async () => {
    try {
      const res = await apiFetch("http://localhost:8080/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      setProfile(data.profile || data);
      setIsEditing(false);
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.log(String(err));
    }
  };

  return (
    <div>
      <Header />

      {showSuccess && (
        <div className="p-4 bg-green-100 text-green-700 flex items-center gap-2">
          <CheckCircle /> Profile Updated
        </div>
      )}

      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Profile</h1>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <input
            disabled={!isEditing}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2"
            placeholder="Name"
          />

          <input
            disabled={!isEditing}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border p-2"
            placeholder="Email"
          />

          <input
            disabled={!isEditing}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="border p-2"
            placeholder="Phone"
          />
        </div>

        <div className="mt-4 flex gap-3">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2">
              Edit
            </button>
          ) : (
            <>
              <button onClick={updateProfile} className="bg-green-600 text-white px-4 py-2">
                Save
              </button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2">
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;