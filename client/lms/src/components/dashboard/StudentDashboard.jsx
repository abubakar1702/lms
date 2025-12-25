import React from 'react';
import { 
    BookOpen, 
    GraduationCap, 
    Clock, 
    TrendingUp, 
    ChevronRight, 
    Calendar 
} from 'lucide-react';

const StudentDashboard = ({ user, dashboardData }) => {
    const uiConfig = {
        enrolled: { icon: BookOpen, color: 'text-indigo-400 bg-indigo-400/10' },
        completed: { icon: GraduationCap, color: 'text-emerald-400 bg-emerald-400/10' },
        hours: { icon: Clock, color: 'text-purple-400 bg-purple-400/10' },
        streak: { icon: TrendingUp, color: 'text-orange-400 bg-orange-400/10' }
    };

    // ... rest of the component remains the same
    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, {user?.first_name || user?.username}! 👋
                </h1>
                <p className="text-slate-400">Track your learning progress and achievements.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {dashboardData?.stats?.map((stat, index) => {
                    const config = uiConfig[stat.type] || uiConfig.enrolled;
                    const Icon = config.icon;
                    return (
                        <div key={index} className="glass p-6 rounded-3xl hover:bg-white/5 transition-all group border border-white/5">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`${config.color} p-3 rounded-2xl`}>
                                    <Icon size={24} />
                                </div>
                                {stat.trend && (
                                    <span className={`text-[10px] ${stat.trend > 0 ? 'text-emerald-400' : 'text-red-400'} font-bold ${stat.trend > 0 ? 'bg-emerald-400/10' : 'bg-red-400/10'} px-2 py-1 rounded-full uppercase tracking-wider`}>
                                        {stat.trend > 0 ? '+' : ''}{stat.trend}%
                                    </span>
                                )}
                            </div>
                            <h3 className="text-sm text-slate-400 mb-1">{stat.label}</h3>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Courses Section */}
                <div className="lg:col-span-2 glass p-8 rounded-3xl border border-white/5">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-white">Your Learning Journey</h2>
                        <button className="text-indigo-400 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                            Browse Courses <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {dashboardData?.courses?.length > 0 ? (
                            dashboardData.courses.map((course) => (
                                <div key={course.id} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex flex-col sm:flex-row items-center gap-6 hover:bg-white/10 transition-all border-l-4 border-l-indigo-500">
                                    <div className={`w-20 h-16 bg-gradient-to-br ${course.color || 'from-indigo-500 to-purple-600'} rounded-xl shadow-lg shrink-0`} />
                                    <div className="flex-1 min-w-0 w-full">
                                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                                            {course.category}
                                        </span>
                                        <h4 className="text-base font-bold text-white mt-1 mb-1 truncate">{course.title}</h4>
                                        <p className="text-sm text-slate-400">By {course.instructor}</p>
                                    </div>
                                    <div className="w-full sm:w-48">
                                        <div className="flex justify-between text-xs mb-2">
                                            <span className="text-slate-400 font-medium">Progress</span>
                                            <span className="text-white font-bold">{course.progress}%</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out" 
                                                style={{ width: `${course.progress}%` }} 
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400 mt-2 text-right">
                                            {course.last_accessed || 'Not started yet'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-slate-500 italic">No courses enrolled yet.</p>
                                <button className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-600 transition-all">
                                    Explore Courses
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Section */}
                <div className="space-y-8">
                    <div className="glass p-6 rounded-3xl border border-white/5">
                        <div className="flex items-center gap-2 mb-6 text-indigo-400">
                            <Calendar size={20} />
                            <h2 className="text-lg font-bold text-white">Upcoming Deadlines</h2>
                        </div>
                        
                        <div className="space-y-4 mb-6">
                            {dashboardData?.deadlines?.map((deadline, index) => (
                                <div key={index} className="flex gap-4 p-4 bg-white/5 rounded-2xl">
                                    <div className={`${deadline.priority === 'high' ? 'bg-red-500' : 'bg-indigo-500'} text-white p-2 rounded-xl text-center min-w-[50px]`}>
                                        <p className="text-[10px] font-black uppercase opacity-80">
                                            {new Date(deadline.date).toLocaleDateString('en-US', { month: 'short' })}
                                        </p>
                                        <p className="text-lg font-black leading-none">
                                            {new Date(deadline.date).getDate()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{deadline.title}</p>
                                        <p className="text-xs text-slate-400 mt-1">{deadline.course}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full py-3 border border-indigo-500/20 text-indigo-400 rounded-2xl text-sm font-bold hover:bg-indigo-500 hover:text-white transition-all">
                            View Calendar
                        </button>
                    </div>

                    {/* Achievement Card */}
                    <div className="glass p-6 rounded-3xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 relative overflow-hidden group border border-white/10">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/40 transition-all" />
                        <h3 className="text-white font-bold mb-2">🎯 Your Goals</h3>
                        <p className="text-indigo-200/70 text-sm mb-4">
                            {dashboardData?.goals?.completed || 0} of {dashboardData?.goals?.total || 5} goals completed this month
                        </p>
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-4">
                            <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out" 
                                style={{ 
                                    width: `${((dashboardData?.goals?.completed || 0) / (dashboardData?.goals?.total || 5)) * 100}%` 
                                }} 
                            />
                        </div>
                        <button className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all relative z-10">
                            Set New Goal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;