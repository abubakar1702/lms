import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileOverview from '../components/profile/ProfileOverview';
import ProfileEditForm from '../components/profile/ProfileEditForm';

const Profile = () => {
    const { setUser: setAuthUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        bio: '',
        date_of_birth: '',
        address: '',
        city: '',
        country: '',
        postal_code: '',
        profile: {
            student_id: '',
            instructor_id: '',
            department: '',
            specialization: '',
            years_of_experience: '',
            linkedin_url: '',
            github_url: '',
            website_url: '',
        }
    });

    const [displayData, setDisplayData] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('users/profile/');
            const data = response.data;

            setDisplayData(data);

            setFormData({
                first_name: data.first_name || '',
                last_name: data.last_name || '',
                phone_number: data.phone_number || '',
                bio: data.bio || '',
                date_of_birth: data.date_of_birth || '',
                address: data.address || '',
                city: data.city || '',
                country: data.country || '',
                postal_code: data.postal_code || '',
                profile: {
                    student_id: data.profile?.student_id || '',
                    instructor_id: data.profile?.instructor_id || '',
                    department: data.profile?.department || '',
                    specialization: data.profile?.specialization || '',
                    years_of_experience: data.profile?.years_of_experience || '',
                    linkedin_url: data.profile?.linkedin_url || '',
                    github_url: data.profile?.github_url || '',
                    website_url: data.profile?.website_url || '',
                }
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('profile.')) {
            const profileField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    [profileField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const cleanValue = (value) => {
                if (value === '' || value === null || value === undefined) {
                    return null;
                }
                return value;
            };

            const cleanIntValue = (value) => {
                if (value === '' || value === null || value === undefined) {
                    return null;
                }
                const num = parseInt(value, 10);
                return isNaN(num) ? null : num;
            };

            const cleanedData = {
                first_name: formData.first_name || '',
                last_name: formData.last_name || '',
                phone_number: cleanValue(formData.phone_number),
                bio: cleanValue(formData.bio),
                date_of_birth: cleanValue(formData.date_of_birth),
                address: cleanValue(formData.address),
                city: cleanValue(formData.city),
                country: cleanValue(formData.country),
                postal_code: cleanValue(formData.postal_code),
                profile: {
                    student_id: cleanValue(formData.profile.student_id),
                    instructor_id: cleanValue(formData.profile.instructor_id),
                    department: cleanValue(formData.profile.department),
                    specialization: cleanValue(formData.profile.specialization),
                    years_of_experience: cleanIntValue(formData.profile.years_of_experience),
                    linkedin_url: cleanValue(formData.profile.linkedin_url),
                    github_url: cleanValue(formData.profile.github_url),
                    website_url: cleanValue(formData.profile.website_url),
                }
            };

            const response = await api.patch('users/profile/', cleanedData);
            setDisplayData(response.data);
            setAuthUser(response.data);
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            console.error('Error details:', error.response?.data);
            const errorData = error.response?.data;
            let errorMessage = 'Failed to update profile. Please try again.';
            
            if (errorData) {
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (errorData.detail) {
                    errorMessage = errorData.detail;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                } else {
                    const firstError = Object.values(errorData).find(err => err);
                    if (firstError) {
                        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
                    }
                }
            }
            
            toast.error(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    const user = displayData;

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-700 pb-20">
            <ProfileHeader 
                user={user} 
                isEditing={isEditing} 
                setIsEditing={setIsEditing}
                setActiveTab={setActiveTab}
            />

            {/* Navigation Tabs */}
            <div className="px-6 md:px-10 mb-10 border-b border-white/5">
                <div className="flex gap-8">
                    <button
                        onClick={() => { setActiveTab('overview'); setIsEditing(false); }}
                        className={`pb-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'overview' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => { setActiveTab('settings'); setIsEditing(true); }}
                        className={`pb-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'settings' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                    >
                        Profile Settings
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="px-6 md:px-10">
                {activeTab === 'overview' ? (
                    <ProfileOverview user={user} />
                ) : (
                    <ProfileEditForm 
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        saving={saving}
                        setIsEditing={setIsEditing}
                        setActiveTab={setActiveTab}
                        fetchProfile={fetchProfile}
                        user={user}
                    />
                )}
            </div>
        </div>
    );
};

export default Profile;