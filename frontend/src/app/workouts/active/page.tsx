'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import BatchEntryMatrix from '@/components/workouts/BatchEntryMatrix';

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
    const assignmentId = searchParams ? searchParams.get('assignment') : null;

    const [sessionId, setSessionId] = useState<string | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [currentSetLogs, setCurrentSetLogs] = useState<SetLog[]>([]);
    const [allLogs, setAllLogs] = useState<SetLog[]>([]);
    const [restTimer, setRestTimer] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (templateId) {
            startWorkout();
        }
    }, [templateId, user, router]);

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
            const createResponse = await apiClient.createWorkoutSession({
                trainer_id: user?.id,
                template_id: templateId,
                program_assignment_id: assignmentId,
                session_date: new Date().toISOString().split('T')[0],
                start_time: new Date().toISOString(),
                participant_ids: [user?.id]
            });

            if (createResponse.error) throw new Error(createResponse.error);
            const session = createResponse.data;
            setSessionId(session.id);

            // Get full session details (with exercises)
            const detailsResponse = await apiClient.getWorkoutSession(session.id);
            if (detailsResponse.error) throw new Error(detailsResponse.error);
            const details = detailsResponse.data;
            setExercises(details.exercises || []);

            // Initialize the current exercise logs
            const firstEx = details.exercises[0];
            if (firstEx) {
                const initialSets = Array.from({ length: firstEx.planned_sets || 3 }, (_, i) => ({
                    session_exercise_id: firstEx.id,
                    set_number: i + 1,
                    reps_completed: firstEx.planned_reps,
                    weight_used_lbs: firstEx.planned_weight_lbs
                }));
                setCurrentSetLogs(initialSets);
            }

            // Load existing logs (Resume logic)
            const logsResponse = await apiClient.getSessionLogs(session.id);
            if (logsResponse.data) {
                setAllLogs(logsResponse.data);
            }
        } catch (error) {
            console.error('Error starting workout:', error);
            alert('Failed to start workout');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSet = (index: number, updates: Partial<SetLog>) => {
        setCurrentSetLogs(prev => {
            const newLogs = [...prev];
            newLogs[index] = { ...newLogs[index], ...updates };
            return newLogs;
        });
    };

    const completeBatchWorkout = async () => {
        if (saving) return;
        setSaving(true);
        try {
            const response = await apiClient.bulkLogExercises(currentSetLogs.map(log => ({
                ...log,
                client_id: user?.id
            })));
            
            if (response.error) throw new Error(response.error);
            
            // Add current logs to all logs
            setAllLogs(prev => [...prev, ...currentSetLogs]);
            
            // Start rest timer if needed or move to next
            nextExercise();
        } catch (error) {
            console.error('Error saving batch:', error);
            alert('Failed to save workout data');
        } finally {
            setSaving(false);
        }
    };

    const nextExercise = () => {
        if (currentExerciseIndex < exercises.length - 1) {
            const nextIndex = currentExerciseIndex + 1;
            const nextEx = exercises[nextIndex];
            setCurrentExerciseIndex(nextIndex);
            
            // Prepare next exercise logs
            const nextSets = Array.from({ length: nextEx.planned_sets || 3 }, (_, i) => ({
                session_exercise_id: nextEx.id,
                set_number: i + 1,
                reps_completed: nextEx.planned_reps,
                weight_used_lbs: nextEx.planned_weight_lbs
            }));
            setCurrentSetLogs(nextSets);
            
            setIsResting(false);
            setRestTimer(0);
        } else {
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
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
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
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Exercise {currentExerciseIndex + 1} of {exercises.length}</span>
                        <span>{Math.round(progress)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                            className="bg-turquoise-surf h-2 rounded-full transition-all shadow-[0_0_10px_rgba(8,172,214,0.5)]"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Current Exercise */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black mb-2 tracking-tighter uppercase">{currentExercise.exercise_name}</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                        Targeting {currentExercise.planned_sets || 3} sets
                    </p>
                </div>

                {/* Batch Entry Matrix */}
                <div className="mb-10">
                    <BatchEntryMatrix 
                        sets={currentSetLogs}
                        onUpdateSet={handleUpdateSet}
                        plannedReps={currentExercise.planned_reps}
                        plannedWeight={currentExercise.planned_weight_lbs}
                        activeSetIndex={0} // For now simplified to highlighting all
                    />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-4">
                    <button
                        onClick={completeBatchWorkout}
                        disabled={saving}
                        className="w-full px-6 py-5 bg-turquoise-surf text-black font-black rounded-2xl text-xl transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(8,172,214,0.4)] uppercase tracking-widest flex items-center justify-center gap-3"
                    >
                        {saving ? (
                            <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
                        ) : (
                            <>Save Exercise & Next <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
                        )}
                    </button>
                    
                    <button
                        onClick={completeWorkout}
                        className="w-full px-6 py-4 bg-green-500/10 text-green-400 font-black rounded-2xl transition-all border border-green-500/20 uppercase tracking-widest"
                    >
                        Finish Entire Workout
                    </button>
                    
                    <div className="flex gap-4">
                        <button
                            onClick={() => router.push('/workouts/templates')}
                            className="px-6 py-3 bg-white/5 text-gray-500 font-bold rounded-xl hover:bg-white/10 transition-all text-sm"
                        >
                            Cancel
                        </button>
                        {currentExerciseIndex < exercises.length - 1 && (
                            <button
                                onClick={nextExercise}
                                className="flex-1 px-6 py-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 font-bold rounded-xl transition-all text-sm"
                            >
                                Skip Exercise
                            </button>
                        )}
                    </div>
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
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
                    <p className="mt-4 text-gray-400">Loading workout...</p>
                </div>
            </div>
        }>
            <ActiveWorkoutContent />
        </Suspense>
    );
}