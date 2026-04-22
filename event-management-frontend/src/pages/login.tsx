import { useState } from 'react';
import { useNavigate } from 'react-router';
import { GraduationCap, Mail, Lock, ArrowRight } from 'lucide-react';

export function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Store user role in localStorage for demo purposes
        localStorage.setItem('userRole', 'student');
        localStorage.setItem('userId', '3');
        localStorage.setItem('userName', 'John Smith');
        localStorage.setItem('registrationNumber', 'RUH/2022/CS/145');
        localStorage.setItem('userEmail', email || 'john.smith@ruh.ac.lk');
        navigate('/dashboard');
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
                        {isSignUp ? 'Create your account' : 'Welcome back! Please login to continue'}
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm mb-2 text-gray-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                                    placeholder="your.email@university.edu"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm mb-2 text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {!isSignUp && (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="text-sm text-[#60A5FA] hover:text-[#1E3A8A] transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg hover:bg-[#1e3a8aee] transition-colors flex items-center justify-center gap-2 group"
                        >
                            {isSignUp ? 'Sign Up' : 'Login'}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    {/* Toggle Sign Up/Login */}
                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-sm text-gray-600"
                        >
                            {isSignUp ? (
                                <>
                                    Already have an account?{' '}
                                    <span className="text-[#60A5FA] hover:text-[#1E3A8A]">Login</span>
                                </>
                            ) : (
                                <>
                                    Don't have an account?{' '}
                                    <span className="text-[#60A5FA] hover:text-[#1E3A8A]">Sign Up</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Quick Demo Login */}
                    <div className="mt-6">
                        <div className="relative flex items-center gap-2 mb-4">
                            <div className="flex-1 border-t border-gray-200" />
                            <span className="text-xs text-gray-400 whitespace-nowrap">Quick Demo Login</span>
                            <div className="flex-1 border-t border-gray-200" />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    localStorage.setItem('userRole', 'student');
                                    localStorage.setItem('userId', '3');
                                    localStorage.setItem('userName', 'John Smith');
                                    navigate('/');
                                }}
                                className="py-2 px-3 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-all duration-200"
                            >
                                🎓 Student
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    localStorage.setItem('userRole', 'faculty');
                                    localStorage.setItem('userId', '2');
                                    localStorage.setItem('userName', 'Dr. Sarah Johnson');
                                    navigate('/');
                                }}
                                className="py-2 px-3 text-xs font-medium rounded-lg border border-[#FBBF24] text-[#92400e] bg-[#FBBF24]/10 hover:bg-[#FBBF24]/20 transition-all duration-200"
                            >
                                👩‍🏫 Faculty
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    localStorage.setItem('userRole', 'admin');
                                    localStorage.setItem('userId', '1');
                                    localStorage.setItem('userName', 'Admin User');
                                    navigate('/');
                                }}
                                className="py-2 px-3 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-all duration-200"
                            >
                                🛡️ Admin
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
