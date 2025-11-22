'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: 'client' | 'trainer' | 'admin';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (userData: any) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                apiClient.setToken(token);
                const response = await apiClient.getProfile();
                if (response.data) {
                    setUser(response.data.user);
                } else {
                    localStorage.removeItem('auth_token');
                    apiClient.setToken(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await apiClient.login(email, password);
        if (response.data) {
            const { token, user } = response.data;
            apiClient.setToken(token);
            setUser(user);
            return { success: true };
        }
        return { success: false, error: response.error };
    };

    const register = async (userData: any) => {
        const response = await apiClient.register(userData);
        if (response.data) {
            const { token, user } = response.data;
            apiClient.setToken(token);
            setUser(user);
            return { success: true };
        }
        return { success: false, error: response.error };
    };

    const logout = () => {
        apiClient.setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
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
