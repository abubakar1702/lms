import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirm: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password_confirm) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        const result = await register(formData);
        if (result.success) {
            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
        } else {
            if (typeof result.error === 'object') {
                const firstErrorKey = Object.keys(result.error)[0];
                const firstError = result.error[firstErrorKey];
                setError(`${firstErrorKey}: ${Array.isArray(firstError) ? firstError[0] : firstError}`);
            } else {
                setError(result.error);
            }
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-6">
            <div className="glass p-12 rounded-3xl w-full max-w-[500px] shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-500">
                <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Create Account
                </h1>
                <p className="text-slate-400 text-center mb-10">Join our community of learners</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm text-slate-400 ml-1" htmlFor="first_name">First Name</label>
                            <input
                                id="first_name"
                                name="first_name"
                                type="text"
                                className="auth-input"
                                placeholder="John"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm text-slate-400 ml-1" htmlFor="last_name">Last Name</label>
                            <input
                                id="last_name"
                                name="last_name"
                                type="text"
                                className="auth-input"
                                placeholder="Doe"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm text-slate-400 ml-1" htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="auth-input"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm text-slate-400 ml-1">I am a...</label>
                        <div className="flex gap-6 mt-1 ml-1">
                            <label className="flex items-center gap-2 cursor-pointer group text-slate-300">
                                <input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    className="w-4 h-4 accent-indigo-500"
                                    checked={formData.role === 'student'}
                                    onChange={handleChange}
                                />
                                <span className="group-hover:text-indigo-400 transition-colors">Student</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group text-slate-300">
                                <input
                                    type="radio"
                                    name="role"
                                    value="instructor"
                                    className="w-4 h-4 accent-indigo-500"
                                    checked={formData.role === 'instructor'}
                                    onChange={handleChange}
                                />
                                <span className="group-hover:text-indigo-400 transition-colors">Instructor</span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm text-slate-400 ml-1" htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="auth-input"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm text-slate-400 ml-1" htmlFor="password_confirm">Confirm Password</label>
                        <input
                            id="password_confirm"
                            name="password_confirm"
                            type="password"
                            className="auth-input"
                            placeholder="••••••••"
                            value={formData.password_confirm}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary mt-4"
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="text-center mt-8 text-sm text-slate-400">
                    Already have an account?
                    <Link to="/login" className="text-indigo-400 font-semibold ml-2 hover:underline">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;