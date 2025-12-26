import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    GraduationCap,
    Users,
    BarChart3,
    UserCircle,
    LogOut,
    PlusSquare,
    Library,
    ClipboardList // Added a new icon for Enrollments
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getNavItems = () => {
        const common = [
            { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/profile', label: 'Profile', icon: UserCircle },
        ];

        const studentItems = [
            { path: '/courses', label: 'Browse Courses', icon: Library },
            { path: '/my-enrollments', label: 'My Learning', icon: GraduationCap },
        ];

        const instructorItems = [
            { path: '/instructor/courses', label: 'My Courses', icon: BookOpen },
            { path: '/instructor/create-course', label: 'Create Course', icon: PlusSquare },
        ];

        const adminItems = [
            { path: '/admin/users', label: 'Manage Users', icon: Users },
            { path: '/admin/courses', label: 'Manage Courses', icon: Library },
            { path: '/admin/enrollments', label: 'Enrollments', icon: ClipboardList },
            { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
        ];

        if (user?.role === 'admin') return [...common, ...adminItems];
        if (user?.role === 'instructor') return [...common, ...instructorItems];
        return [...common, ...studentItems];
    };

    return (
        <aside className="w-[280px] glass h-screen fixed left-0 top-0 flex flex-col z-50 p-6">
            <div className="flex items-center gap-3 pb-10 px-2 text-2xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                <GraduationCap size={32} className="text-indigo-400" />
                <span>LMS Pro</span>
            </div>

            <nav className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                {getNavItems().map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/dashboard'}
                        className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="pt-6 border-t border-white/10 mt-auto">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg">
                        {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">
                            {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username}
                        </div>
                        <div className="text-xs text-slate-400 capitalize">{user?.role}</div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="nav-link w-full text-left hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;