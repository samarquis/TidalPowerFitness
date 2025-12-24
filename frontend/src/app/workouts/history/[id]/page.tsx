'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

interface ExerciseLog {
    id: string;
    exercise_name: string;
    set_number: number;
    reps_completed?: number;
    weight_used_lbs?: number;
    notes?: string;
}

interface WorkoutSession {
    id: string;
    session_date: string;
    duration_minutes: number;
    workout_type_name?: string;
    class_name?: string;
    notes?: string;
    exercises: any[]; // Raw exercises from API
}

type GroupedLogs = {
    [key: string]: ExerciseLog[];
};


export default function SessionDetailsPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [session, setSession] = useState<WorkoutSession | null>(null);
    const [logs, setLogs] = useState<ExerciseLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (params?.id) {
            fetchSession(params.id as string);
        }
    }, [params, authLoading, isAuthenticated, router]);

    const fetchSession = async (id: string) => {
        try {
            const response = await apiClient.getWorkoutSession(id);
            if (response.data) {
                setSession(response.data);
                fetchSessionLogs(id);
            }
        } catch (error) {
            console.error('Error fetching session:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSessionLogs = async (id: string) => {
        try {
            const response = await apiClient.getSessionLogs(id);
            if (response.data) {
                setLogs(response.data);
            }
        } catch (error) {
            console.error('Error fetching session logs:', error);
        }
    };

    const groupedLogs = logs.reduce((acc, log) => {
        if (!acc[log.exercise_name]) {
            acc[log.exercise_name] = [];
        }
        acc[log.exercise_name].push(log);
        return acc;
    }, {} as GroupedLogs);


    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
                    <p className="mt-4 text-gray-400">Loading details...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-400 mb-4">Session not found</p>
                    <Link
                        href="/workouts/history"
                        className="inline-block px-6 py-3 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white font-bold rounded-lg"
                    >
                        Back to History
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/workouts/history" className="text-turquoise-surf hover:text-pacific-cyan mb-4 inline-block">
                        ← Back to History
                    </Link>
                    <h1 className="text-4xl font-bold mb-2">
                        {session.workout_type_name || session.class_name || 'Workout Session'}
                    </h1>
                    <div className="text-gray-400">
                        {new Date(session.session_date).toLocaleDateString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="glass p-4 rounded-xl text-center">
                        <div className="text-sm text-gray-400 mb-1">Duration</div>
                        <div className="text-2xl font-bold">{session.duration_minutes || 0}m</div>
                    </div>
                    <div className="glass p-4 rounded-xl text-center">
                        <div className="text-sm text-gray-400 mb-1">Exercises</div>
                        <div className="text-2xl font-bold">{Object.keys(groupedLogs).length || 0}</div>
                    </div>
                </div>

                {/* Notes */}
                {session.notes && (
                    <div className="glass rounded-xl p-6 mb-8">
                        <h3 className="text-xl font-bold mb-4">Notes</h3>
                        <p className="text-gray-300">{session.notes}</p>
                    </div>
                )}

                {/* Exercises List */}
                <div className="glass rounded-xl p-6">
                    <h2 className="text-2xl font-bold mb-6">Exercises Performed</h2>
                    <div className="space-y-6">
                        {Object.keys(groupedLogs).map((exerciseName) => (
                            <div key={exerciseName} className="bg-white/5 rounded-lg p-4">
                                <h3 className="text-lg font-bold mb-4">{exerciseName}</h3>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left pb-2 font-semibold text-gray-400">Set</th>
                                            <th className="text-left pb-2 font-semibold text-gray-400">Reps</th>
                                            <th className="text-left pb-2 font-semibold text-gray-400">Weight (lbs)</th>
                                            <th className="text-left pb-2 font-semibold text-gray-400">Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groupedLogs[exerciseName].map((log) => (
                                            <tr key={log.id} className="border-b border-white/5">
                                                <td className="py-2">{log.set_number}</td>
                                                <td className="py-2">{log.reps_completed ?? '-'}</td>
                                                <td className="py-2">{log.weight_used_lbs ?? '-'}</td>
                                                <td className="py-2">{log.notes ?? '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                        {Object.keys(groupedLogs).length === 0 && (
                            <p className="text-gray-400 text-center py-4">No exercises recorded for this session.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
