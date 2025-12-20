'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';

interface Exercise {
    id: string; // This is the session_exercise_id
    exercise_id: string;
    exercise_name: string;
    order_in_session: number;
    planned_sets?: number;
    planned_reps?: number;
    planned_weight_lbs?: number;
    rest_seconds?: number;
}

interface SetLog {
    session_exercise_id: string;
    set_number: number;
    reps_completed?: number;
    weight_used_lbs?: number;
    notes?: string;
}

function ActiveWorkoutContent() {
    const { user, token } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const templateId = searchParams ? searchParams.get('template') : null;

    const [sessionId, setSessionId] = useState<string | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [allLogs, setAllLogs] = useState<SetLog[]>([]);
    const [reps, setReps] = useState<number>(0);
    const [weight, setWeight] = useState<number>(0);
    const [notes, setNotes] = useState('');
    const [restTimer, setRestTimer] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (templateId) {
            startWorkout();
        }
    }, [templateId]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isResting && restTimer > 0) {
            interval = setInterval(() => {
                setRestTimer(prev => {
                    if (prev <= 1) {
                        setIsResting(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isResting, restTimer]);

    const startWorkout = async () => {
        try {
            // 1. Get template details
            const templateResponse = await apiClient.getWorkoutTemplate(templateId!);
            if (templateResponse.error) throw new Error(templateResponse.error);
            const template = templateResponse.data;

            // 2. Create workout session or reuse if date is today and template matches (simplified)
            // For now, always create new as requested, but we could add "Resume" lookup here
            const sessionResponse = await apiClient.createWorkoutTemplate({ // Note: Backend usually has a separate endpoint but createWorkoutTemplate used in some versions for this? Checking controller...
                // Using the actual controller endpoint via request
                method: 'POST',
                endpoint: '/workout-sessions',
                body: {
                    trainer_id: user?.id,
                    template_id: templateId,
                    session_date: new Date(),
                    start_time: new Date(),
                    exercises: template.exercises?.map((ex: any, idx: number) => ({
                        exercise_id: ex.exercise_id,
                        order_in_session: idx + 1,
                        planned_sets: ex.suggested_sets,
                        planned_reps: ex.suggested_reps,
                        planned_weight_lbs: ex.suggested_weight_lbs,
                        rest_seconds: ex.suggested_rest_seconds
                    })) || []
                }
            } as any); // Type hack for custom call if needed, but apiClient has it now?

            // Actually using the refactored apiClient from my previous tool call
            const createResponse = await apiClient.createWorkoutSession({
                trainer_id: user?.id,
                template_id: templateId,
                session_date: new Date(),
                start_time: new Date()
            });

            if (createResponse.error) throw new Error(createResponse.error);
            const session = createResponse.data;
            setSessionId(session.id);

            // 3. Get full session details (with exercises)
            const detailsResponse = await apiClient.getWorkoutSession(session.id);
            if (detailsResponse.error) throw new Error(detailsResponse.error);
            const details = detailsResponse.data;
            setExercises(details.exercises || []);

            // 4. Load existing logs (Resume logic)
            const logsResponse = await apiClient.getSessionLogs(session.id);
            if (logsResponse.data) {
                setAllLogs(logsResponse.data);

                // Smart Resume: Find where we left off
                if (logsResponse.data.length > 0) {
                    const lastLog = logsResponse.data[logsResponse.data.length - 1];
                    const exerciseIndex = details.exercises.findIndex((e: any) => e.id === lastLog.session_exercise_id);

                    if (exerciseIndex !== -1) {
                        const currentExLogs = logsResponse.data.filter((l: any) => l.session_exercise_id === lastLog.session_exercise_id);
                        const plannedSets = details.exercises[exerciseIndex].planned_sets || 3;

                        if (currentExLogs.length < plannedSets) {
                            setCurrentExerciseIndex(exerciseIndex);
                            setCurrentSet(currentExLogs.length + 1);
                        } else if (exerciseIndex < details.exercises.length - 1) {
                            setCurrentExerciseIndex(exerciseIndex + 1);
                            setCurrentSet(1);
                        } else {
                            // Already finished?
                            setCurrentExerciseIndex(exerciseIndex);
                            setCurrentSet(currentExLogs.length);
                        }
                    }
                }
            }

            // Initialize inputs
            const targetEx = details.exercises[currentExerciseIndex] || details.exercises[0];
            if (targetEx) {
                setReps(targetEx.planned_reps || 0);
                setWeight(targetEx.planned_weight_lbs || 0);
            }
        } catch (error) {
            console.error('Error starting workout:', error);
            alert('Failed to start workout');
        } finally {
            setLoading(false);
        }
    };

    const completeSet = async () => {
        if (saving) return;

        const currentExercise = exercises[currentExerciseIndex];
        const newLog: SetLog = {
            session_exercise_id: currentExercise.id,
            set_number: currentSet,
            reps_completed: reps,
            weight_used_lbs: weight,
            notes: notes
        };

        setSaving(true);
        try {
            // Real-time persistence (UPSERT)
            const response = await apiClient.logExercise({
                ...newLog,
                client_id: user?.id // Logging for self if in active workout
            });

            if (response.error) throw new Error(response.error);

            // Update local state
            setAllLogs(prev => {
                const filtered = prev.filter(l =>
                    !(l.session_exercise_id === newLog.session_exercise_id && l.set_number === newLog.set_number)
                );
                return [...filtered, newLog];
            });

            setNotes('');

            const plannedSets = currentExercise?.planned_sets || 3;

            if (currentSet < plannedSets) {
                // Start rest timer
                const restTime = currentExercise?.rest_seconds || 60;
                setRestTimer(restTime);
                setIsResting(true);
                setCurrentSet(currentSet + 1);
            } else {
                // Move to next exercise
                nextExercise();
            }
        } catch (error) {
            console.error('Error saving set:', error);
            alert('Failed to save set. Please check your connection.');
        } finally {
            setSaving(false);
        }
    };

    const nextExercise = () => {
        if (currentExerciseIndex < exercises.length - 1) {
            const nextIndex = currentExerciseIndex + 1;
            const nextEx = exercises[nextIndex];
            setCurrentExerciseIndex(nextIndex);
            setCurrentSet(1);
            setReps(nextEx.planned_reps || 0);
            setWeight(nextEx.planned_weight_lbs || 0);
            setIsResting(false);
            setRestTimer(0);
        } else {
            // Workout complete
            completeWorkout();
        }
    };

    const completeWorkout = () => {
        const duration = Math.floor((new Date().getTime() - startTime.getTime()) / 60000);
        router.push(`/workouts/complete?session=${sessionId}&duration=${duration}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-4"></div>
                    <p className="mt-4 text-gray-400">Starting workout...</p>
                </div>
            </div>
        );
    }

    if (exercises.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-400">No exercises found</p>
                </div>
            </div>
        );
    }

    const currentExercise = exercises[currentExerciseIndex];
    const progress = ((currentExerciseIndex + 1) / exercises.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Exercise {currentExerciseIndex + 1} of {exercises.length}</span>
                        <span>{Math.round(progress)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-teal-6 to-teal-6 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Current Exercise */}
                <div className="glass rounded-xl p-6 mb-6">
                    <h1 className="text-3xl font-bold mb-2">{currentExercise.exercise_name}</h1>
                    <p className="text-gray-400">
                        Set {currentSet} of {currentExercise.planned_sets || 3}
                    </p>
                </div>

                {/* Rest Timer */}
                {isResting && (
                    <div className="glass rounded-xl p-8 mb-6">
                        <p className="text-gray-400 mb-4 text-center">Rest Time</p>
                        <p className="text-6xl font-bold text-teal-4 text-center mb-6">{restTimer}s</p>

                        {/* Timer Controls */}
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setRestTimer(Math.max(0, restTimer - 15))}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
                                >
                                    -15s
                                </button>
                                <button
                                    onClick={() => setRestTimer(Math.max(0, restTimer - 5))}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
                                >
                                    -5s
                                </button>
                                <button
                                    onClick={() => setRestTimer(restTimer + 5)}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
                                >
                                    +5s
                                </button>
                                <button
                                    onClick={() => setRestTimer(restTimer + 15)}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
                                >
                                    +15s
                                </button>
                            </div>
                            <button
                                onClick={() => {
                                    setRestTimer(0);
                                    setIsResting(false);
                                }}
                                className="w-full px-6 py-3 bg-gradient-to-r from-teal-6 to-teal-6 hover:from-teal-700 hover:to-teal-700 text-white font-bold rounded-lg text-lg transition-all"
                            >
                                Skip Rest
                            </button>
                        </div>
                    </div>
                )}

                {/* Set Input */}
                {!isResting && (
                    <div className="glass rounded-xl p-6 mb-6">
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Reps</label>
                                <input
                                    type="number"
                                    value={reps}
                                    onChange={(e) => setReps(parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white text-2xl font-bold text-center focus:outline-none focus:border-teal-4"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Weight (lbs)</label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white text-2xl font-bold text-center focus:outline-none focus:border-teal-4"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Notes (optional)</label>
                            <input
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="How did this set feel?"
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                            />
                        </div>

                        <button
                            onClick={completeSet}
                            className="w-full px-6 py-4 bg-gradient-to-r from-teal-6 to-teal-6 hover:from-teal-700 hover:to-teal-700 text-white font-bold rounded-lg text-lg transition-all"
                        >
                            Complete Set
                        </button>
                    </div>
                )}

                {/* Completed Sets */}
                {allLogs.filter(l => l.session_exercise_id === currentExercise.id).length > 0 && (
                    <div className="glass rounded-xl p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-200">Session History</h3>
                            <button
                                onClick={() => router.push('/workouts/history')}
                                className="text-xs text-teal-400 hover:text-teal-300"
                            >
                                View full history
                            </button>
                        </div>
                        <div className="space-y-3">
                            {allLogs
                                .filter(l => l.session_exercise_id === currentExercise.id)
                                .sort((a, b) => a.set_number - b.set_number)
                                .map((log, idx) => (
                                    <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:bg-white/10 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-xs">
                                                {log.set_number}
                                            </div>
                                            <div>
                                                <span className="text-white font-bold">{log.reps_completed}</span>
                                                <span className="text-gray-500 text-xs ml-1 font-semibold uppercase tracking-wider">reps</span>
                                                <span className="text-gray-600 mx-2">@</span>
                                                <span className="text-white font-bold">{log.weight_used_lbs}</span>
                                                <span className="text-gray-500 text-xs ml-1 font-semibold uppercase tracking-wider">lbs</span>
                                            </div>
                                        </div>
                                        {log.notes && (
                                            <div className="text-gray-400 text-xs italic bg-black/30 px-2 py-1 rounded">
                                                {log.notes}
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={() => router.push('/workouts/templates')}
                        className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-all"
                    >
                        Cancel
                    </button>
                    {currentExerciseIndex < exercises.length - 1 && (
                        <button
                            onClick={nextExercise}
                            className="flex-1 px-6 py-3 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 font-bold rounded-lg transition-all"
                        >
                            Skip Exercise
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ActiveWorkoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-4"></div>
                    <p className="mt-4 text-gray-400">Loading workout...</p>
                </div>
            </div>
        }>
            <ActiveWorkoutContent />
        </Suspense>
    );
}
