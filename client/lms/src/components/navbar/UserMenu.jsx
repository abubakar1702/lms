import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Settings, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserMenu = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-white transition-colors relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-900"></span>
            </button>

            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-3 p-1.5 pl-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                    <span className="text-sm font-medium pr-1">{user?.first_name || user?.username}</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs">
                        {user?.first_name?.charAt(0) || 'U'}
                    </div>
                </button>

                {isOpen && (
                    <div className="absolute top-full right-0 mt-3 w-56 glass rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                        <Link to="/profile" className="nav-link !py-2.5 !px-3 text-sm" onClick={() => setIsOpen(false)}>
                            <User size={18} />
                            <span>My Profile</span>
                        </Link>
                        <Link to="/settings" className="nav-link !py-2.5 !px-3 text-sm" onClick={() => setIsOpen(false)}>
                            <Settings size={18} />
                            <span>Settings</span>
                        </Link>
                        <div className="h-px bg-white/10 my-2 mx-1"></div>
                        <button
                            onClick={logout}
                            className="nav-link w-full !py-2.5 !px-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserMenu;
