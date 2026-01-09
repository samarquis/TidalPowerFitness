'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { BlackGlassCard } from '@/components/ui';

interface SessionSummary {
    session_id: string;
    total_sets: number;
    total_volume_lbs: number;
    exercises_completed: number;
    personal_records: any[];
    duration_minutes: number;
    session_date: string;
}

function WorkoutCompleteContent() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams ? searchParams.get('session') : null;
    const duration = searchParams ? searchParams.get('duration') : null;

    const [summary, setSessionSummary] = useState<SessionSummary | null>(null);
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (sessionId) {
            fetchSummary();
        }
        
        // Initial celebration confetti
        fireConfetti();
    }, [sessionId]);

    const fetchSummary = async () => {
        try {
            const response = await apiClient.getSessionSummary(sessionId!);
            if (response.data) {
                setSessionSummary(response.data);
            }
        } catch (error) {
            console.error('Error fetching summary:', error);
        } finally {
            setLoading(false);
        }
    };

    const fireConfetti = () => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ 
                ...defaults, 
                particleCount, 
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#08acd6', '#007ba7', '#ffffff', '#ff4500']
            });
            confetti({ 
                ...defaults, 
                particleCount, 
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#08acd6', '#007ba7', '#ffffff', '#ff4500']
            });
        }, 250);
    };

    const handleFinish = async () => {
        setSaving(true);
        try {
            // Update session with end time and notes
            await apiClient.updateWorkoutSession(sessionId!, {
                end_time: new Date(),
                duration_minutes: summary?.duration_minutes || parseInt(duration || '0'),
                notes: notes
            });

            router.push('/workouts/history');
        } catch (error) {
            console.error('Error saving workout:', error);
            alert('Failed to save workout');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
                    <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-xs">Analyzing Performance...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16 logo-watermark">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Mission Accomplished Hero */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-turquoise-surf/20 rounded-full mb-6 relative">
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-turquoise-surf/10 rounded-full blur-xl"
                        />
                        <span className="text-5xl">🏆</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter uppercase">
                        MISSION <span className="text-gradient">ACCOMPLISHED</span>
                    </h1>
                    <p className="text-xl text-gray-400 font-medium">Another step closer to your peak, {user?.first_name}.</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <BlackGlassCard className="text-center py-8">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Duration</p>
                            <p className="text-3xl font-black text-white">{summary?.duration_minutes || duration || '--'} <span className="text-xs font-normal text-gray-500">min</span></p>
                        </BlackGlassCard>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <BlackGlassCard className="text-center py-8">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Volume</p>
                            <p className="text-3xl font-black text-turquoise-surf">{(Number(summary?.total_volume_lbs || 0) / 1000).toFixed(1)}k <span className="text-xs font-normal text-gray-500">lbs</span></p>
                        </BlackGlassCard>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <BlackGlassCard className="text-center py-8">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Total Sets</p>
                            <p className="text-3xl font-black text-white">{summary?.total_sets || 0}</p>
                        </BlackGlassCard>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <BlackGlassCard className="text-center py-8">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Exercises</p>
                            <p className="text-3xl font-black text-white">{summary?.exercises_completed || 0}</p>
                        </BlackGlassCard>
                    </motion.div>
                </div>

                {/* Personal Records Highlight */}
                {summary && summary.personal_records && summary.personal_records.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-8"
                    >
                        <BlackGlassCard className="border-orange-500/30 bg-orange-500/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <span className="text-6xl">🔥</span>
                            </div>
                            <h3 className="text-xl font-bold text-orange-500 mb-6 flex items-center gap-2">
                                <span className="text-2xl">⚡</span> NEW PERSONAL RECORDS
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {summary.personal_records.map((pr: any, i: number) => (
                                    <div key={i} className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-orange-500/20">
                                        <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold">
                                            PR
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">{pr.exercise_name}</p>
                                            <p className="text-xl font-black text-white">
                                                {pr.value} <span className="text-xs font-medium text-gray-500">{pr.record_type === 'max_weight' ? 'lbs' : pr.record_type === 'max_reps' ? 'reps' : 'vol'}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </BlackGlassCard>
                    </motion.div>
                )}

                {/* Notes and Finish */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-6"
                >
                    <div className="glass rounded-2xl p-8 border-white/5">
                        <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter">Session Notes</h3>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Record your thoughts on today's performance..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-turquoise-surf outline-none transition-all h-32"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleFinish}
                            disabled={saving}
                            className="flex-1 px-8 py-5 bg-turquoise-surf text-black font-black rounded-2xl text-xl transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(8,172,214,0.4)] uppercase tracking-widest flex items-center justify-center gap-3"
                        >
                            {saving ? (
                                <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
                            ) : (
                                'Close Session & Save'
                            )}
                        </button>
                        
                        <Link 
                            href="/workouts/history" 
                            className="px-8 py-5 bg-white/5 text-white font-bold rounded-2xl text-xl border border-white/10 hover:bg-white/10 transition-all text-center uppercase tracking-widest"
                        >
                            View History
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function WorkoutCompletePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
                    <p className="mt-4 text-gray-400">Loading celebration...</p>
                </div>
            </div>
        }>
            <WorkoutCompleteContent />
        </Suspense>
    );
}