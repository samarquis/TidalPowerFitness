'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface WorkoutSession {
    id: string;
    session_date: string;
    duration_minutes: number;
    workout_type_name?: string;
    class_name?: string;
    participant_count?: number;
}

export default function HistoryPage() {
    const { user, token } = useAuth();
    const [sessions, setSessions] = useState<WorkoutSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/workout-sessions`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setSessions(data);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-4"></div>
                    <p className="mt-4 text-gray-400">Loading history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">
                        Workout <span className="text-gradient">History</span>
                    </h1>
                    <Link
                        href="/workouts/templates"
                        className="px-6 py-3 bg-gradient-to-r from-teal-6 to-teal-6 hover:from-teal-700 hover:to-teal-700 text-white font-bold rounded-lg transition-all"
                    >
                        Start New Workout
                    </Link>
                </div>

                {sessions.length === 0 ? (
                    <div className="glass rounded-xl p-12 text-center">
                        <p className="text-xl text-gray-400 mb-6">No workouts found yet.</p>
                        <Link
                            href="/workouts/templates"
                            className="inline-block px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all"
                        >
                            Browse Templates
                        </Link>
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
                                        <h3 className="text-xl font-bold group-hover:text-teal-4 transition-colors">
                                            {session.workout_type_name || session.class_name || 'Workout Session'}
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-teal-4">
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
