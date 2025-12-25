import { User, MapPin, Briefcase } from 'lucide-react';

const ProfileEditForm = ({ 
    formData, 
    handleChange, 
    handleSubmit, 
    saving, 
    setIsEditing, 
    setActiveTab, 
    fetchProfile,
    user 
}) => {
    return (
        <div className="glass p-8 md:p-12 rounded-[2rem] animate-in slide-in-from-bottom-4 duration-500">
            <form onSubmit={handleSubmit} className="space-y-10">
                {/* Personal Information */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
                        <User className="text-indigo-400" />
                        <h4 className="text-lg font-bold text-white">Personal Information</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="auth-input"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="auth-input"
                            />
                        </div>
                        <div className="col-span-full space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="4"
                                className="auth-input resize-none"
                                placeholder="Tell us a little about yourself..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Phone</label>
                            <input
                                type="text"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="auth-input"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Date of Birth</label>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                className="auth-input [color-scheme:dark]"
                            />
                        </div>
                    </div>
                </section>

                {/* Address */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
                        <MapPin className="text-emerald-400" />
                        <h4 className="text-lg font-bold text-white">Location Details</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                        <div className="md:col-span-3 space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Street Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="auth-input"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="auth-input"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="auth-input"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Postal Code</label>
                            <input
                                type="text"
                                name="postal_code"
                                value={formData.postal_code}
                                onChange={handleChange}
                                className="auth-input"
                            />
                        </div>
                    </div>
                </section>

                {/* Academic / Professional Link (Role Based) */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
                        <Briefcase className="text-purple-400" />
                        <h4 className="text-lg font-bold text-white">
                            {user?.role === 'instructor' ? 'Professional Profile' : 'Academic Profile'}
                        </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {user?.role === 'student' && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Student ID</label>
                                <input
                                    type="text"
                                    name="profile.student_id"
                                    value={formData.profile.student_id}
                                    onChange={handleChange}
                                    className="auth-input"
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">LinkedIn URL</label>
                            <input
                                type="url"
                                name="profile.linkedin_url"
                                value={formData.profile.linkedin_url}
                                onChange={handleChange}
                                className="auth-input"
                            />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end gap-4 pt-6">
                    <button
                        type="button"
                        onClick={() => {
                            setIsEditing(false);
                            setActiveTab('overview');
                            fetchProfile();
                        }}
                        className="px-8 py-4 rounded-xl font-bold hover:bg-white/10 text-slate-300 transition-all"
                        disabled={saving}
                    >
                        Cancel Changes
                    </button>
                    <button
                        type="submit"
                        className="bg-indigo-500 text-white px-10 py-4 rounded-xl font-bold hover:bg-indigo-400 hover:shadow-lg hover:shadow-indigo-500/20 transition-all transform hover:-translate-y-1"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Updates'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileEditForm;