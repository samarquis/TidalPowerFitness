'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

interface ProgramTemplate {
    template_id: string;
    template_name: string;
    week_number: number;
    day_number: number;
}

interface ActiveProgram {
    id: string;
    program_id: string;
    program_name: string;
    current_week: number;
    current_day: number;
    total_weeks: number;
    notes?: string;
    next_workout?: {
        workout_template_id: string;
        workout_name: string;
        day_number: number;
    };
}

interface Program {
    templates: ProgramTemplate[];
}

export default function MyProgramPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    
    const [assignment, setAssignment] = useState<ActiveProgram | null>(null);
    const [programDetails, setProgramDetails] = useState<Program | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            router.push('/login?redirect=/programs/my-program');
            return;
        }
        fetchData();
    }, [isAuthenticated, authLoading]);

    const fetchData = async () => {
        try {
            const response = await apiClient.getMyActiveProgram();
            if (response.data) {
                setAssignment(response.data);
                
                // Fetch full template list for the program
                const detailsRes = await apiClient.getProgram(response.data.program_id);
                if (detailsRes.data) {
                    setProgramDetails(detailsRes.data);
                }
            } else {
                // No active program found
                setAssignment(null);
            }
        } catch (err) {
            console.error('Error fetching my program:', err);
            setError('Failed to load program data');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="min-h-screen bg-black page-container flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-6">🗓️</div>
                    <h1 className="text-3xl font-bold mb-4">No Active Program</h1>
                    <p className="text-gray-400 mb-8">You don't have a structured program assigned yet. Contact your trainer to get started!</p>
                    <Link href="/" className="btn-primary">Back to Dashboard</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black page-container">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <Link href="/" className="text-turquoise-surf hover:text-pacific-cyan mb-4 inline-block">
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            My <span className="text-gradient">Program</span>
                        </h1>
                        <div className="flex items-center gap-4 text-gray-400">
                            <span className="bg-white/5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-turquoise-surf border border-turquoise-surf/20">
                                {assignment.program_name}
                            </span>
                            <span className="text-sm">Week {assignment.current_week} of {assignment.total_weeks}</span>
                        </div>
                    </div>
                    {assignment.next_workout && (
                        <Link 
                            href={`/workouts/active?template=${assignment.next_workout.workout_template_id}&assignment=${assignment.id}`}
                            className="btn-primary py-4 px-10 text-lg"
                        >
                            Start Next Workout
                        </Link>
                    )}
                </div>

                {assignment.notes && (
                    <div className="glass-card mb-12 bg-cerulean/10 border-cerulean/20">
                        <h2 className="text-sm font-bold text-cerulean uppercase tracking-widest mb-2">Trainer's Notes</h2>
                        <p className="text-gray-300 italic">{assignment.notes}</p>
                    </div>
                )}

                {/* Progress Visualizer */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Your Progress</h2>
                        <span className="text-sm text-gray-400">{Math.round((assignment.current_week / assignment.total_weeks) * 100)}% Complete</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-4 p-1 border border-white/10">
                        <div 
                            className="bg-gradient-to-r from-cerulean to-turquoise-surf h-full rounded-full transition-all duration-1000"
                            style={{ width: `${(assignment.current_week / assignment.total_weeks) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Schedule */}
                <div className="space-y-12">
                    {Array.from({ length: assignment.total_weeks }).map((_, wIndex) => {
                        const week = wIndex + 1;
                        const isCurrentWeek = assignment.current_week === week;
                        const isPastWeek = assignment.current_week > week;
                        
                        if (!programDetails) return null;
                        const weekTemplates = programDetails.templates.filter(t => t.week_number === week);
                        
                        return (
                            <div key={week} className={`glass-card ${isCurrentWeek ? 'ring-2 ring-turquoise-surf/50' : isPastWeek ? 'opacity-60' : ''}`}>
                                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                                    <h3 className={`text-2xl font-bold ${isCurrentWeek ? 'text-turquoise-surf' : 'text-white'}`}>
                                        Week {week}
                                        {isCurrentWeek && <span className="ml-4 text-xs bg-turquoise-surf text-black px-2 py-0.5 rounded-full align-middle">CURRENT</span>}
                                        {isPastWeek && <span className="ml-4 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full align-middle">✓ COMPLETED</span>}
                                    </h3>
                                </div>
                                
                                <div className="space-y-6">
                                    {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                                        const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dayNum - 1];
                                        const dayTemplates = weekTemplates.filter(t => t.day_number === dayNum);
                                        const isToday = isCurrentWeek && assignment.current_day === dayNum;
                                        const isPastDay = isPastWeek || (isCurrentWeek && assignment.current_day > dayNum);

                                        return (
                                            <div key={dayNum} className={`flex gap-6 group ${isToday ? 'bg-white/5 -mx-6 px-6 py-4 rounded-xl' : ''}`}>
                                                <div className="w-24 shrink-0">
                                                    <p className={`text-xs font-bold uppercase mt-1 ${isToday ? 'text-turquoise-surf' : 'text-gray-500'}`}>{dayName}</p>
                                                </div>
                                                <div className="flex-1">
                                                    {dayTemplates.length > 0 ? (
                                                        <div className="space-y-3">
                                                            {dayTemplates.map((t, i) => (
                                                                <div key={i} className={`border rounded-xl p-4 transition-all ${
                                                                    isToday 
                                                                        ? 'bg-turquoise-surf/10 border-turquoise-surf/30 shadow-lg shadow-turquoise-surf/5' 
                                                                        : 'bg-white/5 border-white/5'
                                                                }`}>
                                                                    <div className="flex justify-between items-center">
                                                                        <div>
                                                                            <h4 className={`font-bold ${isToday ? 'text-white text-lg' : 'text-gray-300'}`}>{t.template_name}</h4>
                                                                            {isPastDay && <span className="text-[10px] text-green-400 font-bold uppercase">✓ Done</span>}
                                                                        </div>
                                                                        {isToday && (
                                                                            <Link 
                                                                                href={`/workouts/active?template=${t.template_id}&assignment=${assignment.id}`}
                                                                                className="btn-primary py-2 px-4 text-xs"
                                                                            >
                                                                                Start Now
                                                                            </Link>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="h-px bg-white/5 w-full mt-3"></div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
