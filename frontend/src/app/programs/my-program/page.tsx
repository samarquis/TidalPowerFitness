'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { motion } from 'framer-motion';

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
            setLoading(true);
            const response = await apiClient.getMyActiveProgram();
            if (response.data) {
                setAssignment(response.data);
                const detailsRes = await apiClient.getProgram(response.data.program_id);
                if (detailsRes.data) {
                    setProgramDetails(detailsRes.data);
                }
            } else {
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
            <div className="min-h-screen bg-black page-container flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-turquoise-surf/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="text-center max-w-md relative z-10">
                    <div className="text-8xl mb-8 animate-bounce">🗓️</div>
                    <h1 className="text-4xl font-black mb-4 tracking-tighter uppercase italic">No Active Mission</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-10 leading-loose">You don't have a structured program assigned to your profile yet. Reach out to Lisa or Scott to deploy your next phase.</p>
                    <Link href="/" className="btn-primary px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-turquoise-surf/20">Return to Base</Link>
                </div>
            </div>
        );
    }

    const progressPercent = Math.round(((assignment.current_week - 1) * 7 + assignment.current_day) / (assignment.total_weeks * 7) * 100);

    return (
        <div className="min-h-screen bg-black page-container relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pacific-cyan/5 rounded-full blur-[150px] pointer-events-none" />
            
            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                        <Link href="/" className="text-[10px] font-black text-gray-500 hover:text-turquoise-surf mb-6 inline-flex items-center gap-2 uppercase tracking-[0.3em] transition-all">
                            ← Back to Tactical Overview
                        </Link>
                        <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter uppercase italic">
                            Tactical <span className="text-gradient">Program</span>
                        </h1>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-turquoise-surf/10 border border-turquoise-surf/20 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-turquoise-surf animate-pulse"></span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-turquoise-surf">
                                    {assignment.program_name}
                                </span>
                            </div>
                            <span className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Phase {assignment.current_week} of {assignment.total_weeks}</span>
                        </div>
                    </div>
                    {assignment.next_workout && (
                        <Link 
                            href={`/workouts/active?template=${assignment.next_workout.workout_template_id}&assignment=${assignment.id}`}
                            className="bg-white text-black py-5 px-12 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all"
                        >
                            Deploy Next Session
                        </Link>
                    )}
                </div>

                {/* Progress Hub */}
                <div className="glass-card mb-16 p-10 border-white/5 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-1 text-white">Mission <span className="text-turquoise-surf">Timeline</span></h2>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global progress across all phases</p>
                        </div>
                        <div className="text-right">
                            <span className="text-5xl font-black italic text-white">{progressPercent}%</span>
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-3">Complete</span>
                        </div>
                    </div>
                    <div className="w-full bg-white/[0.03] rounded-full h-3 p-0.5 border border-white/5 shadow-inner">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="bg-gradient-to-r from-cerulean via-pacific-cyan to-turquoise-surf h-full rounded-full shadow-[0_0_20px_rgba(0,242,255,0.4)]"
                        />
                    </div>
                    
                    {assignment.notes && (
                        <div className="mt-10 p-6 bg-white/[0.02] border-l-4 border-turquoise-surf rounded-r-2xl">
                            <p className="text-[9px] font-black text-turquoise-surf uppercase tracking-[0.2em] mb-2">Trainer Intelligence</p>
                            <p className="text-gray-400 text-sm leading-relaxed italic">"{assignment.notes}"</p>
                        </div>
                    )}
                </div>

                {/* The Timeline */}
                <div className="space-y-12">
                    {Array.from({ length: assignment.total_weeks }).map((_, wIndex) => {
                        const week = wIndex + 1;
                        const isCurrentWeek = assignment.current_week === week;
                        const isPastWeek = assignment.current_week > week;
                        
                        if (!programDetails) return null;
                        const weekTemplates = programDetails.templates.filter(t => t.week_number === week);
                        
                        return (
                            <motion.div 
                                key={week} 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className={`glass-card p-0 overflow-hidden border-white/5 transition-all duration-500 ${isCurrentWeek ? 'ring-1 ring-turquoise-surf/30 shadow-[0_0_50px_rgba(0,242,255,0.05)]' : isPastWeek ? 'opacity-40 grayscale' : 'opacity-60'}`}
                            >
                                <div className={`px-8 py-6 flex justify-between items-center ${isCurrentWeek ? 'bg-white/[0.03]' : 'bg-transparent'} border-b border-white/5`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black italic ${isCurrentWeek ? 'bg-turquoise-surf text-black' : 'bg-white/5 text-gray-500'}`}>
                                            {week}
                                        </div>
                                        <h3 className="text-xl font-black uppercase tracking-tighter text-white">Phase {week}</h3>
                                    </div>
                                    {isCurrentWeek ? (
                                        <span className="px-3 py-1 bg-turquoise-surf/10 text-turquoise-surf text-[8px] font-black uppercase tracking-[0.2em] rounded-lg border border-turquoise-surf/20">In Progress</span>
                                    ) : isPastWeek ? (
                                        <span className="text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            Secured
                                        </span>
                                    ) : (
                                        <span className="text-gray-700 text-[10px] font-black uppercase tracking-widest">Locked</span>
                                    )}
                                </div>
                                
                                <div className="p-8 space-y-4">
                                    {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                                        const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dayNum - 1];
                                        const dayTemplates = weekTemplates.filter(t => t.day_number === dayNum);
                                        const isToday = isCurrentWeek && assignment.current_day === dayNum;
                                        const isPastDay = isPastWeek || (isCurrentWeek && assignment.current_day > dayNum);

                                        return (
                                            <div key={dayNum} className={`flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-4 rounded-2xl transition-all ${isToday ? 'bg-turquoise-surf/[0.03] ring-1 ring-turquoise-surf/10' : 'hover:bg-white/[0.01]'}`}>
                                                <div className="w-32">
                                                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isToday ? 'text-turquoise-surf' : isPastDay ? 'text-gray-600' : 'text-gray-500'}`}>{dayName}</p>
                                                </div>
                                                <div className="flex-1">
                                                    {dayTemplates.length > 0 ? (
                                                        <div className="space-y-3">
                                                            {dayTemplates.map((t, i) => (
                                                                <div key={i} className={`group flex items-center justify-between p-5 rounded-2xl border transition-all ${
                                                                    isToday 
                                                                        ? 'bg-black/40 border-turquoise-surf/30 shadow-xl' 
                                                                        : 'bg-white/[0.02] border-white/5'
                                                                }`}>
                                                                    <div>
                                                                        <h4 className={`font-black uppercase tracking-tight ${isToday ? 'text-white text-lg' : 'text-gray-400'}`}>{t.template_name}</h4>
                                                                        {isPastDay && <p className="text-[8px] text-green-500 font-black uppercase tracking-widest mt-1">Confirmed • Success</p>}
                                                                    </div>
                                                                    {isToday && (
                                                                        <Link 
                                                                            href={`/workouts/active?template=${t.template_id}&assignment=${assignment.id}`}
                                                                            className="bg-turquoise-surf text-black px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-turquoise-surf/20"
                                                                        >
                                                                            Deploy
                                                                        </Link>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="h-px bg-white/[0.03] w-full"></div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}