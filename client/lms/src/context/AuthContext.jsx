import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('access_token');
        if (token) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('users/profile/');
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('users/login/', { email, password });
            const { access, refresh } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            await fetchUserProfile();
            return { success: true };
        } catch (error) {
            console.error('Login error:', error.response?.data);
            // Handle different error formats
            const errorData = error.response?.data;
            let errorMessage = 'Login failed';
            
            if (errorData) {
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (errorData.detail) {
                    errorMessage = errorData.detail;
                } else if (errorData.email) {
                    errorMessage = Array.isArray(errorData.email) ? errorData.email[0] : errorData.email;
                } else if (errorData.password) {
                    errorMessage = Array.isArray(errorData.password) ? errorData.password[0] : errorData.password;
                } else if (errorData.non_field_errors) {
                    errorMessage = Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors[0] : errorData.non_field_errors;
                }
            }
            
            return {
                success: false,
                error: errorMessage
            };
        }
    };

    const register = async (userData) => {
        // Send fields expected by the backend RegisterSerializer,
        // including the chosen role (student/instructor).
        const payload = {
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            password: userData.password,
            password_confirm: userData.password_confirm,
            role: userData.role,
        };

        try {
            await api.post('users/register/', payload);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || 'Registration failed'
            };
        }
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                await api.post('users/logout/', { refresh: refreshToken });
            }
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
        }
    };

    const requestPasswordReset = async (email) => {
        try {
            const response = await api.post('users/password-reset/request/', { email });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.email?.[0] || error.response?.data?.detail || 'Failed to send OTP'
            };
        }
    };

    const verifyOTP = async (email, otp) => {
        try {
            const response = await api.post('users/password-reset/verify-otp/', { email, otp });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.otp?.[0] || error.response?.data?.detail || 'Invalid OTP'
            };
        }
    };

    const resetPassword = async (email, otp, newPassword, newPasswordConfirm) => {
        try {
            const response = await api.post('users/password-reset/confirm/', {
                email,
                otp,
                new_password: newPassword,
                new_password_confirm: newPasswordConfirm
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || 'Failed to reset password'
            };
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            login, 
            register, 
            logout, 
            setUser,
            requestPasswordReset,
            verifyOTP,
            resetPassword
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
