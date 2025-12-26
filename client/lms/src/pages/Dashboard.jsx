import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import InstructorDashboard from '../components/dashboard/InstructorDashboard';
import StudentDashboard from '../components/dashboard/StudentDashboard';

const Dashboard = () => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        if (!user?.role) return;
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`dashboard/${user.role}/`);
            setDashboardData(response.data);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to connect to the server.");
            console.error("Dashboard Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    // 1. Loading State
    if (loading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
                <p className="text-slate-400 animate-pulse">Loading your dashboard...</p>
            </div>
        );
    }

    // 2. Error State
    if (error) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center px-4">
                <div className="bg-red-500/10 p-6 rounded-3xl border border-red-500/20">
                    <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
                    <h2 className="text-white text-xl font-bold mb-2">Data Unavailable</h2>
                    <p className="text-slate-400 mb-6 max-w-md">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="flex items-center gap-2 mx-auto bg-white text-slate-900 px-6 py-2 rounded-xl font-bold hover:bg-slate-200 transition-all"
                    >
                        <RefreshCw size={18} /> Retry
                    </button>
                </div>
            </div>
        );
    }

    // 3. Render appropriate dashboard based on user role
    switch (user?.role) {
        case 'admin':
            return <AdminDashboard user={user} dashboardData={dashboardData} />;
        case 'instructor':
            return <InstructorDashboard user={user} dashboardData={dashboardData} />;
        case 'student':
            return <StudentDashboard user={user} dashboardData={dashboardData} />;
        default:
            return (
                <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-white mb-4">Role Not Defined</h2>
                        <p className="text-slate-400">Please contact support to set up your dashboard.</p>
                    </div>
                </div>
            );
    }
};

export default Dashboard;