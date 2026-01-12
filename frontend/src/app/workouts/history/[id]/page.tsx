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
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [session, setSession] = useState<WorkoutSession | null>(null);
    const [logs, setLogs] = useState<ExerciseLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

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
                // Filter logs to only show the user's own data if they are a client
                const allLogs = response.data;
                const userLogs = (user?.roles?.includes('trainer') || user?.roles?.includes('admin'))
                    ? allLogs
                    : allLogs.filter((l: any) => l.client_id === user?.id);
                setLogs(userLogs);
            }
        } catch (error) {
            console.error('Error fetching session logs:', error);
        }
    };

    const handleUpdateLog = (logId: string, field: keyof ExerciseLog, value: any) => {
        setLogs(prev => prev.map(log => 
            log.id === logId ? { ...log, [field]: value } : log
        ));
    };

    const saveChanges = async () => {
        setIsSaving(true);
        setSaveError(null);
        try {
            // Find logs that were edited (simplified: save all displayed logs)
            const promises = logs.map(log => {
                // Find corresponding session_exercise_id
                const sessionEx = session?.exercises?.find((se: any) => se.exercise_name === log.exercise_name);
                
                return apiClient.logExercise({
                    session_exercise_id: log.session_exercise_id, // We should ensure this is in the log object
                    client_id: user?.id,
                    set_number: log.set_number,
                    reps_completed: log.reps_completed,
                    weight_used_lbs: log.weight_used_lbs,
                    notes: log.notes
                });
            });

            const results = await Promise.all(promises);
            const error = results.find(r => r.error);
            if (error) {
                setSaveError(error.error || 'Failed to save some changes');
            } else {
                setIsEditMode(false);
            }
        } catch (err: any) {
            setSaveError(err.message || 'Error saving changes');
        } finally {
            setIsSaving(false);
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
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <Link href="/workouts/history" className="text-turquoise-surf hover:text-pacific-cyan mb-4 inline-block font-medium">
                            ← Back to History
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tighter uppercase italic">
                            {session.workout_type_name || session.class_name || 'Workout Session'}
                        </h1>
                        <div className="text-gray-400 font-medium">
                            {new Date(session.session_date).toLocaleDateString(undefined, {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        {isEditMode ? (
                            <>
                                <button
                                    onClick={() => setIsEditMode(false)}
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-white/5 hover:bg-white/10 text-gray-400 font-bold rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveChanges}
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-turquoise-surf text-black font-black rounded-lg transition-all shadow-lg shadow-turquoise-surf/20 flex items-center gap-2"
                                >
                                    {isSaving ? (
                                        <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
                                    ) : '💾'} Save Changes
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditMode(true)}
                                className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-turquoise-surf font-bold rounded-lg transition-all flex items-center gap-2"
                            >
                                📝 Edit Logs
                            </button>
                        )}
                    </div>
                </div>

                {saveError && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                        {saveError}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="glass p-6 rounded-2xl text-center border-white/5">
                        <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Duration</div>
                        <div className="text-3xl font-black tracking-tighter text-white">{session.duration_minutes || 0}m</div>
                    </div>
                    <div className="glass p-6 rounded-2xl text-center border-white/5">
                        <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Exercises</div>
                        <div className="text-3xl font-black tracking-tighter text-white">{Object.keys(groupedLogs).length || 0}</div>
                    </div>
                </div>

                {/* Notes */}
                {session.notes && (
                    <div className="glass rounded-2xl p-8 mb-8 border-white/5 bg-white/[0.02]">
                        <h3 className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4">Trainer Notes</h3>
                        <p className="text-gray-300 leading-relaxed italic">"{session.notes}"</p>
                    </div>
                )}

                {/* Exercises List */}
                <div className="space-y-8">
                    {Object.keys(groupedLogs).map((exerciseName) => (
                        <div key={exerciseName} className="glass rounded-3xl p-8 border-white/5">
                            <h3 className="text-2xl font-black mb-6 tracking-tight uppercase text-gradient">{exerciseName}</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Set</th>
                                            <th className="text-left pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Reps</th>
                                            <th className="text-left pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Weight (lbs)</th>
                                            <th className="text-left pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {groupedLogs[exerciseName].map((log) => (
                                            <tr key={log.id} className="group transition-colors hover:bg-white/[0.01]">
                                                <td className="py-4 font-black text-gray-400">{log.set_number}</td>
                                                <td className="py-2">
                                                    {isEditMode ? (
                                                        <input 
                                                            type="number" 
                                                            value={log.reps_completed ?? ''} 
                                                            onChange={(e) => handleUpdateLog(log.id, 'reps_completed', parseInt(e.target.value) || 0)}
                                                            className="w-20 bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-sm font-bold focus:border-turquoise-surf outline-none"
                                                        />
                                                    ) : (
                                                        <span className="font-bold text-lg">{log.reps_completed ?? '-'}</span>
                                                    )}
                                                </td>
                                                <td className="py-2">
                                                    {isEditMode ? (
                                                        <input 
                                                            type="number" 
                                                            value={log.weight_used_lbs ?? ''} 
                                                            onChange={(e) => handleUpdateLog(log.id, 'weight_used_lbs', parseFloat(e.target.value) || 0)}
                                                            className="w-24 bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-sm font-bold focus:border-turquoise-surf outline-none"
                                                        />
                                                    ) : (
                                                        <span className="font-bold text-lg text-turquoise-surf">{log.weight_used_lbs ?? '-'}<span className="text-[10px] text-gray-600 ml-1 uppercase">lbs</span></span>
                                                    )}
                                                </td>
                                                <td className="py-2">
                                                    {isEditMode ? (
                                                        <input 
                                                            type="text" 
                                                            value={log.notes ?? ''} 
                                                            onChange={(e) => handleUpdateLog(log.id, 'notes', e.target.value)}
                                                            placeholder="Add note..."
                                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-sm focus:border-turquoise-surf outline-none"
                                                        />
                                                    ) : (
                                                        <span className="text-gray-400 text-sm italic">{log.notes || '-'}</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                    {Object.keys(groupedLogs).length === 0 && (
                        <div className="glass rounded-3xl p-12 text-center border-dashed border-white/10">
                            <p className="text-gray-500 mb-4 font-medium">No exercises recorded for this session.</p>
                            <button
                                onClick={() => setIsEditMode(true)}
                                className="text-turquoise-surf font-black uppercase tracking-widest text-xs hover:underline"
                            >
                                + Add Logs Manually
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
