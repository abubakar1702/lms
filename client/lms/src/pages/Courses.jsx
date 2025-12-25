import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    Search,
    Filter,
    BookOpen,
    Clock,
    BarChart,
    Star,
    ChevronRight,
    TrendingUp,
    LayoutGrid,
    List as ListIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [coursesRes, catsRes, enrollmentsRes] = await Promise.all([
                api.get('courses/courses/'),
                api.get('courses/categories/'),
                api.get('enrollments/')
            ]);
            
            console.log('Courses response:', coursesRes.data);
            console.log('Categories response:', catsRes.data);
            console.log('Enrollments response:', enrollmentsRes.data);
            
            const coursesData = coursesRes.data?.results || coursesRes.data || [];
            setCourses(Array.isArray(coursesData) ? coursesData : []);
            
            const categoriesData = catsRes.data?.results || catsRes.data || [];
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);

            const enrollments = enrollmentsRes.data?.results || enrollmentsRes.data || [];
            const enrolledIds = new Set(Array.isArray(enrollments) ? enrollments.map(e => e.course) : []);
            setEnrolledCourseIds(enrolledIds);

        } catch (error) {
            console.error('Error fetching data:', error);
            console.error('Error details:', error.response?.data);
            setCourses([]);
            setCategories([]);
            setEnrolledCourseIds(new Set());
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = Array.isArray(courses) ? courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
            course.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || course.category_name === selectedCategory;
        return matchesSearch && matchesCategory;
    }) : [];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Explore Courses</h1>
                    <p className="text-slate-400">Expand your knowledge with our world-class courses.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm w-full md:w-[300px] focus:bg-white/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
                        />
                    </div>
                    <button className="glass p-3 rounded-2xl text-slate-400 hover:text-white transition-all">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Categories & View Options */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 pb-6 border-b border-white/5">
                <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                    <button
                        onClick={() => setSelectedCategory('All')}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${selectedCategory === 'All'
                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                    >
                        All Courses
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.name)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${selectedCategory === cat.name
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="flex items-center bg-white/5 rounded-xl p-1 shrink-0">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <ListIcon size={18} />
                    </button>
                </div>
            </div>

            {/* Courses Grid/List */}
            {filteredCourses.length > 0 ? (
                <div className={viewMode === 'grid'
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    : "flex flex-col gap-6"
                }>
                    {filteredCourses.map((course) => {
                        const isEnrolled = enrolledCourseIds.has(course.id);
                        const instructor = course.instructor || null;
                        return (
                            <Link
                                to={`/courses/${course.slug}`}
                                key={course.id}
                                className={`group glass rounded-[2rem] overflow-hidden hover:bg-white/5 transition-all duration-300 hover:-translate-y-2 border border-white/5 ${viewMode === 'list' ? 'flex flex-col sm:flex-row gap-6' : ''}`}
                            >
                                <div className={`relative ${viewMode === 'list' ? 'sm:w-[350px] shrink-0' : 'aspect-video'}`}>
                                    {course.thumbnail ? (
                                        <img 
                                            src={course.thumbnail.startsWith('http') ? course.thumbnail : `http://localhost:8000${course.thumbnail}`} 
                                            alt={course.title} 
                                            className="w-full h-full object-cover" 
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-8">
                                            <BookOpen size={48} className="text-white/40 group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                                        {course.category_name}
                                    </div>
                                    <div className={`absolute bottom-4 right-4 px-4 py-1.5 rounded-full text-sm font-black text-white shadow-lg ${isEnrolled ? 'bg-emerald-500' : 'bg-indigo-500'}`}>
                                        {isEnrolled ? 'Enrolled' : `$${course.price}`}
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col justify-between flex-1">
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} className={i < 4 ? "text-yellow-400 fill-yellow-400" : "text-slate-600"} />
                                                ))}
                                            </div>
                                            <span className="text-xs text-slate-500 font-medium">(4.8 • 120 reviews)</span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">
                                            {course.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed">
                                            {course.description}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-xs text-slate-500 pb-4 border-b border-white/5">
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-indigo-400" />
                                                <span>{course.duration || '10 hours'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <BarChart size={14} className="text-purple-400" />
                                                <span className="capitalize">{course.level}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <BookOpen size={14} className="text-pink-400" />
                                                <span>{course.lesson_count} lessons</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-indigo-400">
                                                    {instructor?.first_name?.charAt(0) || instructor?.username?.charAt(0) || 'I'}
                                                </div>
                                                <span className="text-xs font-semibold text-slate-300">
                                                    {instructor ? `${instructor.first_name || ''} ${instructor.last_name || ''}`.trim() || instructor.username : 'Instructor'}
                                                </span>
                                            </div>
                                            <div className={`font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all ${isEnrolled ? 'text-emerald-400' : 'text-indigo-400'}`}>
                                                {isEnrolled ? 'Continue Learning' : 'Enroll now'} <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20 glass rounded-[2rem] border border-dashed border-white/10">
                    <BookOpen size={64} className="mx-auto text-slate-700 mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-2">No courses found</h2>
                    <p className="text-slate-400 max-w-md mx-auto">
                        We couldn't find any courses matching your criteria. Try adjusting your search or filters.
                    </p>
                    <button
                        onClick={() => { setSearch(''); setSelectedCategory('All'); }}
                        className="mt-8 text-indigo-400 font-bold hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default Courses;
