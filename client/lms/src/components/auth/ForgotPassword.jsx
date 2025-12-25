import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Shield } from 'lucide-react';
import api from '../../api/axios';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await api.post('users/password-reset/request/', { email });
            setSuccess(response.data.message);
            // In development, show OTP in console
            if (response.data.otp) {
                console.log('OTP (dev only):', response.data.otp);
                alert(`OTP (dev only): ${response.data.otp}`);
            }
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.email?.[0] || err.response?.data?.detail || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await api.post('users/password-reset/verify-otp/', { email, otp });
            setSuccess(response.data.message);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.otp?.[0] || err.response?.data?.detail || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('users/password-reset/confirm/', {
                email,
                otp,
                new_password: newPassword,
                new_password_confirm: confirmPassword
            });
            setSuccess(response.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            const errorData = err.response?.data;
            if (errorData?.password) {
                setError(Array.isArray(errorData.password) ? errorData.password[0] : errorData.password);
            } else if (errorData?.otp) {
                setError(Array.isArray(errorData.otp) ? errorData.otp[0] : errorData.otp);
            } else {
                setError(errorData?.detail || 'Failed to reset password. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-6">
            <div className="glass p-12 rounded-3xl w-full max-w-[450px] shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-500">
                <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    {step === 1 && 'Reset Password'}
                    {step === 2 && 'Verify OTP'}
                    {step === 3 && 'New Password'}
                </h1>
                <p className="text-slate-400 text-center mb-10">
                    {step === 1 && 'Enter your email to receive an OTP'}
                    {step === 2 && 'Enter the OTP sent to your email'}
                    {step === 3 && 'Enter your new password'}
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg mb-6 text-sm text-center">
                        {success}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleRequestOTP} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm text-slate-400 ml-1" htmlFor="email">
                                <Mail size={16} className="inline mr-2" />
                                Email Address
                            </label>
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

                        <button
                            type="submit"
                            className="btn-primary mt-4 w-full"
                            disabled={loading}
                        >
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm text-slate-400 ml-1" htmlFor="otp">
                                <Shield size={16} className="inline mr-2" />
                                Enter OTP
                            </label>
                            <input
                                id="otp"
                                type="text"
                                className="auth-input text-center text-2xl tracking-widest font-mono"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                                required
                            />
                            <p className="text-xs text-slate-500 text-center">
                                Check your email for the 6-digit OTP
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="btn-secondary flex-1"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="btn-primary flex-1"
                                disabled={loading || otp.length !== 6}
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm text-slate-400 ml-1" htmlFor="newPassword">
                                <Lock size={16} className="inline mr-2" />
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                className="auth-input"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm text-slate-400 ml-1" htmlFor="confirmPassword">
                                <Lock size={16} className="inline mr-2" />
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                className="auth-input"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="btn-secondary flex-1"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="btn-primary flex-1"
                                disabled={loading || newPassword !== confirmPassword}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                )}

                <div className="text-center mt-8 text-sm text-slate-400">
                    Remember your password?{' '}
                    <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

