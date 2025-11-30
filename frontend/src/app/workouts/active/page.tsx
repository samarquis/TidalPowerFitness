'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

interface Exercise {
    id: string;
    exercise_id: string;
    exercise_name: string;
    order_in_session: number;
    planned_sets?: number;
    planned_reps?: number;
    planned_weight_lbs?: number;
    rest_seconds?: number;
}

interface SetLog {
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
    const [setLogs, setSetLogs] = useState<SetLog[]>([]);
    const [reps, setReps] = useState<number>(0);
    const [weight, setWeight] = useState<number>(0);
    const [notes, setNotes] = useState('');
    const [restTimer, setRestTimer] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [loading, setLoading] = useState(true);

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
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

            // Get template details
            const templateResponse = await fetch(`${apiUrl}/workout-templates/${templateId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const template = await templateResponse.json();

            // Create workout session
            const sessionResponse = await fetch(`${apiUrl}/workout-sessions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
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
                })
            });

            const session = await sessionResponse.json();
            setSessionId(session.id);

            // Get session details with exercises
            const detailsResponse = await fetch(`${apiUrl}/workout-sessions/${session.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const details = await detailsResponse.json();
            setExercises(details.exercises || []);

            // Initialize first exercise
            if (details.exercises?.length > 0) {
                const firstEx = details.exercises[0];
                setReps(firstEx.planned_reps || 0);
                setWeight(firstEx.planned_weight_lbs || 0);
            }
        } catch (error) {
            console.error('Error starting workout:', error);
            alert('Failed to start workout');
        } finally {
            setLoading(false);
        }
    };

    const completeSet = () => {
        const newLog: SetLog = {
            set_number: currentSet,
            reps_completed: reps,
            weight_used_lbs: weight,
            notes: notes
        };

        setSetLogs([...setLogs, newLog]);
        setNotes('');

        const currentExercise = exercises[currentExerciseIndex];
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
    };

    const nextExercise = () => {
        if (currentExerciseIndex < exercises.length - 1) {
            const nextEx = exercises[currentExerciseIndex + 1];
            setCurrentExerciseIndex(currentExerciseIndex + 1);
            setCurrentSet(1);
            setSetLogs([]);
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
                {setLogs.length > 0 && (
                    <div className="glass rounded-xl p-6 mb-6">
                        <h3 className="font-bold mb-3">Completed Sets</h3>
                        <div className="space-y-2">
                            {setLogs.map((log, idx) => (
                                <div key={idx} className="bg-white/5 rounded p-3 text-sm">
                                    <span className="font-semibold">Set {log.set_number}:</span>{' '}
                                    {log.reps_completed} reps @ {log.weight_used_lbs} lbs
                                    {log.notes && <p className="text-gray-400 mt-1">{log.notes}</p>}
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
