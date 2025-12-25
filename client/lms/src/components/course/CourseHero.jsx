import React from 'react';
import { User, Clock, BarChart, Globe } from 'lucide-react';

const CourseHero = ({ course, isEnrolled, enrolling, handleEnroll }) => {
    return (
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
                            {enrolling ? 'Enrolling...' : isEnrolled ? 'Enrolled' : `Enroll Now — $${course.price}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseHero;
