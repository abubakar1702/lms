import { User, Edit2, Camera, Linkedin, Github, Globe } from 'lucide-react';

const ProfileHeader = ({ user, isEditing, setIsEditing, setActiveTab }) => {
    return (
        <div className="px-6 md:px-10 pt-10 mb-10">
            <div className="flex flex-col md:flex-row items-end gap-6">
                {/* Avatar */}
                <div className="relative group">
                    <div className="w-40 h-40 rounded-[2rem] p-1.5 bg-slate-950 shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-500">
                        <div className="w-full h-full rounded-[1.7rem] bg-slate-800 flex items-center justify-center overflow-hidden relative">
                            {user?.profile_picture ? (
                                <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-5xl font-black text-indigo-400">
                                    {user?.first_name?.charAt(0) || user?.username?.charAt(0)}
                                </span>
                            )}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera className="text-white" size={32} />
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-full border-4 border-slate-950">
                        {user?.role?.toUpperCase()}
                    </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1 pb-4 text-center md:text-left">
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                        {user?.first_name} {user?.last_name}
                    </h1>
                    <p className="text-lg text-slate-400 font-medium mb-4">@{user?.username} • {user?.email}</p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        {user?.profile?.linkedin_url && (
                            <a href={user.profile.linkedin_url} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-xl text-blue-400 hover:bg-blue-500/20 transition-colors">
                                <Linkedin size={20} />
                            </a>
                        )}
                        {user?.profile?.github_url && (
                            <a href={user.profile.github_url} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-xl text-white hover:bg-white/20 transition-colors">
                                <Github size={20} />
                            </a>
                        )}
                        {user?.profile?.website_url && (
                            <a href={user.profile.website_url} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-xl text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                                <Globe size={20} />
                            </a>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="pb-4">
                    <button
                        onClick={() => {
                            setIsEditing(!isEditing);
                            setActiveTab('settings');
                        }}
                        className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${isEditing
                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                                : 'bg-white text-slate-900 hover:bg-indigo-50 hover:scale-105'
                            }`}
                    >
                        {isEditing ? <><User size={18} /> Cancel Editing</> : <><Edit2 size={18} /> Edit Profile</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;