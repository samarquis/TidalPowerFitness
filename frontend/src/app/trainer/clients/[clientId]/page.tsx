'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

interface WorkoutSession {
    id: string;
    session_date: string;
    start_time?: string;
    notes?: string;
    workout_type_name?: string;
    class_name?: string;
    exercise_count: number;
}

interface ClientInfo {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

export default function ClientWorkoutsPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const clientId = params?.clientId as string;

    const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
    const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (authLoading) return;

        if (isAuthenticated && !user?.roles?.includes('trainer') && !user?.roles?.includes('admin')) {
            router.push('/');
            return;
        }

        if (isAuthenticated && clientId) {
            fetchClientWorkouts();
        } else if (!isAuthenticated) {
            router.push(`/login?redirect=/trainer/clients/${clientId}`);
        }
    }, [isAuthenticated, authLoading, user, router, clientId]);

    const fetchClientWorkouts = async () => {
        try {
            const response = await apiClient.getClientWorkouts(clientId);
            if (response.data) {
                setWorkouts(response.data);

                // Get client info from first workout or fetch separately
                if (response.data.length > 0) {
                    // For now, we'll fetch client info from the clients list
                    fetchClientInfo();
                }
            } else if (response.error) {
                if (response.error.includes('access')) {
                    setError('You do not have access to this client');
                } else {
                    setError('Failed to load client workouts');
                }
            }
        } catch (error) {
            console.error('Error fetching client workouts:', error);
            setError('Failed to load client workouts');
        } finally {
            setLoading(false);
        }
    };

    const fetchClientInfo = async () => {
        try {
            const response = await apiClient.getMyClients();
            if (response.data) {
                const clients = response.data;
                const client = clients.find((c: any) => c.id === clientId);
                if (client) {
                    setClientInfo(client);
                }
            }
        } catch (error) {
            console.error('Error fetching client info:', error);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16 flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
            </div>
        );
    }

    if (!isAuthenticated || (!user?.roles?.includes('trainer') && !user?.roles?.includes('admin'))) {
        return null;
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/trainer/clients" className="text-turquoise-surf hover:text-pacific-cyan mb-4 inline-block">
                        ← Back to Clients
                    </Link>

                    {clientInfo && (
                        <div className="glass rounded-xl p-6 mb-6">
                            <div className="flex items-center">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-turquoise-surf to-cerulean flex items-center justify-center text-white text-3xl font-bold mr-6">
                                    {clientInfo.first_name[0]}{clientInfo.last_name[0]}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">
                                        {clientInfo.first_name} {clientInfo.last_name}
                                    </h1>
                                    <p className="text-gray-400">{clientInfo.email}</p>
                                    <p className="text-turquoise-surf mt-1">{workouts.length} workout sessions</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <h2 className="text-2xl font-bold text-white">
                        Workout <span className="text-gradient">History</span>
                    </h2>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
                        <p className="mt-4 text-gray-400">Loading workout history...</p>
                    </div>
                ) : error ? (
                    <div className="glass rounded-xl p-12 text-center">
                        <p className="text-red-400 text-lg">{error}</p>
                    </div>
                ) : workouts.length === 0 ? (
                    <div className="glass rounded-xl p-12 text-center">
                        <p className="text-gray-400 text-lg">No workout history available for this client yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {workouts.map((workout) => (
                            <Link
                                key={workout.id}
                                href={`/workouts/history/${workout.id}`}
                                className="glass rounded-xl p-6 hover:bg-white/10 transition-all block"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white">
                                                {workout.class_name || workout.workout_type_name || 'Workout Session'}
                                            </h3>
                                            {workout.workout_type_name && (
                                                <span className="px-3 py-1 bg-pacific-cyan/20 text-turquoise-surf rounded-full text-sm font-semibold">
                                                    {workout.workout_type_name}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                                            <span>📅 {new Date(workout.session_date).toLocaleDateString()}</span>
                                            {workout.start_time && (
                                                <span>🕐 {workout.start_time}</span>
                                            )}
                                            <span>💪 {workout.exercise_count} exercises</span>
                                        </div>

                                        {workout.notes && (
                                            <p className="text-gray-300 text-sm">{workout.notes}</p>
                                        )}
                                    </div>

                                    <div className="ml-4">
                                        <div className="px-4 py-2 bg-gradient-to-r from-cerulean to-pacific-cyan text-white rounded-lg font-semibold text-sm">
                                            View Details →
                                        </div>
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
