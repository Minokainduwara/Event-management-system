import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    GraduationCap,
    Mail,
    Lock,
    ArrowRight,
    User,
    IdCard
} from "lucide-react";

export function Login() {
    const navigate = useNavigate();

    const [isSignUp, setIsSignUp] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [universityId, setUniversityId] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const url = isSignUp
                ? "http://localhost:8080/users/register"
                : "http://localhost:8080/users/login";

            // DTO-COMPATIBLE PAYLOAD
            const payload = isSignUp
                ? {
                    name: name.trim(),
                    email: email.trim(),
                    password: password,
                    universityId: universityId.trim()
                }
                : {
                    email: email.trim(),
                    password: password
                };

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            // SAFE RESPONSE HANDLING
            const text = await response.text();
            let data;

            try {
                data = text ? JSON.parse(text) : null;
            } catch {
                data = text;
            }

            if (!response.ok) {
                alert(typeof data === "string" ? data : data?.message || "Request failed");
                return;
            }

            // ================= SIGNUP =================
            if (isSignUp) {
                alert("Account created successfully!");

                setIsSignUp(false);
                setName("");
                setEmail("");
                setPassword("");
                setUniversityId("");
                return;
            }

            // ================= LOGIN =================
            if (!data || !data.role) {
                alert("Invalid login response from server");
                return;
            }

            // STORE SESSION
            localStorage.setItem("userId", data.id);
            localStorage.setItem("userName", data.name);
            localStorage.setItem("userEmail", data.email);
            localStorage.setItem("userRole", data.role);
            localStorage.setItem("universityId", data.universityId || "");

            // ROLE NAVIGATION
            if (data.role === "ADMIN") {
                navigate("/admin");
            } else if (data.role === "FACULTY") {
                navigate("/faculty");
            } else {
                navigate("/student");
            }

        } catch (error) {
            console.error("Auth error:", error);
            alert("Server error. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-400 to-blue-900 p-4">

            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

                {/* HEADER */}
                <div className="flex justify-center mb-4">
                    <div className="bg-blue-900 p-3 rounded-full">
                        <GraduationCap className="text-white" />
                    </div>
                </div>

                <h1 className="text-center text-2xl text-blue-900 font-semibold">
                    University Event System
                </h1>

                <p className="text-center text-gray-500 mb-6">
                    {isSignUp ? "Create your account" : "Login to continue"}
                </p>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* NAME */}
                    {isSignUp && (
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" />
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full Name"
                                className="w-full pl-10 p-3 border rounded-lg"
                                required
                            />
                        </div>
                    )}

                    {/* UNIVERSITY ID */}
                    {isSignUp && (
                        <div className="relative">
                            <IdCard className="absolute left-3 top-3 text-gray-400" />
                            <input
                                value={universityId}
                                onChange={(e) => setUniversityId(e.target.value)}
                                placeholder="University ID (e.g. UWU/ICT/2021/001)"
                                className="w-full pl-10 p-3 border rounded-lg"
                                required
                            />
                        </div>
                    )}

                    {/* EMAIL */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full pl-10 p-3 border rounded-lg"
                            required
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full pl-10 p-3 border rounded-lg"
                            required
                        />
                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        className="w-full bg-blue-900 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                    >
                        {isSignUp ? "Sign Up" : "Login"}
                        <ArrowRight size={18} />
                    </button>
                </form>

                {/* TOGGLE */}
                <div className="text-center mt-5">
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setName("");
                            setEmail("");
                            setPassword("");
                            setUniversityId("");
                        }}
                        className="text-sm text-blue-900 hover:underline"
                    >
                        {isSignUp
                            ? "Already have an account? Login"
                            : "Create new account"}
                    </button>
                </div>

            </div>
        </div>
    );
}