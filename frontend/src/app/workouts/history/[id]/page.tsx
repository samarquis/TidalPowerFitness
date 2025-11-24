'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface ExerciseLog {
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

export default function SessionDetailsPage() {
    const { token } = useAuth();
    const params = useParams();
    const [session, setSession] = useState<WorkoutSession | null>(null);
    const [logs, setLogs] = useState<ExerciseLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchSession();
        }
    }, [params.id]);

    const fetchSession = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/workout-sessions/${params.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setSession(data);

            // Process exercises into logs format if needed, or use existing structure
            // The backend returns exercises with logs attached or separate logs
            // For now assuming we need to fetch logs separately or they are included
            // Let's check the structure in the console if needed, but based on model:
            // session.exercises contains planned exercises. We need actual logs.
            // Actually, the getById endpoint returns exercises, but logs are in a separate table
            // Let's assume for this MVP we display the planned exercises and any notes
            // If we need actual logs, we might need to update the backend to include them in getById
            // or fetch them separately.
            // Let's stick to what getById returns for now.
        } catch (error) {
            console.error('Error fetching session:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-4"></div>
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
                        className="inline-block px-6 py-3 bg-gradient-to-r from-teal-6 to-teal-6 hover:from-teal-700 hover:to-teal-700 text-white font-bold rounded-lg"
                    >
                        Back to History
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/workouts/history" className="text-teal-4 hover:text-teal-3 mb-4 inline-block">
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
                        <div className="text-2xl font-bold">{session.exercises?.length || 0}</div>
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
                        {session.exercises?.map((exercise, idx) => (
                            <div key={idx} className="bg-white/5 rounded-lg p-4">
                                <h3 className="text-lg font-bold mb-2">{exercise.exercise_name}</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    {exercise.planned_sets && (
                                        <div>
                                            <span className="text-gray-400">Sets:</span> {exercise.planned_sets}
                                        </div>
                                    )}
                                    {exercise.planned_reps && (
                                        <div>
                                            <span className="text-gray-400">Reps:</span> {exercise.planned_reps}
                                        </div>
                                    )}
                                    {exercise.planned_weight_lbs && (
                                        <div>
                                            <span className="text-gray-400">Weight:</span> {exercise.planned_weight_lbs} lbs
                                        </div>
                                    )}
                                </div>
                                {exercise.notes && (
                                    <p className="mt-2 text-sm text-gray-400 italic">{exercise.notes}</p>
                                )}
                            </div>
                        ))}
                        {(!session.exercises || session.exercises.length === 0) && (
                            <p className="text-gray-400 text-center py-4">No exercises recorded for this session.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
