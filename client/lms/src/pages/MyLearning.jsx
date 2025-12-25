import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import {
  BookOpen,
  Clock,
  Award,
  PlayCircle,
  CheckCircle,
  TrendingUp,
  Search,
} from "lucide-react";

const MyLearning = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await api.get("enrollments/");
      setEnrollments(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesSearch = enrollment.course_details.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "completed"
        ? enrollment.progress === 100
        : filter === "in_progress"
        ? enrollment.progress < 100 && enrollment.progress > 0
        : true;

    if (filter === "completed")
      return matchesSearch && enrollment.progress === 100;
    if (filter === "in_progress")
      return matchesSearch && enrollment.progress < 100;
    return matchesSearch;
  });

  const stats = {
    total: enrollments.length,
    completed: enrollments.filter((e) => e.progress === 100).length,
    inProgress: enrollments.filter((e) => e.progress < 100).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Learning</h1>
          <p className="text-slate-400">
            Track your progress and continue where you left off.
          </p>
        </div>

        {/* Stats Mini-Cards */}
        <div className="flex gap-4">
          <div className="glass px-5 py-3 rounded-2xl flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">
                Enrolled
              </p>
              <p className="text-xl font-black text-white">{stats.total}</p>
            </div>
          </div>
          <div className="glass px-5 py-3 rounded-2xl flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Award size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">
                Completed
              </p>
              <p className="text-xl font-black text-white">{stats.completed}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 pb-6 border-b border-white/5">
        <div className="flex bg-white/5 p-1 rounded-xl">
          {["all", "in_progress", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                filter === f
                  ? "bg-indigo-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="relative group w-full md:w-auto">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search my courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-[250px] bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:bg-white/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      {filteredEnrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="glass rounded-[2rem] overflow-hidden flex flex-col group hover:bg-white/5 transition-all"
            >
              <div className="relative h-40 overflow-hidden">
                {enrollment.course_details.thumbnail ? (
                  <img
                    src={
                      enrollment.course_details.thumbnail.startsWith("http")
                        ? enrollment.course_details.thumbnail
                        : `http://localhost:8000${enrollment.course_details.thumbnail}`
                    }
                    alt={enrollment.course_details.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <BookOpen size={32} className="text-slate-600" />
                  </div>
                )}

                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors"></div>

                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase border border-white/10">
                  {enrollment.course_details.category_name}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                  {enrollment.course_details.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-400 mb-6">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{enrollment.course_details.duration || "10h"}</span>
                  </div>
                  <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                  <div>{enrollment.course_details.instructor_name}</div>
                </div>

                <div className="mt-auto space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span
                        className={
                          enrollment.progress === 100
                            ? "text-emerald-400"
                            : "text-slate-300"
                        }
                      >
                        {enrollment.progress === 100
                          ? "Completed"
                          : `${Math.round(enrollment.progress)}% Complete`}
                      </span>
                      <span className="text-slate-500">
                        {enrollment.progress === 100 ? (
                          <CheckCircle size={14} className="text-emerald-500" />
                        ) : (
                          <TrendingUp size={14} />
                        )}
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          enrollment.progress === 100
                            ? "bg-emerald-500"
                            : "bg-indigo-500"
                        }`}
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    to={`/courses/${enrollment.course_details.slug}`}
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all ${
                      enrollment.progress === 100
                        ? "bg-white/5 text-slate-300 hover:bg-white/10"
                        : "bg-indigo-500 text-white hover:bg-indigo-400 hover:-translate-y-0.5 shadow-lg shadow-indigo-500/20"
                    }`}
                  >
                    {enrollment.progress === 100 ? (
                      <>Review Course</>
                    ) : (
                      <>
                        {" "}
                        <PlayCircle size={18} /> Continue Learning
                      </>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-[2rem] border border-dashed border-white/10">
          <BookOpen size={64} className="mx-auto text-slate-700 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">
            No active courses
          </h2>
          <p className="text-slate-400 max-w-md mx-auto mb-8">
            {filter === "all"
              ? "You haven't enrolled in any courses yet. Start your journey today!"
              : "No courses found matching this filter."}
          </p>
          {filter === "all" && (
            <Link
              to="/courses"
              className="bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-400 transition-all inline-flex items-center gap-2"
            >
              Browse Courses
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default MyLearning;
