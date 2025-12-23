import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-6">
            <div className="glass p-12 rounded-3xl w-full max-w-[450px] shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-500">
                <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Welcome Back
                </h1>
                <p className="text-slate-400 text-center mb-10">Elevate your learning journey today</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm text-slate-400 ml-1" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="auth-input"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="block text-sm text-slate-400" htmlFor="password">Password</label>
                            <Link to="/forget-password" title="Forget Password?" className="text-xs text-indigo-400 hover:underline">Forgot Password?</Link>
                        </div>
                        <input
                            id="password"
                            type="password"
                            className="auth-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary mt-4"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="text-center mt-8 text-sm text-slate-400">
                    Don't have an account?
                    <Link to="/register" className="text-indigo-400 font-semibold ml-2 hover:underline">Create one</Link>
                </div>
            </div>
        </div>
    );
};

export default LogIn;