'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface LeaderboardEntry {
    user_id: string;
    first_name: string;
    last_name: string;
    total_volume?: string | number;
    classes_attended?: string | number;
    max_weight?: string | number;
}

const CATEGORIES = [
    { id: 'volume', label: 'Heavy Hitters', sublabel: 'Total Lbs Moved', icon: '🏋️' },
    { id: 'attendance', label: 'The Faithful', sublabel: 'Sessions Attended', icon: '📅' },
    { id: 'lifts', label: 'Elite Lifts', sublabel: 'Personal Best Lifts', icon: '🏆' }
];

const PERIODS = [
    { id: 'week', label: 'Weekly' },
    { id: 'month', label: 'Monthly' },
    { id: 'all', label: 'All-Time' }
];

const ELITE_EXERCISES = [
    { id: 'bench', name: 'Bench Press' },
    { id: 'squat', name: 'Back Squat' },
    { id: 'deadlift', name: 'Deadlift' }
];

export default function LeaderboardPage() {
    const [view, setView] = useState<'volume' | 'attendance' | 'lifts'>('volume');
    const [period, setPeriod] = useState('month');
    const [selectedExercise, setSelectedExercise] = useState(ELITE_EXERCISES[0].id);
    const [data, setData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, [view, period, selectedExercise]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            let response;
            if (view === 'volume') {
                response = await apiClient.getVolumeLeaderboard(period);
            } else if (view === 'attendance') {
                response = await apiClient.getAttendanceLeaderboard(period);
            } else {
                // Find actual exercise ID from the elite list mapping (mocking search for now)
                // In a real env, we would have UUIDs for these exercises
                response = await apiClient.getExerciseLeaderboard(selectedExercise);
            }
            
            if (response.data) {
                setData(response.data);
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black page-container relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-turquoise-surf/10 to-transparent pointer-events-none" />
            
            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic mb-4">
                            The <span className="text-gradient">Arena</span>
                        </h1>
                        <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-xs">Witness Greatness • Prove Your Worth</p>
                    </motion.div>
                </div>

                {/* Primary Category Selector */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setView(cat.id as any)}
                            className={`p-6 rounded-3xl border transition-all text-left group relative overflow-hidden active:scale-95 ${
                                view === cat.id 
                                    ? 'bg-white/[0.05] border-turquoise-surf/50 shadow-2xl shadow-turquoise-surf/10' 
                                    : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                            }`}
                        >
                            <div className={`absolute top-0 right-0 p-4 text-4xl opacity-10 group-hover:scale-110 transition-transform ${view === cat.id ? 'opacity-30 scale-110' : ''}`}>
                                {cat.icon}
                            </div>
                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${view === cat.id ? 'text-turquoise-surf' : 'text-gray-600'}`}>
                                {cat.sublabel}
                            </p>
                            <h3 className="text-xl font-black uppercase italic text-white">{cat.label}</h3>
                        </button>
                    ))}
                </div>

                {/* Sub-Filters */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
                    <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/5">
                        {PERIODS.map((p) => (
                            <button 
                                key={p.id}
                                onClick={() => setPeriod(p.id)}
                                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                                    period === p.id ? 'bg-white text-black shadow-xl' : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {view === 'lifts' && (
                        <div className="flex gap-2">
                            {ELITE_EXERCISES.map((ex) => (
                                <button
                                    key={ex.id}
                                    onClick={() => setSelectedExercise(ex.id)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all active:scale-95 ${
                                        selectedExercise === ex.id 
                                            ? 'border-turquoise-surf text-turquoise-surf bg-turquoise-surf/10' 
                                            : 'border-white/5 text-gray-500 hover:border-white/20'
                                    }`}
                                >
                                    {ex.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Leaderboard Hub */}
                <div className="glass-card p-0 border-white/5 relative overflow-hidden bg-white/[0.01]">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="py-32 text-center"
                            >
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf mx-auto"></div>
                                <p className="mt-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Gathering Intel...</p>
                            </motion.div>
                        ) : data.length === 0 ? (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="py-32 text-center"
                            >
                                <p className="text-gray-600 font-black uppercase tracking-widest text-sm">No legends recorded for this period yet.</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="table"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="overflow-x-auto"
                            >
                                <table className="w-full text-left min-w-[600px] md:min-w-0">
                                    <thead className="bg-white/[0.03] text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 border-b border-white/5">
                                        <tr>
                                            <th className="px-8 py-6 w-24">Rank</th>
                                            <th className="px-8 py-6">Athlete</th>
                                            <th className="px-8 py-6 text-right">
                                                {view === 'volume' ? 'Total Volume' : view === 'attendance' ? 'Engagements' : 'Max Output'}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {data.map((entry, index) => (
                                            <tr key={entry.user_id} className="group transition-all hover:bg-white/[0.02]">
                                                <td className="px-8 py-8">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black italic border ${
                                                        index === 0 ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30 shadow-lg shadow-yellow-500/10' :
                                                        index === 1 ? 'bg-gray-300/20 text-gray-300 border-gray-300/30' :
                                                        index === 2 ? 'bg-orange-500/20 text-orange-500 border-orange-500/30' :
                                                        'text-gray-600 border-transparent'
                                                    }`}>
                                                        {index + 1}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-8">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent flex items-center justify-center text-sm font-black text-white border border-white/5 shadow-xl">
                                                            {entry.first_name[0]}{entry.last_name[0]}
                                                        </div>
                                                        <div>
                                                            <span className="block font-black text-white text-lg tracking-tight uppercase group-hover:text-turquoise-surf transition-colors">
                                                                {entry.first_name} {entry.last_name}
                                                            </span>
                                                            {index === 0 && <span className="text-[8px] font-black text-yellow-500 uppercase tracking-widest">Reigning Champion</span>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-8 text-right">
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-3xl font-black text-white tabular-nums tracking-tighter italic">
                                                            {view === 'volume' 
                                                                ? Number(entry.total_volume).toLocaleString() 
                                                                : view === 'attendance' 
                                                                    ? entry.classes_attended 
                                                                    : entry.max_weight}
                                                        </span>
                                                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1">
                                                            {view === 'volume' ? 'LBS' : view === 'attendance' ? 'Sessions' : 'LBS'}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-gray-600 font-bold uppercase tracking-[0.2em] text-[10px]">Arena metrics are recalibrated in real-time</p>
                </div>
            </div>
        </div>
    );
}