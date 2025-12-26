import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Plus, Edit2, Trash2, Users, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await api.get('courses/');
            const data = response.data.results || response.data;
            // Ensure data is an array
            setCourses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to load courses');
            setCourses([]); // Set to empty array on error
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = Array.isArray(courses) ? courses.filter(course =>
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const handleDeleteCourse = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;

        try {
            await api.delete(`courses/${courseId}/`);
            toast.success('Course deleted successfully');
            fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
            toast.error('Failed to delete course');
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
                <p className="text-slate-400 animate-pulse">Loading courses...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
            <header className="mb-10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Manage Courses 📚
                        </h1>
                        <p className="text-slate-400">View and manage all courses on the platform</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/50"
                    >
                        <Plus size={20} />
                        Create Course
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search courses by title or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
                    />
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="glass p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl">
                            <BookOpen className="text-indigo-400" size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Total Courses</p>
                            <p className="text-2xl font-bold text-white">{courses.length}</p>
                        </div>
                    </div>
                </div>
                <div className="glass p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl">
                            <Users className="text-emerald-400" size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Active Courses</p>
                            <p className="text-2xl font-bold text-white">
                                {Array.isArray(courses) ? courses.filter(c => c.is_published).length : 0}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="glass p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-2xl">
                            <AlertCircle className="text-purple-400" size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Draft Courses</p>
                            <p className="text-2xl font-bold text-white">
                                {Array.isArray(courses) ? courses.filter(c => !c.is_published).length : 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses Table */}
            <div className="glass p-8 rounded-3xl border border-white/5">
                <h2 className="text-xl font-bold text-white mb-6">All Courses</h2>

                {filteredCourses.length > 0 ? (
                    <div className="space-y-4">
                        {filteredCourses.map((course) => (
                            <div
                                key={course.id}
                                className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-6 hover:bg-white/10 transition-all group"
                            >
                                <div className={`w-20 h-16 bg-gradient-to-br ${course.color || 'from-indigo-500 to-purple-600'} rounded-xl shadow-lg shrink-0 group-hover:scale-105 transition-transform`} />

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-base font-bold text-white truncate">{course.title}</h3>
                                        {course.is_published ? (
                                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full font-bold">
                                                Published
                                            </span>
                                        ) : (
                                            <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-full font-bold">
                                                Draft
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-400">
                                        {course.category?.name || 'Uncategorized'} • By {course.instructor?.first_name || course.instructor?.username || 'Unknown'}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => window.location.href = `/courses/${course.slug}`}
                                        className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-500 hover:text-white transition-all"
                                        title="View Course"
                                    >
                                        <BookOpen size={18} />
                                    </button>
                                    <button
                                        onClick={() => toast.info('Edit functionality coming soon')}
                                        className="p-2 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                                        title="Edit Course"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCourse(course.id)}
                                        className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                        title="Delete Course"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <BookOpen className="mx-auto mb-4 text-slate-600" size={48} />
                        <p className="text-slate-500 italic">
                            {searchTerm ? 'No courses found matching your search' : 'No courses available'}
                        </p>
                    </div>
                )}
            </div>

            {/* Create Course Modal - Placeholder */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass p-8 rounded-3xl border border-white/10 max-w-2xl w-full">
                        <h2 className="text-2xl font-bold text-white mb-4">Create New Course</h2>
                        <p className="text-slate-400 mb-6">
                            Course creation form will be implemented here. For now, instructors can create courses from their dashboard.
                        </p>
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="bg-indigo-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-600 transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCourses;
