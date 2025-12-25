import React from 'react';
import { BookOpen, PlayCircle, Lock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CourseCurriculum = ({ course, isEnrolled }) => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-white">{course.lesson_count} Lessons</h2>
                <span className="text-sm text-slate-400 font-bold bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                    {course.duration || '10 hours'} Total Length
                </span>
            </div>

            <div className="space-y-3">
                {course.lessons?.map((lesson, index) => {
                    const canAccess = isEnrolled || lesson.is_preview;
                    const Component = canAccess ? Link : 'div';
                    const linkProps = canAccess ? { to: `/courses/${course.slug}/lessons/${lesson.id}` } : {};

                    return (
                        <Component
                            key={lesson.id}
                            {...linkProps}
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
                                ) : !isEnrolled ? (
                                    <Lock size={16} />
                                ) : null}
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Component>
                    );
                })}

                {(!course.lessons || course.lessons.length === 0) && (
                    <div className="text-center py-12 glass rounded-3xl border-dashed border-white/10">
                        <BookOpen size={48} className="mx-auto text-slate-700 mb-4" />
                        <p className="text-slate-500 font-bold">No lessons added to this course yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseCurriculum;