import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
    ChevronLeft,
    ChevronRight,
    BookOpen,
    FileText,
    Download,
    CheckCircle,
    PlayCircle,
    Clock,
    AlertCircle
} from 'lucide-react';

const LessonDetail = () => {
    const { slug, lessonId } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        fetchLessonData();
    }, [lessonId, slug]);

    const fetchLessonData = async () => {
        try {
            setLoading(true);
            
            const courseResponse = await api.get(`courses/list/${slug}/`);
            setCourse(courseResponse.data);
            setLessons(courseResponse.data.lessons || []);

            const lessonResponse = await api.get(`courses/lessons/${lessonId}/`);
            setLesson(lessonResponse.data);

            checkLessonCompletion();
        } catch (error) {
            console.error('Error fetching lesson data:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkLessonCompletion = async () => {
        try {
            const response = await api.get(`courses/lessons/${lessonId}/progress/`);
            setIsCompleted(response.data.is_completed);
        } catch (error) {
            console.error('Error checking lesson completion:', error);
        }
    };

    const handleCompleteLesson = async () => {
        try {
            setCompleting(true);
            await api.post(`courses/lessons/${lessonId}/complete/`);
            setIsCompleted(true);
        } catch (error) {
            console.error('Error completing lesson:', error);
        } finally {
            setCompleting(false);
        }
    };

    const currentLessonIndex = lessons.findIndex(l => l.id === parseInt(lessonId));
    const previousLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null;
    const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-white">Lesson not found</h2>
                <Link to={`/courses/${slug}`} className="text-indigo-400 mt-4 inline-block font-bold">
                    Back to Course
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
            {/* Breadcrumb */}
            <div className="mb-8 flex items-center gap-2 text-sm text-slate-400">
                <Link to="/courses" className="hover:text-indigo-400 transition-colors">Courses</Link>
                <ChevronRight size={16} />
                <Link to={`/courses/${slug}`} className="hover:text-indigo-400 transition-colors">
                    {course?.title}
                </Link>
                <ChevronRight size={16} />
                <span className="text-white font-bold">{lesson.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Video Section */}
                    <div className="glass rounded-[2rem] overflow-hidden border border-white/5">
                        {lesson.video_url ? (
                            <div className="aspect-video bg-slate-900 flex items-center justify-center">
                                <video 
                                    src={lesson.video_url} 
                                    controls 
                                    className="w-full h-full"
                                    poster={lesson.thumbnail}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        ) : (
                            <div className="aspect-video bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
                                <div className="text-center">
                                    <PlayCircle size={64} className="mx-auto text-white/30 mb-4" />
                                    <p className="text-white/50 font-bold">Video content coming soon</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Lesson Info */}
                    <div className="glass p-8 rounded-[2rem]">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                        Lesson {currentLessonIndex + 1}
                                    </span>
                                    {isCompleted && (
                                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                                            <CheckCircle size={12} /> Completed
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-3xl font-black text-white mb-3">{lesson.title}</h1>
                                <div className="flex items-center gap-4 text-slate-400 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} />
                                        <span>{lesson.duration || '10:00'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={16} />
                                        <span>{lesson.order || currentLessonIndex + 1} of {lessons.length}</span>
                                    </div>
                                </div>
                            </div>

                            {!isCompleted && (
                                <button
                                    onClick={handleCompleteLesson}
                                    disabled={completing}
                                    className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                                >
                                    {completing ? 'Marking...' : 'Mark Complete'}
                                </button>
                            )}
                        </div>

                        {lesson.content && (
                            <div className="prose prose-invert max-w-none">
                                <h3 className="text-xl font-bold text-white mb-4">Lesson Description</h3>
                                <p className="text-slate-300 leading-relaxed">{lesson.content}</p>
                            </div>
                        )}
                    </div>

                    {/* Resources */}
                    {lesson.resources && lesson.resources.length > 0 && (
                        <div className="glass p-8 rounded-[2rem]">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <FileText size={24} className="text-indigo-400" />
                                Lesson Resources
                            </h3>
                            <div className="space-y-3">
                                {lesson.resources.map((resource, index) => (
                                    <a
                                        key={index}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{resource.title}</p>
                                                <p className="text-xs text-slate-500">{resource.type || 'PDF'}</p>
                                            </div>
                                        </div>
                                        <Download size={20} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between items-center gap-4">
                        {previousLesson ? (
                            <Link
                                to={`/courses/${slug}/lessons/${previousLesson.id}`}
                                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all group"
                            >
                                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                Previous Lesson
                            </Link>
                        ) : (
                            <div></div>
                        )}

                        {nextLesson && (
                            <Link
                                to={`/courses/${slug}/lessons/${nextLesson.id}`}
                                className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-bold transition-all group ml-auto"
                            >
                                Next Lesson
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Sidebar - Course Progress */}
                <div className="space-y-6">
                    <div className="glass p-6 rounded-[2rem] sticky top-24">
                        <h3 className="text-lg font-black text-white mb-6">Course Content</h3>
                        <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                            {lessons.map((l, index) => {
                                const isCurrent = l.id === parseInt(lessonId);
                                return (
                                    <Link
                                        key={l.id}
                                        to={`/courses/${slug}/lessons/${l.id}`}
                                        className={`block p-3 rounded-xl transition-all ${
                                            isCurrent 
                                                ? 'bg-indigo-500/20 border border-indigo-500/30' 
                                                : 'bg-white/5 border border-white/5 hover:bg-white/10'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                                                isCurrent 
                                                    ? 'bg-indigo-500 text-white' 
                                                    : 'bg-slate-800 text-slate-500'
                                            }`}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-bold truncate ${
                                                    isCurrent ? 'text-indigo-400' : 'text-white'
                                                }`}>
                                                    {l.title}
                                                </p>
                                                <p className="text-xs text-slate-500">{l.duration || '10:00'}</p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                                                <div className="mt-6 pt-6 border-t border-white/5">
                            <Link
                                to={`/courses/${slug}`}
                                className="block w-full text-center bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all"
                            >
                                Back to Course
                            </Link>
                        </div>
                    </div>

                    {/* Completion Notice */}
                    {isCompleted && (
                        <div className="glass p-6 rounded-[2rem] border border-emerald-500/20">
                            <div className="flex items-start gap-4">
                                <CheckCircle size={28} className="text-emerald-400 shrink-0" />
                                <div>
                                    <h4 className="text-white font-black mb-1">
                                        Lesson Completed
                                    </h4>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        Progress saved. Move on or rewatch if you enjoy pain.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isCompleted && (
                        <div className="glass p-6 rounded-[2rem] border border-yellow-500/20">
                            <div className="flex items-start gap-4">
                                <AlertCircle size={28} className="text-yellow-400 shrink-0" />
                                <div>
                                    <h4 className="text-white font-black mb-1">
                                        Not Completed Yet
                                    </h4>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        Finish the lesson to unlock full progress tracking.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LessonDetail;
