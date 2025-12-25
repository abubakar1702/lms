import React from 'react';
import { CheckCircle } from 'lucide-react';

const CourseOverview = ({ course }) => {
    return (
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
    );
};

export default CourseOverview;