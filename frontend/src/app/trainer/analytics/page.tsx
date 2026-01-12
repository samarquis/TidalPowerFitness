'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

interface PopularClass {
    name: string;
    avg_attendance: string;
    session_count: string;
}

interface PopularExercise {
    name: string;
    use_count: string;
}

interface AnalyticsData {
    popular_classes: PopularClass[];
    popular_exercises: PopularExercise[];
    summary: {
        unique_clients: string;
        total_volume_lbs: string;
    };
}

export default function TrainerAnalyticsPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (authLoading) return;

        if (isAuthenticated && !user?.roles?.includes('trainer') && !user?.roles?.includes('admin')) {
            router.push('/');
            return;
        }

        if (isAuthenticated) {
            fetchAnalytics();
        } else {
            router.push('/login?redirect=/trainer/analytics');
        }
    }, [isAuthenticated, authLoading, user, router]);

    const fetchAnalytics = async () => {
        try {
            const response = await apiClient.getTrainerAnalytics();
            if (response.data) {
                setData(response.data);
            } else if (response.error) {
                setError(response.error);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setError('Failed to fetch analytics');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated || (!user?.roles?.includes('trainer') && !user?.roles?.includes('admin'))) {
        return null;
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/trainer" className="text-turquoise-surf hover:text-pacific-cyan mb-4 inline-block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Trainer <span className="text-gradient">Analytics</span>
                    </h1>
                    <p className="text-xl text-gray-300">
                        Insights into your most popular classes and frequently used exercises
                    </p>
                </div>

                {/* Summary Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="glass rounded-2xl p-8 border-turquoise-surf/20 bg-gradient-to-br from-turquoise-surf/10 to-transparent">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Unique Clients Coached</div>
                        <div className="text-5xl font-black text-white italic">{data?.summary?.unique_clients || 0}</div>
                        <div className="mt-4 text-xs text-turquoise-surf font-bold uppercase tracking-tighter">Individuals trained across all sessions</div>
                    </div>
                    <div className="glass rounded-2xl p-8 border-cerulean/20 bg-gradient-to-br from-cerulean/10 to-transparent">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Total Volume Coached</div>
                        <div className="text-5xl font-black text-white italic">
                            {data?.summary?.total_volume_lbs ? (parseInt(data.summary.total_volume_lbs) / 1000).toFixed(1) + 'k' : '0'}
                            <span className="text-xl ml-2 not-italic text-gray-600">LBS</span>
                        </div>
                        <div className="mt-4 text-xs text-cerulean font-bold uppercase tracking-tighter">Cumulative weight lifted by your clients</div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
                        <p className="mt-4 text-gray-400">Loading analytics...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-6 rounded-xl text-center">
                        {error}
                    </div>
                ) : !data ? (
                    <div className="glass rounded-xl p-12 text-center text-gray-400">
                        No analytics data available yet.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Popular Classes */}
                        <div className="glass rounded-xl p-6">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <span className="text-yellow-400 text-3xl">🔥</span> Most Popular Classes
                            </h2>
                            <div className="space-y-4">
                                {data.popular_classes.length === 0 ? (
                                    <p className="text-gray-500">No class data yet</p>
                                ) : (
                                    data.popular_classes.map((cls, index) => (
                                        <div key={index} className="bg-white/5 p-4 rounded-lg flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-lg">{cls.name}</div>
                                                <div className="text-sm text-gray-400">{cls.session_count} sessions held</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-turquoise-surf">{parseFloat(cls.avg_attendance).toFixed(1)}</div>
                                                <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Avg Attendance</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Top Exercises */}
                        <div className="glass rounded-xl p-6">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <span className="text-blue-400 text-3xl">💪</span> Top Used Exercises
                            </h2>
                            <div className="space-y-3">
                                {data.popular_exercises.length === 0 ? (
                                    <p className="text-gray-500">No exercise data yet</p>
                                ) : (
                                    data.popular_exercises.map((ex, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-gray-400">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold">{ex.name}</span>
                                                    <span className="text-sm text-gray-400">{ex.use_count} times</span>
                                                </div>
                                                <div className="w-full bg-white/5 h-1.5 rounded-full mt-1">
                                                    <div 
                                                        className="bg-blue-500 h-full rounded-full" 
                                                        style={{ width: `${(parseInt(ex.use_count) / parseInt(data.popular_exercises[0].use_count)) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
