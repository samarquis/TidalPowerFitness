'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Summary {
    session_id: string;
    total_sets: number;
    total_volume_lbs: number;
    exercises_completed: number;
    personal_records: any[];
    duration_minutes: number;
    session_date: string;
}

export default function MissionAccomplishedPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const params = useParams();
    const sessionId = params.id as string;

    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated && sessionId) {
            fetchSummary();
            // Fire confetti!
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function() {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);
        }
    }, [isAuthenticated, sessionId]);

    const fetchSummary = async () => {
        try {
            const response = await apiClient.getWorkoutSummary(sessionId);
            if (response.data) {
                setSummary(response.data);
            }
        } catch (error) {
            console.error('Error fetching summary:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="animate-pulse text-pacific-cyan font-black tracking-tighter text-4xl">LOADING RESULTS...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black pt-24 pb-16 px-4 overflow-hidden relative">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pacific-cyan/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-block px-4 py-1 rounded-full bg-pacific-cyan/10 border border-pacific-cyan/20 text-pacific-cyan text-xs font-black uppercase tracking-widest mb-4">
                        Workout Complete
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 italic">
                        MISSION <span className="text-gradient">ACCOMPLISHED</span>
                    </h1>
                    <p className="text-gray-400 text-xl max-w-xl mx-auto">
                        Another session in the vault. Your progress is being calculated and synced to your profile.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {/* Stat 1 */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-8 text-center"
                    >
                        <div className="text-4xl font-black text-white mb-1">
                            {summary?.total_volume_lbs?.toLocaleString() || 0}
                        </div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Lbs Moved</div>
                    </motion.div>

                    {/* Stat 2 */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-8 text-center border-pacific-cyan/30"
                    >
                        <div className="text-4xl font-black text-pacific-cyan mb-1">
                            {summary?.exercises_completed || 0}
                        </div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Exercises Nailed</div>
                    </motion.div>

                    {/* Stat 3 */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card p-8 text-center"
                    >
                        <div className="text-4xl font-black text-white mb-1">
                            {summary?.personal_records?.length || 0}
                        </div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">New PRs Set 🔥</div>
                    </motion.div>
                </div>

                {summary && summary.personal_records.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="bg-gradient-to-r from-dark-teal/40 to-pacific-cyan/20 border border-pacific-cyan/30 rounded-3xl p-8 mb-12"
                    >
                        <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                            <span className="text-2xl">🔥</span> Records Broken This Session
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {summary.personal_records.map((pr: any, i: number) => (
                                <div key={i} className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/5">
                                    <span className="font-bold">{pr.exercise_name}</span>
                                    <span className="text-pacific-cyan font-black">{pr.value} lbs</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link 
                        href="/dashboard" 
                        className="btn-primary px-12 py-4 text-center"
                    >
                        Return to Dashboard
                    </Link>
                    <Link 
                        href={`/workouts/history/${sessionId}`} 
                        className="btn-secondary px-12 py-4 text-center"
                    >
                        View Full Breakdown
                    </Link>
                </div>
            </div>
        </div>
    );
}
