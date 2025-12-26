import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LogIn from './components/auth/LogIn';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './pages/MainLayout';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import LessonDetail from './pages/LessonDetail';
import Profile from './pages/Profile';
import MyLearning from './pages/MyLearning';
import AdminUsers from './pages/AdminUsers';
import AdminCourses from './pages/AdminCourses';
import AdminEnrollments from './pages/AdminEnrollments';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgotPassword />} />

          {/* Protected Routes inside MainLayout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:slug" element={<CourseDetail />} />
            <Route path="courses/:slug/lessons/:lessonId" element={<LessonDetail />} />
            <Route path="my-enrollments" element={<MyLearning />} />
            <Route path="instructor/courses" element={<div>Instructor Courses (Coming Soon)</div>} />
            <Route path="instructor/create-course" element={<div>Create Course (Coming Soon)</div>} />
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="admin/courses" element={<AdminCourses />} />
            <Route path="admin/enrollments" element={<AdminEnrollments />} />
            <Route path="admin/reports" element={<div>Reports (Coming Soon)</div>} />
          </Route>

          {/* Fallback routes */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
