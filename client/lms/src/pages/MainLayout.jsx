import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import UserMenu from '../components/navbar/UserMenu';

const MainLayout = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-[280px] flex flex-col transition-all">
                <header className="h-[80px] flex items-center justify-between px-10 sticky top-0 z-40 bg-slate-900/40 backdrop-blur-md border-b border-white/5">
                    <div className="flex-1">
                    </div>
                    <UserMenu />
                </header>
                <main className="p-10 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
