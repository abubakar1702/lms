import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import {
    BookOpen,
    Clock,
    BarChart,
    User,
    CheckCircle,
    PlayCircle,
    Lock,
    ChevronRight,
    ShieldCheck,
    Award,
    Globe
} from 'lucide-react';

const CourseDetail = () => {
    const { slug } = useParams();
    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchCourseDetail();
        checkEnrollmentStatus();
    }, [slug]);

    const fetchCourseDetail = async () => {
        try {
            setLoading(true);
            const response = await api.get(`courses/list/${slug}/`);
            setCourse(response.data);
        } catch (error) {
            console.error('Error fetching course details:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkEnrollmentStatus = async () => {
        try {
            const response = await api.get('enrollments/');
            const enrollments = response.data.results || response.data;
            const enrolled = enrollments.some(e => e.course_details.slug === slug);
            setIsEnrolled(enrolled);
        } catch (error) {
            console.error('Error checking enrollment status:', error);
        }
    };

    const handleEnroll = async () => {
        if (isEnrolled) return;
        try {
            setEnrolling(true);
            await api.post('enrollments/', { course: course.id });
            setIsEnrolled(true);
            alert('Successfully enrolled in the course!');
        } catch (error) {
            const msg = error.response?.data?.non_field_errors?.[0] ||
                error.response?.data?.[0] ||
                'Enrollment failed. Please try again.';
            alert(msg);
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-white">Course not found</h2>
                <Link to="/courses" className="text-indigo-400 mt-4 inline-block font-bold">Back to Courses</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
            {/* Hero Section */}
            <div className="relative rounded-[2.5rem] overflow-hidden mb-12 border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10"></div>
                {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700"></div>
                )}

                <div className="relative z-20 p-8 md:p-16 flex flex-col md:flex-row gap-12 items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                                {course.category_name}
                            </span>
                            <span className="text-slate-400 text-sm flex items-center gap-2">
                                <Globe size={14} /> English
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                            {course.title}
                        </h1>

                        <p className="text-slate-300 text-lg mb-8 max-w-2xl leading-relaxed">
                            {course.description.substring(0, 160)}...
                        </p>

                        <div className="flex flex-wrap items-center gap-8 mb-10 text-slate-300">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                                    <User size={18} className="text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">Instructor</p>
                                    <p className="text-sm font-bold">{course.instructor_name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                                    <Clock size={18} className="text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">Duration</p>
                                    <p className="text-sm font-bold">{course.duration || '10 hours'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                                    <BarChart size={18} className="text-pink-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">Level</p>
                                    <p className="text-sm font-bold capitalize">{course.level}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                onClick={handleEnroll}
                                disabled={enrolling || isEnrolled}
                                className={`px-8 py-4 ${isEnrolled ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-indigo-500 hover:bg-indigo-400'} text-white font-black rounded-2xl shadow-xl transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed`}
                            >
                                {enrolling ? 'Enrolling...' : isEnrolled ? 'Successfully Enrolled' : `Enroll Now — $${course.price}`}
                            </button>
                            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all">
                                Watch Preview
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    {/* Tabs */}
                    <div className="flex border-b border-white/5 mb-8 gap-8 overflow-x-auto no-scrollbar">
                        {['overview', 'curriculum', 'instructor', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-sm font-bold capitalize tracking-wide transition-all relative ${activeTab === tab ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="animate-in slide-in-from-bottom-5 duration-500">
                        {activeTab === 'overview' && (
                            <div className="space-y-10">
                                <section>
                                    <h2 className="text-2xl font-black text-white mb-4">Course Description</h2>
                                    <p className="text-slate-400 leading-relaxed text-lg italic border-l-4 border-indigo-500/30 pl-6 py-2">
                                        {course.description}
                                    </p>
                                </section>

                                {course.what_will_you_learn && (
                                    <section>
                                        <h2 className="text-2xl font-black text-white mb-6">What you'll learn</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {course.what_will_you_learn.split('\n').map((item, i) => (
                                                <div key={i} className="flex gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                                                    <CheckCircle size={20} className="text-emerald-400 shrink-0" />
                                                    <span className="text-slate-300 text-sm leading-snug">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {course.requirements && (
                                    <section>
                                        <h2 className="text-2xl font-black text-white mb-6">Requirements</h2>
                                        <ul className="space-y-3">
                                            {course.requirements.split('\n').map((req, i) => (
                                                <li key={i} className="flex items-center gap-3 text-slate-400">
                                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                                                    {req}
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                )}
                            </div>
                        )}

                        {activeTab === 'curriculum' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-black text-white">{course.lesson_count} Lessons</h2>
                                    <span className="text-sm text-slate-400 font-bold bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                                        {course.duration || '10 hours'} Total Long
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {course.lessons?.map((lesson, index) => (
                                        <div
                                            key={lesson.id}
                                            className="group p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center font-black text-slate-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{lesson.title}</h4>
                                                    <span className="text-xs text-slate-500">{lesson.duration || '10:00'}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-slate-500">
                                                {lesson.is_preview ? (
                                                    <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-wider bg-emerald-400/10 px-3 py-1 rounded-full">
                                                        <PlayCircle size={14} /> Preview
                                                    </div>
                                                ) : (
                                                    <Lock size={16} />
                                                )}
                                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    ))}

                                    {(!course.lessons || course.lessons.length === 0) && (
                                        <div className="text-center py-12 glass rounded-3xl border-dashed border-white/10">
                                            <BookOpen size={48} className="mx-auto text-slate-700 mb-4" />
                                            <p className="text-slate-500 font-bold">No lessons added to this course yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <div className="glass p-8 rounded-[2rem] sticky top-24">
                        <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                            <Award size={24} className="text-indigo-400" />
                            Course Includes
                        </h3>

                        <ul className="space-y-6">
                            {[
                                { icon: PlayCircle, text: `${course.lesson_count || 0} Lessons`, color: 'text-blue-400' },
                                { icon: Clock, text: `Lifetime access`, color: 'text-purple-400' },
                                { icon: ShieldCheck, text: `Verified certificate`, color: 'text-emerald-400' },
                                { icon: Award, text: `Skill assessment`, color: 'text-orange-400' }
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-slate-300 font-bold">
                                    <div className={`p-2 bg-white/5 rounded-xl ${item.color}`}>
                                        <item.icon size={20} />
                                    </div>
                                    <span className="text-sm">{item.text}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-10 p-6 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                            <p className="text-white font-bold mb-2">Money Back Guarantee</p>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Get a full refund within 30 days if you're not satisfied with your experience.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
