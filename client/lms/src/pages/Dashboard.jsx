import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Users,
    BookOpen,
    GraduationCap,
    TrendingUp,
    ChevronRight,
    Clock,
    Calendar
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();

    const stats = [
        { label: 'Total Courses', value: '12', icon: BookOpen, color: 'text-indigo-400', bg: 'bg-indigo-400/10', trend: '+2 this month' },
        { label: 'Active Students', value: '1,234', icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10', trend: '+15% growth' },
        { label: 'Enrollments', value: '456', icon: GraduationCap, color: 'text-pink-400', bg: 'bg-pink-400/10', trend: '+8 new today' },
        { label: 'Completion Rate', value: '82%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10', trend: '+5% improve' },
    ];

    const recentCourses = [
        { id: 1, title: 'Introduction to Web development', instructor: 'Dr. Sarah Smith', progress: 65, category: 'Development', color: 'from-blue-500 to-indigo-600' },
        { id: 2, title: 'Advanced React patterns', instructor: 'Michael Chen', progress: 40, category: 'Development', color: 'from-purple-500 to-pink-600' },
        { id: 3, title: 'UI/UX Design Essentials', instructor: 'Alex Rivera', progress: 90, category: 'Design', color: 'from-orange-500 to-rose-600' },
    ];

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, {user?.first_name || user?.username}! 👋
                </h1>
                <p className="text-slate-400">Here's what's happening with your learning journey today.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, index) => (
                    <div key={index} className="glass p-6 rounded-3xl hover:bg-white/5 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-xs text-emerald-400 font-semibold bg-emerald-400/10 px-2 py-1 rounded-full">{stat.trend}</span>
                        </div>
                        <h3 className="text-sm text-slate-400 mb-1">{stat.label}</h3>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Section */}
                <div className="lg:col-span-2 glass p-8 rounded-3xl">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-white">Continue Learning</h2>
                        <button className="text-indigo-400 font-semibold flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
                            View all <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {recentCourses.map((course) => (
                            <div key={course.id} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex flex-col sm:flex-row items-center gap-6 hover:bg-white/10 transition-all border-l-4 border-l-indigo-500">
                                <div className={`w-20 h-16 bg-gradient-to-br ${course.color} rounded-xl shadow-lg shrink-0`} />
                                <div className="flex-1 min-w-0">
                                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                                        {course.category}
                                    </span>
                                    <h4 className="text-base font-bold text-white mt-1 mb-1 truncate">{course.title}</h4>
                                    <p className="text-sm text-slate-400">{course.instructor}</p>
                                </div>
                                <div className="w-full sm:w-48">
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-slate-400 font-medium">Progress</span>
                                        <span className="text-white font-bold">{course.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${course.progress}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Mini Section */}
                <div className="space-y-8">
                    <div className="glass p-6 rounded-3xl">
                        <div className="flex items-center gap-2 mb-6 text-indigo-400">
                            <Calendar size={20} />
                            <h2 className="text-lg font-bold text-white">Upcoming Sessions</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
                                <div className="bg-indigo-500 text-white p-2 rounded-xl text-center min-w-[50px] flex flex-col justify-center">
                                    <p className="text-[10px] font-black uppercase opacity-80">Dec</p>
                                    <p className="text-lg font-black leading-none">24</p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white">Live Q&A: Advanced React</p>
                                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                        <Clock size={12} /> 10:00 AM - 11:30 AM
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
                                <div className="bg-purple-500 text-white p-2 rounded-xl text-center min-w-[50px] flex flex-col justify-center">
                                    <p className="text-[10px] font-black uppercase opacity-80">Dec</p>
                                    <p className="text-lg font-black leading-none">28</p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white">UI Design Workshop</p>
                                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                        <Clock size={12} /> 2:00 PM - 4:00 PM
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-6 py-3 border border-indigo-500/20 text-indigo-400 rounded-2xl text-sm font-bold hover:bg-indigo-500 hover:text-white transition-all">
                            View Schedule
                        </button>
                    </div>

                    <div className="glass p-6 rounded-3xl bg-indigo-600/20 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/40 transition-all"></div>
                        <h3 className="text-white font-bold mb-2">Upgrade to Pro</h3>
                        <p className="text-indigo-200/70 text-sm mb-4">Get access to all advanced courses and mentorship.</p>
                        <button className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
