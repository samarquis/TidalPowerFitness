'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Participant {
    client_id: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface Exercise {
    id: string;
    exercise_id: string;
    exercise_name: string;
    order_in_session: number;
    planned_sets: number;
    planned_reps: number;
    planned_weight_lbs: number;
    rest_seconds: number;
    notes?: string;
}

interface SetLog {
    set_number: number;
    reps_completed: number;
    weight_used_lbs: number;
    rpe?: number;
    notes?: string;
}

interface Session {
    id: string;
    session_date: string;
    start_time?: string;
    class_name?: string;
    workout_type_name?: string;
    participants: Participant[];
    exercises: Exercise[];
    notes?: string;
}

export default function WorkoutLogPage() {
    const { user, isAuthenticated, token } = useAuth();
    const router = useRouter();
    const params = useParams();
    const sessionId = params.id as string;

    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState<Participant | null>(null);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [exerciseLogs, setExerciseLogs] = useState<{ [exerciseId: string]: { [clientId: string]: SetLog[] } }>({});
    const [restTimer, setRestTimer] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        if (isAuthenticated && !user?.roles?.includes('trainer') && !user?.roles?.includes('admin')) {
            router.push('/');
            return;
        }

        if (isAuthenticated && sessionId) {
            fetchSession();
        }
    }, [isAuthenticated, user, sessionId, router]);

    const fetchSession = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/workout-sessions/${sessionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSession(data);
                if (data.participants?.length > 0) {
                    setSelectedClient(data.participants[0]);
                }
            } else {
                console.error('Failed to fetch session');
            }
        } catch (error) {
            console.error('Error fetching session:', error);
        } finally {
            setLoading(false);
        }
    };

    const currentExercise = session?.exercises?.[currentExerciseIndex];

    const getClientLogs = useCallback((exerciseId: string, clientId: string): SetLog[] => {
        return exerciseLogs[exerciseId]?.[clientId] || [];
    }, [exerciseLogs]);

    const addSet = () => {
        if (!currentExercise || !selectedClient) return;

        const clientLogs = getClientLogs(currentExercise.id, selectedClient.client_id);
        const newSetNumber = clientLogs.length + 1;

        const newSet: SetLog = {
            set_number: newSetNumber,
            reps_completed: currentExercise.planned_reps || 0,
            weight_used_lbs: currentExercise.planned_weight_lbs || 0,
            rpe: undefined,
            notes: ''
        };

        setExerciseLogs(prev => ({
            ...prev,
            [currentExercise.id]: {
                ...prev[currentExercise.id],
                [selectedClient.client_id]: [...clientLogs, newSet]
            }
        }));
    };

    const updateSet = (setIndex: number, field: keyof SetLog, value: number | string) => {
        if (!currentExercise || !selectedClient) return;

        setExerciseLogs(prev => {
            const clientLogs = [...(prev[currentExercise.id]?.[selectedClient.client_id] || [])];
            clientLogs[setIndex] = { ...clientLogs[setIndex], [field]: value };
            return {
                ...prev,
                [currentExercise.id]: {
                    ...prev[currentExercise.id],
                    [selectedClient.client_id]: clientLogs
                }
            };
        });
    };

    const removeSet = (setIndex: number) => {
        if (!currentExercise || !selectedClient) return;

        setExerciseLogs(prev => {
            const clientLogs = [...(prev[currentExercise.id]?.[selectedClient.client_id] || [])];
            clientLogs.splice(setIndex, 1);
            // Renumber remaining sets
            clientLogs.forEach((log, i) => log.set_number = i + 1);
            return {
                ...prev,
                [currentExercise.id]: {
                    ...prev[currentExercise.id],
                    [selectedClient.client_id]: clientLogs
                }
            };
        });
    };

    const startRestTimer = () => {
        if (!currentExercise?.rest_seconds) return;
        setRestTimer(currentExercise.rest_seconds);
    };

    useEffect(() => {
        if (restTimer === null || restTimer <= 0) return;

        const interval = setInterval(() => {
            setRestTimer(prev => {
                if (prev === null || prev <= 1) {
                    // Play sound or vibrate when timer ends
                    return null;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [restTimer]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const saveAllLogs = async () => {
        if (!session) return;

        setSaving(true);
        setSaveMessage('');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const logs: any[] = [];

            // Collect all logs
            Object.entries(exerciseLogs).forEach(([exerciseId, clientLogs]) => {
                Object.entries(clientLogs).forEach(([clientId, sets]) => {
                    sets.forEach(set => {
                        logs.push({
                            session_exercise_id: exerciseId,
                            client_id: clientId,
                            set_number: set.set_number,
                            reps_completed: set.reps_completed,
                            weight_used_lbs: set.weight_used_lbs,
                            rpe: set.rpe,
                            notes: set.notes
                        });
                    });
                });
            });

            if (logs.length === 0) {
                setSaveMessage('No sets to save');
                setSaving(false);
                return;
            }

            const response = await fetch(`${apiUrl}/workout-sessions/log-exercises/bulk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ logs })
            });

            if (response.ok) {
                setSaveMessage(`✓ Saved ${logs.length} sets successfully!`);
            } else {
                const error = await response.json();
                setSaveMessage(`Error: ${error.error || 'Failed to save'}`);
            }
        } catch (error) {
            console.error('Error saving logs:', error);
            setSaveMessage('Error saving logs');
        } finally {
            setSaving(false);
        }
    };

    if (!isAuthenticated || (!user?.roles?.includes('trainer') && !user?.roles?.includes('admin'))) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold mb-4">Session Not Found</h1>
                    <Link href="/trainer" className="text-teal-400 hover:underline">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const clientLogs = currentExercise && selectedClient
        ? getClientLogs(currentExercise.id, selectedClient.client_id)
        : [];

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <Link href="/trainer" className="text-teal-400 hover:underline text-sm mb-2 inline-block">
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-bold">
                            {session.class_name || 'Workout Session'}
                        </h1>
                        <p className="text-gray-400">
                            {new Date(session.session_date).toLocaleDateString()}
                            {session.workout_type_name && ` • ${session.workout_type_name}`}
                        </p>
                    </div>
                    <button
                        onClick={saveAllLogs}
                        disabled={saving}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 rounded-lg font-bold transition-all disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : '💾 Save All Logs'}
                    </button>
                </div>

                {saveMessage && (
                    <div className={`mb-4 p-3 rounded-lg ${saveMessage.startsWith('✓') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {saveMessage}
                    </div>
                )}

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Left Sidebar - Participants */}
                    <div className="lg:col-span-1 glass rounded-xl p-4">
                        <h2 className="font-bold text-lg mb-4">Participants</h2>
                        {session.participants?.length === 0 ? (
                            <p className="text-gray-400 text-sm">No participants in this session</p>
                        ) : (
                            <div className="space-y-2">
                                {session.participants?.map((p) => (
                                    <button
                                        key={p.client_id}
                                        onClick={() => setSelectedClient(p)}
                                        className={`w-full text-left p-3 rounded-lg transition-colors ${selectedClient?.client_id === p.client_id
                                                ? 'bg-teal-600'
                                                : 'bg-white/5 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="font-semibold">{p.first_name} {p.last_name}</div>
                                        <div className="text-xs text-gray-400 truncate">{p.email}</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Main Content - Exercise Logging */}
                    <div className="lg:col-span-3">
                        {/* Exercise Navigation */}
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                            {session.exercises?.map((ex, index) => (
                                <button
                                    key={ex.id}
                                    onClick={() => setCurrentExerciseIndex(index)}
                                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${currentExerciseIndex === index
                                            ? 'bg-teal-600'
                                            : 'bg-white/10 hover:bg-white/20'
                                        }`}
                                >
                                    {index + 1}. {ex.exercise_name}
                                </button>
                            ))}
                        </div>

                        {currentExercise && (
                            <div className="glass rounded-xl p-6">
                                {/* Exercise Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold">{currentExercise.exercise_name}</h2>
                                        <p className="text-gray-400">
                                            Target: {currentExercise.planned_sets} sets × {currentExercise.planned_reps} reps
                                            @ {currentExercise.planned_weight_lbs} lbs
                                        </p>
                                        {currentExercise.notes && (
                                            <p className="text-sm text-gray-500 mt-1">{currentExercise.notes}</p>
                                        )}
                                    </div>

                                    {/* Rest Timer */}
                                    <div className="text-center">
                                        {restTimer !== null ? (
                                            <div className="bg-orange-500/20 rounded-lg p-4">
                                                <div className="text-3xl font-mono font-bold text-orange-400">
                                                    {formatTime(restTimer)}
                                                </div>
                                                <button
                                                    onClick={() => setRestTimer(null)}
                                                    className="text-xs text-gray-400 mt-1"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={startRestTimer}
                                                className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg text-orange-400 transition-colors"
                                            >
                                                ⏱️ Rest ({currentExercise.rest_seconds || 60}s)
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {!selectedClient ? (
                                    <p className="text-gray-400 text-center py-8">
                                        Select a participant to log their sets
                                    </p>
                                ) : (
                                    <>
                                        {/* Client Info Banner */}
                                        <div className="bg-teal-500/10 rounded-lg p-3 mb-4">
                                            <span className="font-semibold">
                                                Logging for: {selectedClient.first_name} {selectedClient.last_name}
                                            </span>
                                        </div>

                                        {/* Sets Table */}
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="text-left text-gray-400 text-sm">
                                                        <th className="p-2">Set</th>
                                                        <th className="p-2">Reps</th>
                                                        <th className="p-2">Weight (lbs)</th>
                                                        <th className="p-2">RPE</th>
                                                        <th className="p-2">Notes</th>
                                                        <th className="p-2"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {clientLogs.map((set, index) => (
                                                        <tr key={index} className="border-t border-white/10">
                                                            <td className="p-2 font-bold text-teal-400">
                                                                {set.set_number}
                                                            </td>
                                                            <td className="p-2">
                                                                <input
                                                                    type="number"
                                                                    value={set.reps_completed}
                                                                    onChange={(e) => updateSet(index, 'reps_completed', parseInt(e.target.value) || 0)}
                                                                    className="w-20 px-2 py-1 bg-black/50 border border-white/20 rounded text-center"
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <input
                                                                    type="number"
                                                                    value={set.weight_used_lbs}
                                                                    onChange={(e) => updateSet(index, 'weight_used_lbs', parseFloat(e.target.value) || 0)}
                                                                    className="w-24 px-2 py-1 bg-black/50 border border-white/20 rounded text-center"
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <select
                                                                    value={set.rpe || ''}
                                                                    onChange={(e) => updateSet(index, 'rpe', parseInt(e.target.value) || 0)}
                                                                    className="w-16 px-2 py-1 bg-black/50 border border-white/20 rounded"
                                                                >
                                                                    <option value="">-</option>
                                                                    {[...Array(10)].map((_, i) => (
                                                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                                    ))}
                                                                </select>
                                                            </td>
                                                            <td className="p-2">
                                                                <input
                                                                    type="text"
                                                                    value={set.notes || ''}
                                                                    onChange={(e) => updateSet(index, 'notes', e.target.value)}
                                                                    placeholder="Notes..."
                                                                    className="w-full px-2 py-1 bg-black/50 border border-white/20 rounded"
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <button
                                                                    onClick={() => removeSet(index)}
                                                                    className="text-red-400 hover:text-red-300"
                                                                    title="Remove set"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Add Set Button */}
                                        <button
                                            onClick={addSet}
                                            className="mt-4 w-full py-3 border-2 border-dashed border-white/20 hover:border-teal-500 rounded-lg text-gray-400 hover:text-teal-400 transition-colors"
                                        >
                                            + Add Set
                                        </button>

                                        {/* Navigation Buttons */}
                                        <div className="flex justify-between mt-6 pt-4 border-t border-white/10">
                                            <button
                                                onClick={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))}
                                                disabled={currentExerciseIndex === 0}
                                                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                ← Previous
                                            </button>
                                            <button
                                                onClick={() => setCurrentExerciseIndex(Math.min((session.exercises?.length || 1) - 1, currentExerciseIndex + 1))}
                                                disabled={currentExerciseIndex === (session.exercises?.length || 1) - 1}
                                                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next →
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {(!session.exercises || session.exercises.length === 0) && (
                            <div className="glass rounded-xl p-8 text-center">
                                <p className="text-gray-400">No exercises in this session.</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Add exercises to begin logging.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
