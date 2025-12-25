import React from 'react';
import { Award, PlayCircle, Clock, ShieldCheck } from 'lucide-react';

const CourseSidebar = ({ course }) => {
    return (
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
    );
};

export default CourseSidebar;
