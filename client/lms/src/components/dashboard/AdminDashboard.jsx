const AdminDashboard = ({ user, dashboardData }) => {
    const uiConfig = {
        users: { icon: Users, color: 'text-purple-400 bg-purple-400/10' },
        courses: { icon: BookOpen, color: 'text-indigo-400 bg-indigo-400/10' },
        enrollments: { icon: GraduationCap, color: 'text-pink-400 bg-pink-400/10' },
        categories: { icon: TrendingUp, color: 'text-emerald-400 bg-emerald-400/10' }
    };

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, {user?.first_name || user?.username}! 👋
                </h1>
                <p className="text-slate-400">Platform-wide analytics and management.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {dashboardData?.stats?.map((stat, index) => {
                    const config = uiConfig[stat.type] || uiConfig.courses;
                    const Icon = config.icon;
                    return (
                        <div key={index} className="glass p-6 rounded-3xl hover:bg-white/5 transition-all group border border-white/5">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`${config.color} p-3 rounded-2xl`}>
                                    <Icon size={24} />
                                </div>
                                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded-full uppercase tracking-wider">
                                    Live
                                </span>
                            </div>
                            <h3 className="text-sm text-slate-400 mb-1">{stat.label}</h3>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main List Section */}
                <div className="lg:col-span-2 glass p-8 rounded-3xl border border-white/5">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-white">Recent Global Activity</h2>
                        <button className="text-indigo-400 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                            View all <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {dashboardData?.recent_items?.length > 0 ? (
                            dashboardData.recent_items.map((item) => (
                                <div key={item.id} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex flex-col sm:flex-row items-center gap-6 hover:bg-white/10 transition-all border-l-4 border-l-indigo-500">
                                    <div className={`w-20 h-16 bg-gradient-to-br ${item.color || 'from-indigo-500 to-purple-600'} rounded-xl shadow-lg shrink-0`} />
                                    <div className="flex-1 min-w-0 w-full">
                                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                                            {item.category}
                                        </span>
                                        <h4 className="text-base font-bold text-white mt-1 mb-1 truncate">{item.title}</h4>
                                        <p className="text-sm text-slate-400">{item.instructor}</p>
                                    </div>
                                    <div className="w-full sm:w-48">
                                        <div className="flex justify-between text-xs mb-2">
                                            <span className="text-slate-400 font-medium">Users</span>
                                            <span className="text-white font-bold">{item.users || 0}</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out" 
                                                style={{ width: `${item.engagement || 0}%` }} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-slate-500 italic">No recent activity to display.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Section */}
                <div className="space-y-8">
                    <div className="glass p-6 rounded-3xl border border-white/5">
                        <div className="flex items-center gap-2 mb-6 text-indigo-400">
                            <Calendar size={20} />
                            <h2 className="text-lg font-bold text-white">System Alerts</h2>
                        </div>
                        
                        <div className="space-y-4 mb-6">
                            {dashboardData?.alerts?.map((alert, index) => (
                                <div key={index} className="flex gap-4 p-4 bg-white/5 rounded-2xl">
                                    <div className={`${alert.type === 'warning' ? 'bg-yellow-500' : 'bg-indigo-500'} text-white p-2 rounded-xl text-center min-w-[50px]`}>
                                        <p className="text-[10px] font-black uppercase opacity-80">{alert.date.split(' ')[0]}</p>
                                        <p className="text-lg font-black leading-none">{alert.date.split(' ')[1]}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{alert.title}</p>
                                        <p className="text-xs text-slate-400 mt-1">{alert.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full py-3 border border-indigo-500/20 text-indigo-400 rounded-2xl text-sm font-bold hover:bg-indigo-500 hover:text-white transition-all">
                            Manage Alerts
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;