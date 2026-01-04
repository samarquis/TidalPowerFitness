'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import Link from 'next/link';

interface LeaderboardEntry {
    user_id: string;
    first_name: string;
    last_name: string;
    total_volume?: number;
    classes_attended?: number;
}

export default function LeaderboardPage() {
    const [view, setView] = useState<'volume' | 'attendance'>('volume');
    const [period, setPeriod] = useState('month');
    const [data, setData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, [view, period]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const response = view === 'volume' 
                ? await apiClient.getVolumeLeaderboard(period)
                : await apiClient.getAttendanceLeaderboard(period);
            
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
        <div className="min-h-screen bg-background page-container">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Community <span className="text-gradient">Leaderboards</span>
                    </h1>
                    <p className="text-gray-400 text-lg">See how you rank against the Tidal Power community.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                        <button 
                            onClick={() => setView('volume')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'volume' ? 'bg-turquoise-surf text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            Total Volume
                        </button>
                        <button 
                            onClick={() => setView('attendance')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'attendance' ? 'bg-turquoise-surf text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            Class Attendance
                        </button>
                    </div>

                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                        {['week', 'month', 'year', 'all'].map((p) => (
                            <button 
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${period === p ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Leaderboard Table */}
                <div className="glass-card overflow-hidden p-0">
                    {loading ? (
                        <div className="py-20 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf mx-auto"></div>
                        </div>
                    ) : data.length === 0 ? (
                        <div className="py-20 text-center text-gray-500">
                            No data available for this period.
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4 w-16">Rank</th>
                                    <th className="px-6 py-4">Athlete</th>
                                    <th className="px-6 py-4 text-right">
                                        {view === 'volume' ? 'Total Volume (lbs)' : 'Classes Attended'}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {data.map((entry, index) => (
                                    <tr key={entry.user_id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-6">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                                                index === 0 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                                                index === 1 ? 'bg-gray-300/20 text-gray-300 border border-gray-300/30' :
                                                index === 2 ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' :
                                                'text-gray-500'
                                            }`}>
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cerulean/20 to-pacific-cyan/20 flex items-center justify-center text-sm font-bold text-white border border-white/5">
                                                    {entry.first_name[0]}{entry.last_name[0]}
                                                </div>
                                                <span className="font-bold text-white group-hover:text-turquoise-surf transition-colors">
                                                    {entry.first_name} {entry.last_name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <span className="text-xl font-bold text-white tabular-nums">
                                                {view === 'volume' 
                                                    ? Number(entry.total_volume).toLocaleString() 
                                                    : entry.classes_attended}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="mt-12 text-center text-gray-500 text-sm">
                    <p>Leaderboards are updated in real-time as workouts are logged.</p>
                </div>
            </div>
        </div>
    );
}
