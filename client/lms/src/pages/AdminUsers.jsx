import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Users, GraduationCap, BookOpen, Shield, Loader2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('users/');
            const data = response.data.results || response.data;
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

        try {
            await api.patch(`users/${userId}/`, { role: newRole });
            toast.success('User role updated successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error('Failed to update user role');
        }
    };

    const filteredUsers = Array.isArray(users) ? users.filter(user => {
        const matchesSearch =
            user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = filterRole === 'all' || user.role === filterRole;

        return matchesSearch && matchesRole;
    }) : [];

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return Shield;
            case 'instructor': return BookOpen;
            case 'student': return GraduationCap;
            default: return Users;
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'text-red-400 bg-red-400/10';
            case 'instructor': return 'text-purple-400 bg-purple-400/10';
            case 'student': return 'text-indigo-400 bg-indigo-400/10';
            default: return 'text-slate-400 bg-slate-400/10';
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
                <p className="text-slate-400 animate-pulse">Loading users...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Manage Users 👥
                </h1>
                <p className="text-slate-400 mb-6">View and manage all users on the platform</p>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or username..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
                        />
                    </div>
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all"
                    >
                        <option value="all">All Roles</option>
                        <option value="student">Students</option>
                        <option value="instructor">Instructors</option>
                        <option value="admin">Admins</option>
                    </select>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="glass p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl">
                            <Users className="text-indigo-400" size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Total Users</p>
                            <p className="text-2xl font-bold text-white">{users.length}</p>
                        </div>
                    </div>
                </div>
                <div className="glass p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl">
                            <GraduationCap className="text-indigo-400" size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Students</p>
                            <p className="text-2xl font-bold text-white">
                                {Array.isArray(users) ? users.filter(u => u.role === 'student').length : 0}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="glass p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-2xl">
                            <BookOpen className="text-purple-400" size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Instructors</p>
                            <p className="text-2xl font-bold text-white">
                                {Array.isArray(users) ? users.filter(u => u.role === 'instructor').length : 0}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="glass p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 rounded-2xl">
                            <Shield className="text-red-400" size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Admins</p>
                            <p className="text-2xl font-bold text-white">
                                {Array.isArray(users) ? users.filter(u => u.role === 'admin').length : 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="glass p-8 rounded-3xl border border-white/5">
                <h2 className="text-xl font-bold text-white mb-6">All Users</h2>

                {filteredUsers.length > 0 ? (
                    <div className="space-y-4">
                        {filteredUsers.map((user) => {
                            const RoleIcon = getRoleIcon(user.role);
                            return (
                                <div
                                    key={user.id}
                                    className="p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shrink-0">
                                            {user.first_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                                        </div>

                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-white font-semibold">
                                                    {user.first_name} {user.last_name}
                                                </p>
                                                <p className="text-xs text-slate-400">{user.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 mb-1">Username</p>
                                                <p className="text-white text-sm">{user.username}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 mb-1">Role</p>
                                                <div className="flex items-center gap-2">
                                                    <span className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full font-bold ${getRoleColor(user.role)}`}>
                                                        <RoleIcon size={14} />
                                                        {user.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                                            >
                                                <option value="student">Student</option>
                                                <option value="instructor">Instructor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Users className="mx-auto mb-4 text-slate-600" size={48} />
                        <p className="text-slate-500 italic">
                            {searchTerm || filterRole !== 'all' ? 'No users found matching your criteria' : 'No users available'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
