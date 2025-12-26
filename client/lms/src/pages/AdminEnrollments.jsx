import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Plus, UserPlus, Trash2, Users, BookOpen, Loader2, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminEnrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [enrollmentsRes, coursesRes, usersRes] = await Promise.all([
                api.get('enrollments/'),
                api.get('courses/'),
                api.get('users/')
            ]);


            const enrollmentsData = enrollmentsRes.data.results || enrollmentsRes.data;
            const coursesData = coursesRes.data.results || coursesRes.data;
            const usersData = usersRes.data.results || usersRes.data;

            setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
            setCourses(Array.isArray(coursesData) ? coursesData : []);

            // Filter only students
            const allUsers = Array.isArray(usersData) ? usersData : [];
            setStudents(allUsers.filter(user => user.role === 'student'));
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
            setEnrollments([]);
            setCourses([]);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEnrollStudent = async (e) => {
        e.preventDefault();

        if (!selectedCourse || !selectedStudent) {
            toast.error('Please select both course and student');
            return;
        }

        try {
            await api.post('enrollments/', {
                course: selectedCourse,
                student: selectedStudent
            });

            toast.success('Student enrolled successfully');
            setShowEnrollModal(false);
            setSelectedCourse('');
            setSelectedStudent('');
            fetchData();
        } catch (error) {
            console.error('Error enrolling student:', error);
            toast.error(error.response?.data?.detail || 'Failed to enroll student');
        }
    };

    const handleUnenroll = async (enrollmentId) => {
        if (!window.confirm('Are you sure you want to unenroll this student?')) return;

        try {
            await api.delete(`enrollments/${enrollmentId}/`);
            toast.success('Student unenrolled successfully');
            fetchData();
        } catch (error) {
            console.error('Error unenrolling student:', error);
            toast.error('Failed to unenroll student');
        }
    };

    const filteredEnrollments = Array.isArray(enrollments) ? enrollments.filter(enrollment =>
        enrollment.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.student?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.student?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.student?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    if (loading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
                <p className="text-slate-400 animate-pulse">Loading enrollments...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
            <header className="mb-10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Manage Enrollments 🎓
                        </h1>
                        <p className="text-slate-400">Enroll students in courses and manage their progress</p>
                    </div>
                    <button
                        onClick={() => setShowEnrollModal(true)}
                        className="flex items-center gap-2 bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/50"
                    >
                        <UserPlus size={20} />
                        Enroll Student
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by student name, email, or course..."
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
                            <GraduationCap className="text-indigo-400" size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Total Enrollments</p>
                            <p className="text-2xl font-bold text-white">{enrollments.length}</p>
                        </div>
                    </div>
                </div>
                <div className="glass p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl">
                            <Users className="text-emerald-400" size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Active Enrollments</p>
                            <p className="text-2xl font-bold text-white">
                                {Array.isArray(enrollments) ? enrollments.filter(e => e.status === 'active').length : 0}
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
                            <p className="text-slate-400 text-sm">Completed</p>
                            <p className="text-2xl font-bold text-white">
                                {Array.isArray(enrollments) ? enrollments.filter(e => e.status === 'completed').length : 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enrollments Table */}
            <div className="glass p-8 rounded-3xl border border-white/5">
                <h2 className="text-xl font-bold text-white mb-6">All Enrollments</h2>

                {filteredEnrollments.length > 0 ? (
                    <div className="space-y-4">
                        {filteredEnrollments.map((enrollment) => (
                            <div
                                key={enrollment.id}
                                className="p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-xs text-slate-400 mb-1">Student</p>
                                            <p className="text-white font-semibold">
                                                {enrollment.student?.first_name} {enrollment.student?.last_name}
                                            </p>
                                            <p className="text-xs text-slate-400">{enrollment.student?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 mb-1">Course</p>
                                            <p className="text-white font-semibold">{enrollment.course?.title}</p>
                                            <p className="text-xs text-slate-400">
                                                {enrollment.course?.category?.name || 'Uncategorized'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 mb-1">Progress</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                                                        style={{ width: `${enrollment.progress || 0}%` }}
                                                    />
                                                </div>
                                                <span className="text-white font-bold text-sm">{enrollment.progress || 0}%</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${enrollment.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                                                    enrollment.status === 'completed' ? 'bg-blue-500/10 text-blue-400' :
                                                        'bg-yellow-500/10 text-yellow-400'
                                                    }`}>
                                                    {enrollment.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleUnenroll(enrollment.id)}
                                        className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                        title="Unenroll Student"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <GraduationCap className="mx-auto mb-4 text-slate-600" size={48} />
                        <p className="text-slate-500 italic">
                            {searchTerm ? 'No enrollments found matching your search' : 'No enrollments yet'}
                        </p>
                    </div>
                )}
            </div>

            {/* Enroll Student Modal */}
            {showEnrollModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass p-8 rounded-3xl border border-white/10 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-white mb-6">Enroll Student</h2>

                        <form onSubmit={handleEnrollStudent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Select Course
                                </label>
                                <select
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all"
                                    required
                                >
                                    <option value="">Choose a course...</option>
                                    {Array.isArray(courses) && courses.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Select Student
                                </label>
                                <select
                                    value={selectedStudent}
                                    onChange={(e) => setSelectedStudent(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all"
                                    required
                                >
                                    <option value="">Choose a student...</option>
                                    {Array.isArray(students) && students.map(student => (
                                        <option key={student.id} value={student.id}>
                                            {student.first_name} {student.last_name} ({student.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all"
                                >
                                    Enroll Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEnrollModal(false);
                                        setSelectedCourse('');
                                        setSelectedStudent('');
                                    }}
                                    className="flex-1 bg-white/5 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEnrollments;
