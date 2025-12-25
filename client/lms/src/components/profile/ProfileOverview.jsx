import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const ProfileOverview = ({ user }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* About Card */}
            <div className="lg:col-span-2 space-y-8">
                <div className="glass p-8 rounded-[2rem]">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><User size={20} /></div>
                        About {user?.first_name}
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-lg">
                        {user?.bio || "No bio added yet. Click 'Edit Profile' to tell us about yourself."}
                    </p>
                </div>

                {/* Contact Info (moved here instead of Department / Specialization) */}
                <div className="glass p-6 rounded-[2rem] space-y-4 mt-4">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">
                        Contact Info
                    </h4>

                    <div className="flex items-center gap-4 text-slate-300">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-indigo-400">
                            <Mail size={18} />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs text-slate-500 font-bold">Email Address</p>
                            <p className="text-sm truncate">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-slate-300">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-indigo-400">
                            <Phone size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold">Phone</p>
                            <p className="text-sm">{user?.phone_number || 'Not set'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-slate-300">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-indigo-400">
                            <MapPin size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold">Location</p>
                            <p className="text-sm">
                                {user?.city || 'City not set'}
                                {user?.country ? `, ${user.country}` : ''}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-slate-300">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-indigo-400">
                            <Calendar size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold">Joined</p>
                            <p className="text-sm">
                                {new Date(user?.date_joined || Date.now()).toLocaleDateString('en-US', {
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Info (can be extended later if needed) */}
            <div className="space-y-6">
                <div className="glass p-8 rounded-[2rem] flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Calendar size={32} className="text-white" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">Member Since</p>
                        <p className="text-white font-black text-xl">
                            {new Date(user?.date_joined || Date.now()).toLocaleDateString('en-US', {
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileOverview;
