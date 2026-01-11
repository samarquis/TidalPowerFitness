'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    roles: string[];
    credits: number;
    current_streak: number;
    longest_streak: number;
    last_workout_date?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
    register: (userData: any) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
    refreshUser: () => Promise<void>;
    spoofRole: (newRole: 'admin' | 'trainer' | 'client' | 'real') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            // Try to get profile. If cookie exists and is valid, this will succeed.
            const response = await apiClient.getProfile();
            if (response.data && response.data.user) {
                setUser(response.data.user);
                // Token is no longer managed in JS
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Check if user is logged in on mount
        checkAuth();
    }, []);

    const refreshUser = async () => {
        setLoading(true);
        await checkAuth();
    }

    const spoofRole = async (newRole: 'admin' | 'trainer' | 'client' | 'real') => {
        try {
            await apiClient.post('/users/spoof-role', { newRole });
            // Easiest way to re-evaluate all auth is to just reload
            window.location.reload();
        } catch (error) {
            console.error(`Failed to spoof role to ${newRole}:`, error);
            // Optionally, show a toast or notification to the user
        }
    };

    const login = async (email: string, password: string) => {
        const response = await apiClient.login(email, password);
        if (response.data) {
            const { user } = response.data;
            // Token is set in HttpOnly cookie by backend
            setUser(user);
            return { success: true, user };
        }
        return { success: false, error: response.error };
    };

    const register = async (userData: any) => {
        const response = await apiClient.register(userData);
        if (response.data) {
            const { user } = response.data;
            // Token is set in HttpOnly cookie by backend
            setUser(user);
            return { success: true };
        }
        return { success: false, error: response.error };
    };

    const logout = async () => {
        try {
            await apiClient.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear local state
            setUser(null);
            setToken(null);
            // Reload to clear all state
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
                refreshUser,
                spoofRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
