'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

interface WorkoutSession {
    id: string;
    session_date: string;
    duration_minutes: number;
    workout_type_name?: string;
    class_name?: string;
    participant_count?: number;
}

export default function HistoryPage() {
    const { user, loading: authLoading, token } = useAuth();
    const router = useRouter();
    const [sessions, setSessions] = useState<WorkoutSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Wait for auth to finish loading
        if (authLoading) return;

        // Redirect to login if not authenticated
        if (!user) {
            router.push('/login?redirect=/workouts/history');
            return;
        }
        fetchSessions();
    }, [user, authLoading, router]);

    const fetchSessions = async () => {
        try {
            const response = await apiClient.getWorkoutSessions();
            if (response.data) {
                const data = response.data;
                setSessions(Array.isArray(data) ? data : []);
            } else if (response.error) {
                throw new Error(response.error);
            }
        } catch (error: any) {
            console.error('Error fetching sessions:', error);
            setError(error.message || 'Failed to load workout history. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
                    <p className="mt-4 text-gray-400">Loading history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="glass rounded-xl p-8">
                        <div className="text-red-400 text-5xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold mb-4">Error Loading History</h2>
                        <p className="text-gray-400 mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white font-bold rounded-lg transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">
                        Workout <span className="text-gradient">History</span>
                    </h1>
                    {user?.roles?.includes('trainer') || user?.roles?.includes('admin') ? (
                        <Link
                            href="/workouts/templates"
                            className="px-6 py-3 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white font-bold rounded-lg transition-all"
                        >
                            Start New Workout
                        </Link>
                    ) : (
                        <Link
                            href="/classes"
                            className="px-6 py-3 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white font-bold rounded-lg transition-all"
                        >
                            Browse Classes
                        </Link>
                    )}
                </div>

                {sessions.length === 0 ? (
                    <div className="glass rounded-xl p-12 text-center">
                        <p className="text-xl text-gray-400 mb-6">No workouts found yet.</p>
                        {user?.roles?.includes('trainer') || user?.roles?.includes('admin') ? (
                            <Link
                                href="/workouts/templates"
                                className="inline-block px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all"
                            >
                                Browse Templates
                            </Link>
                        ) : (
                            <Link
                                href="/classes"
                                className="inline-block px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all"
                            >
                                Book a Class
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {sessions.map((session) => (
                            <Link
                                key={session.id}
                                href={`/workouts/history/${session.id}`}
                                className="glass p-6 rounded-xl hover:bg-white/5 transition-all group"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-sm text-gray-400 mb-1">
                                            {new Date(session.session_date).toLocaleDateString(undefined, {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <h3 className="text-xl font-bold group-hover:text-turquoise-surf transition-colors">
                                            {session.workout_type_name || session.class_name || 'Workout Session'}
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-turquoise-surf">
                                            {session.duration_minutes || 0} min
                                        </div>
                                        {session.participant_count !== undefined && session.participant_count > 0 && (
                                            <div className="text-sm text-gray-400">
                                                {session.participant_count} Participants
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
