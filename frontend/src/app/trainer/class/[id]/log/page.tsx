'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

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
        const [history, setHistory] = useState<any[]>([]);
        const [historyLoading, setHistoryLoading] = useState(false);
        const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [batchSets, setBatchSets] = useState(3);
    const [batchReps, setBatchReps] = useState(12);
    const [batchWeight, setBatchWeight] = useState(0);
    
        const currentExercise = session?.exercises?.[currentExerciseIndex];

    // Preload Batch Entry with designed targets
    useEffect(() => {
        if (currentExercise) {
            setBatchSets(currentExercise.planned_sets || 3);
            setBatchReps(currentExercise.planned_reps || 12);
            setBatchWeight(currentExercise.planned_weight_lbs || 0);
        }
    }, [currentExercise]);
    
        useEffect(() => {
            if (isAuthenticated && !user?.roles?.includes('trainer') && !user?.roles?.includes('admin')) {
                router.push('/');
                return;
            }
    
            if (isAuthenticated && sessionId) {
                fetchSession();
            }
        }, [isAuthenticated, user, sessionId, router]);
    
        // Fetch history when client or exercise changes
        useEffect(() => {
            const fetchHistory = async () => {
                if (!selectedClient || !currentExercise) {
                    setHistory([]);
                    return;
                }
    
                setHistoryLoading(true);
                try {
                    const response = await apiClient.getExerciseHistory(selectedClient.client_id, currentExercise.exercise_id);
                    const responseData = response.data;
                    if (responseData) {
                        setHistory(responseData);

                        // Pre-load logic: If no logs exist for this client/exercise, use last session's data
                        // We check inside setExerciseLogs to ensure we have the latest state
                        setExerciseLogs(prev => {
                            const currentClientLogs = prev[currentExercise.id]?.[selectedClient.client_id] || [];
                            
                            if (currentClientLogs.length === 0 && responseData.length > 0) {
                                const lastDate = responseData[0].session_date;
                                const lastSessionLogs = responseData.filter((l: any) => l.session_date === lastDate);
                                
                                // Sort by set_number to be safe
                                lastSessionLogs.sort((a: any, b: any) => a.set_number - b.set_number);

                                const newLogs: SetLog[] = lastSessionLogs.map((h: any, i: number) => ({
                                    set_number: i + 1,
                                    reps_completed: h.reps_completed,
                                    weight_used_lbs: h.weight_used_lbs,
                                    rpe: undefined,
                                    notes: ''
                                }));

                                return {
                                    ...prev,
                                    [currentExercise.id]: {
                                        ...prev[currentExercise.id],
                                        [selectedClient.client_id]: newLogs
                                    }
                                };
                            }
                            return prev;
                        });
                    }
                } catch (error) {
                    console.error('Error fetching history:', error);
                } finally {
                    setHistoryLoading(false);
                }
            };
    
            fetchHistory();
        }, [selectedClient, currentExercise]);
    const fetchSession = async () => {
        try {
            const response = await apiClient.getWorkoutSession(sessionId);

            if (response.data) {
                setSession(response.data);
                if (response.data.participants?.length > 0) {
                    setSelectedClient(response.data.participants[0]);
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



        const addBatchLog = () => {
        if (!currentExercise || !selectedClient) return;
        
        const newSets: SetLog[] = [];
        for (let i = 1; i <= batchSets; i++) {
            newSets.push({
                set_number: i,
                reps_completed: batchReps,
                weight_used_lbs: batchWeight,
                notes: ""
            });
        }

        setHasUnsavedChanges(true);
        setExerciseLogs(prev => ({
            ...prev,
            [currentExercise.id]: {
                ...prev[currentExercise.id],
                [selectedClient.client_id]: newSets
            }
        }));
    };

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

        setHasUnsavedChanges(true);
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

        setHasUnsavedChanges(true);
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

        setHasUnsavedChanges(true);
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

        const saveSingleSet = async (setIndex: number) => {
        if (!currentExercise || !selectedClient) return;
        
        const set = exerciseLogs[currentExercise.id][selectedClient.client_id][setIndex];
        setSaving(true);
        
        try {
            const response = await apiClient.logExercise({
                session_exercise_id: currentExercise.id,
                client_id: selectedClient.client_id,
                set_number: set.set_number,
                reps_completed: set.reps_completed,
                weight_used_lbs: set.weight_used_lbs,
                rpe: set.rpe,
                notes: set.notes
            });
            
            if (response.data) {
                setSaveMessage(`✓ Set ${set.set_number} saved`);
                setTimeout(() => setSaveMessage(""), 3000);
            }
        } catch (error) {
            console.error("Error saving set:", error);
            setSaveMessage("Error saving set");
        } finally {
            setSaving(false);
        }
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

            const response = await apiClient.bulkLogExercises(logs);

            if (response.data) {
                setSaveMessage(`✓ Saved ${logs.length} sets successfully!`);
                setHasUnsavedChanges(false);
            } else {
                setSaveMessage(`Error: ${response.error || 'Failed to save'}`);
            }
        } catch (error) {
            console.error('Error saving logs:', error);
            setSaveMessage('Error saving logs');
        } finally {
            setSaving(false);
        }
    };

    const finishWorkout = async () => {
        if (!session) return;
        
        setSaving(true);
        try {
            // 1. Save all pending logs first
            await saveAllLogs();
            
            // 2. Mark session as finished (end_time)
            await apiClient.updateWorkoutSession(sessionId, {
                end_time: new Date().toISOString()
            });
            
            // 3. Redirect to celebration!
            router.push(`/workouts/complete/${sessionId}`);
        } catch (error) {
            console.error('Error finishing workout:', error);
            setSaveMessage('Failed to finish workout');
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
            <div className="min-h-screen pt-24 pb-16">
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
        <div className="min-h-screen pt-24 pb-16">
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
                    <div className="flex gap-3">
                        <button
                            onClick={saveAllLogs}
                            disabled={saving}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-bold transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : '💾 Save Draft'}
                        </button>
                        <button
                            onClick={finishWorkout}
                            disabled={saving}
                            className="px-6 py-3 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal rounded-lg font-black text-white shadow-lg shadow-pacific-cyan/20 transition-all disabled:opacity-50"
                        >
                            🏁 Finish Workout
                        </button>
                    </div>
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
                                        
                                        {/* History / Insights Display */}
                                        <div className="mt-4 min-h-[60px]">
                                            {historyLoading ? (
                                                <div className="animate-pulse flex space-x-4 p-3 bg-white/5 rounded-lg border border-white/10">
                                                    <div className="flex-1 space-y-2 py-1">
                                                        <div className="h-2 bg-white/10 rounded w-3/4"></div>
                                                        <div className="h-2 bg-white/10 rounded"></div>
                                                    </div>
                                                </div>
                                            ) : history.length > 0 ? (
                                                <div className="p-3 bg-white/5 rounded-lg border border-white/10 relative overflow-hidden group">
                                                    {/* Overload Badge */}
                                                    {currentExercise && history[0].weight_used_lbs < currentExercise.planned_weight_lbs && (
                                                        <div className="absolute top-0 right-0 bg-green-500 text-[10px] font-bold text-black px-2 py-0.5 rounded-bl-lg uppercase tracking-tighter animate-bounce-subtle">
                                                            ⚡ Overload
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-[10px] font-bold text-turquoise-surf uppercase tracking-widest">Last Session</span>
                                                        <span className="text-[10px] text-gray-500">{new Date(history[0].session_date).toLocaleDateString()}</span>
                                                    </div>
                                                    
                                                    <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                                                        {history.filter((h: any) => h.session_date === history[0].session_date).map((h: any, i: number) => (
                                                            <div key={i} className="flex items-center justify-between text-sm py-0.5 border-b border-white/5 last:border-0">
                                                                <span className="text-gray-500 font-mono text-[10px] w-8">Set {h.set_number}</span>
                                                                <div className="flex items-baseline gap-2">
                                                                    <span className="font-mono font-bold text-white">{h.weight_used_lbs}<span className="text-[10px] text-gray-500 ml-0.5">lbs</span></span>
                                                                    <span className="text-gray-600 text-[10px]">×</span>
                                                                    <span className="font-mono font-bold text-white">{h.reps_completed}<span className="text-[10px] text-gray-500 ml-0.5">reps</span></span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-3 bg-white/5 rounded-lg border border-dashed border-white/10 text-xs text-gray-500 italic">
                                                    No previous history for this exercise. Establish a baseline today!
                                                </div>
                                            )}
                                        </div>
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

                                        {/* Sets List (Card Layout) */}
                                        <div className="space-y-3">
                                            {clientLogs.map((set, index) => (
                                                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all hover:border-white/20">
                                                    
                                                    {/* Top Row: Set, Reps, Weight */}
                                                    <div className="flex flex-wrap md:flex-nowrap items-start gap-4 mb-4">
                                                        
                                                        {/* Set Number */}
                                                        <div className="flex-none w-16">
                                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Set</label>
                                                            <div className="h-10 flex items-center justify-center bg-white/5 rounded-lg border border-white/10 font-bold text-teal-400">
                                                                {set.set_number}
                                                            </div>
                                                        </div>

                                                        {/* Reps Control */}
                                                        <div className="flex-1 min-w-[140px]">
                                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Reps</label>
                                                            <div className="flex items-center gap-1">
                                                                <button 
                                                                    onClick={() => updateSet(index, 'reps_completed', Math.max(0, set.reps_completed - 1))}
                                                                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/5"
                                                                >
                                                                    -
                                                                </button>
                                                                <input
                                                                    type="number"
                                                                    value={set.reps_completed}
                                                                    onChange={(e) => updateSet(index, 'reps_completed', parseInt(e.target.value) || 0)}
                                                                    className="w-full h-10 bg-black/40 border border-white/10 rounded-lg text-center font-bold text-lg focus:border-teal-500/50 outline-none transition-all"
                                                                />
                                                                <button 
                                                                    onClick={() => updateSet(index, 'reps_completed', set.reps_completed + 1)}
                                                                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/5"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Weight Control */}
                                                        <div className="flex-1 min-w-[140px]">
                                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Lbs</label>
                                                            <div className="flex items-center gap-1">
                                                                <button 
                                                                    onClick={() => updateSet(index, 'weight_used_lbs', Math.max(0, set.weight_used_lbs - 5))}
                                                                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/5"
                                                                >
                                                                    -
                                                                </button>
                                                                <input
                                                                    type="number"
                                                                    value={set.weight_used_lbs}
                                                                    onChange={(e) => updateSet(index, 'weight_used_lbs', parseFloat(e.target.value) || 0)}
                                                                    className="w-full h-10 bg-black/40 border border-white/10 rounded-lg text-center font-bold text-lg focus:border-teal-500/50 outline-none transition-all"
                                                                />
                                                                <button 
                                                                    onClick={() => updateSet(index, 'weight_used_lbs', set.weight_used_lbs + 5)}
                                                                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/5"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Bottom Row: RPE, Notes, Delete */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-20">
                                                            <select
                                                                value={set.rpe || ''}
                                                                onChange={(e) => updateSet(index, 'rpe', parseInt(e.target.value) || 0)}
                                                                className="w-full h-9 px-2 bg-black/20 border border-white/10 rounded-lg text-sm text-gray-300 focus:border-teal-500/50 outline-none"
                                                            >
                                                                <option value="">RPE</option>
                                                                {[...Array(10)].map((_, i) => (
                                                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="flex-1">
                                                            <input
                                                                type="text"
                                                                value={set.notes || ''}
                                                                onChange={(e) => updateSet(index, 'notes', e.target.value)}
                                                                placeholder="Add notes..."
                                                                className="w-full h-9 px-3 bg-black/20 border border-white/10 rounded-lg text-sm text-gray-300 placeholder:text-gray-600 focus:border-teal-500/50 outline-none"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => removeSet(index)}
                                                            className="w-9 h-9 flex items-center justify-center text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                            title="Remove set"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Add Set Button */}
                                        <button
                                            onClick={addSet}
                                            className="mt-6 w-full py-4 bg-white/5 hover:bg-white/10 border-2 border-dashed border-white/10 hover:border-turquoise-surf rounded-2xl text-gray-500 hover:text-turquoise-surf font-black uppercase tracking-widest text-xs transition-all duration-300"
                                        >
                                            + Add Set
                                        </button>

                                        {/* Navigation Buttons */}
                                        <div className="flex justify-between mt-6 pt-4 border-t border-white/10">
                                            <button
                                                onClick={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))}
                                                disabled={currentExerciseIndex === 0}
                                                className="btn-secondary text-xs uppercase tracking-widest py-3 px-8 opacity-50 hover:opacity-100"
                                            >
                                                ← Previous
                                            </button>
                                            <button
                                                onClick={() => setCurrentExerciseIndex(Math.min((session.exercises?.length || 1) - 1, currentExerciseIndex + 1))}
                                                disabled={currentExerciseIndex === (session.exercises?.length || 1) - 1}
                                                className="btn-primary text-xs uppercase tracking-widest py-3 px-8 shadow-none hover:shadow-lg"
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
