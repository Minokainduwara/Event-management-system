import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock, ArrowRight } from "lucide-react";

export function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // 🔴 FIX 1: Call backend login API (REAL DB LOGIN)
            const response = await fetch("http://localhost:8080/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // 🔴 FIX 2: Send credentials to backend
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            // 🔴 FIX 3: Handle backend error response
            if (!response.ok) {
                alert(data); // e.g. "User not found" or "Invalid password"
                return;
            }

            // 🔴 FIX 4: Store REAL backend data (NO dummy values)
            localStorage.setItem("userRole", data.role);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("userName", data.name);
            localStorage.setItem("userEmail", data.email);
            localStorage.setItem("universityId", data.universityId);

            // 🔴 FIX 5: Role-based navigation (IMPORTANT FIX)
            if (data.role === "ADMIN") {
                navigate("/admin"); // admin dashboard
            } else if (data.role === "FACULTY") {
                navigate("/faculty"); // faculty dashboard
            } else if (data.role === "STUDENT") {
                navigate("/student"); // student dashboard
            } else {
                navigate("/login"); // fallback safety
            }

        } catch (error) {
            console.error("Login error:", error);
            alert("Server error. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E3A8A] via-[#60A5FA] to-[#1E3A8A] p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8">

                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-[#1E3A8A] p-4 rounded-full">
                            <GraduationCap className="w-12 h-12 text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl text-center mb-2 text-[#1E3A8A]">
                        University Events
                    </h1>

                    <p className="text-center text-gray-600 mb-8">
                        {isSignUp ? "Create your account" : "Welcome back! Please login"}
                    </p>

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm mb-2 text-gray-700">
                                Email Address
                            </label>

                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="your.email@university.edu"
                                    className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1E3A8A]"
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="block text-sm mb-2 text-gray-700">
                                Password
                            </label>

                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1E3A8A]"
                                />
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button
                            type="submit"
                            className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg hover:bg-[#163172] transition flex items-center justify-center gap-2"
                        >
                            {isSignUp ? "Sign Up" : "Login"}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    {/* TOGGLE */}
                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-sm text-gray-600"
                        >
                            {isSignUp ? "Already have an account? Login" : "Create new account"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}