'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="glass rounded-2xl p-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Avatar Placeholder */}
                        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-teal-6 to-teal-6 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                            {user.first_name[0]}{user.last_name[0]}
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                {user.first_name} {user.last_name}
                            </h1>
                            <p className="text-teal-400 font-semibold mb-6 uppercase tracking-wide">
                                {user.roles.join(', ')} Account
                            </p>

                            <div className="space-y-4 text-gray-300">
                                <div className="flex flex-col md:flex-row md:gap-12 border-t border-white/10 pt-4">
                                    <div className="mb-4 md:mb-0">
                                        <span className="block text-sm text-gray-500 uppercase tracking-wider mb-1">Email</span>
                                        <span className="text-lg">{user.email}</span>
                                    </div>
                                    <div>
                                        <span className="block text-sm text-gray-500 uppercase tracking-wider mb-1">Member Since</span>
                                        <span className="text-lg">{new Date().getFullYear()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <button
                                    onClick={logout}
                                    className="px-6 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50 rounded-lg transition-all font-semibold"
                                >
                                    Sign Out
                                </button>
                                {user.roles.includes('admin') && (
                                    <button
                                        onClick={() => router.push('/admin/classes')}
                                        className="px-6 py-3 bg-teal-6/20 hover:bg-teal-6/30 text-teal-400 border border-teal-6/50 rounded-lg transition-all font-semibold"
                                    >
                                        Admin Dashboard
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
