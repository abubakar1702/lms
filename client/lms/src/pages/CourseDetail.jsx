import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import CourseHero from '../components/course/CourseHero';
import CourseOverview from '../components/course/CourseOverview';
import CourseCurriculum from '../components/course/CourseCurriculum';
import CourseSidebar from '../components/course/CourseSidebar';

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    const fetchCourseDetail = async () => {
        try {
            setLoading(true);
            const res = await api.get(`courses/courses/${slug}/`);
            setCourse(res.data);
        } catch (err) {
            console.error("Error fetching course:", err);
            console.error("Error details:", err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const checkEnrollmentStatus = async () => {
        try {
            const res = await api.get('enrollments/');
            const enrollments = res.data.results || res.data;
            // Check if any enrollment matches current course slug
            setIsEnrolled(enrollments.some(e => e.course_details?.slug === slug));
        } catch (err) {
            console.error("Error checking enrollment:", err);
        }
    };

    const handleEnroll = async () => {
        if (isEnrolled) return;
        try {
            setEnrolling(true);
            await api.post('enrollments/', { course: course.id });
            setIsEnrolled(true);
        } catch (err) {
            alert("Failed to enroll. Please try again.");
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
        <div className="max-w-7xl mx-auto px-4 py-8">
            <CourseHero
                course={course}
                isEnrolled={isEnrolled}
                enrolling={enrolling}
                handleEnroll={handleEnroll}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
                <div className="lg:col-span-2">
                    {/* Tabs Navigation */}
                    <div className="flex border-b border-white/5 mb-8 gap-8 overflow-x-auto">
                        {['overview', 'curriculum', 'instructor', 'reviews'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 font-bold capitalize whitespace-nowrap transition-colors ${
                                    activeTab === tab ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' && <CourseOverview course={course} />}
                    
                    {activeTab === 'curriculum' && (
                        <CourseCurriculum course={course} isEnrolled={isEnrolled} />
                    )}
                    
                    {activeTab === 'instructor' && (
                        <div className="glass rounded-2xl p-8">
                            {course.instructor ? (
                                <div className="flex gap-6 items-start">
                                    <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center font-bold text-xl text-indigo-400 shrink-0">
                                        {course.instructor.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">
                                            {course.instructor.first_name} {course.instructor.last_name || course.instructor.username}
                                        </h3>
                                        <p className="text-indigo-400 text-sm mb-4">{course.instructor.email}</p>
                                        <p className="text-slate-400 leading-relaxed">
                                            Professional Instructor in {course.category_name}.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-400">No instructor assigned to this course.</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <CourseSidebar course={course} />
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;