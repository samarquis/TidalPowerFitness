'use client';

import { useState, useEffect, use } from 'react';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Participant {
    user_id: string;
    first_name: string;
    last_name: string;
    current_progress: number;
    is_completed: boolean;
}

interface Challenge {
    id: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    type: string;
    goal_value: number;
    trainer_name: string;
    participants: Participant[];
}

export default function ChallengeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user } = useAuth();
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChallenge();
    }, [id]);

    const fetchChallenge = async () => {
        try {
            const response = await apiClient.getChallenge(id);
            if (response.data) {
                setChallenge(response.data);
            }
        } catch (error) {
            console.error('Error fetching challenge:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Challenge not found</h2>
                    <Link href="/challenges" className="btn-primary">Back to Challenges</Link>
                </div>
            </div>
        );
    }

    const userParticipant = challenge.participants.find(p => p.user_id === user?.id);

    return (
        <div className="min-h-screen bg-black page-container">
            <div className="max-w-5xl mx-auto">
                <div className="mb-12">
                    <Link href="/challenges" className="text-turquoise-surf hover:text-pacific-cyan mb-4 inline-block">
                        ← Back to Challenges
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{challenge.name}</h1>
                    <div className="flex items-center gap-4 text-gray-400">
                        <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-turquoise-surf border border-turquoise-surf/20">
                            {challenge.type.replace('_', ' ')}
                        </span>
                        <span className="text-sm font-medium">Led by Coach {challenge.trainer_name}</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Sidebar: Details & Your Progress */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="glass-card">
                            <h2 className="text-xl font-bold mb-4">About the Challenge</h2>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                {challenge.description}
                            </p>
                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Timeline:</span>
                                    <span className="text-white font-medium">{new Date(challenge.start_date).toLocaleDateString()} - {new Date(challenge.end_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Goal:</span>
                                    <span className="text-white font-medium">{challenge.goal_value?.toLocaleString()} {challenge.type.includes('volume') ? 'lbs' : 'sessions'}</span>
                                </div>
                            </div>
                        </div>

                        {userParticipant && (
                            <div className="bg-gradient-to-br from-cerulean/20 to-dark-teal/20 border border-turquoise-surf/30 rounded-2xl p-6">
                                <h3 className="text-sm font-bold text-turquoise-surf uppercase tracking-widest mb-4">Your Progress</h3>
                                <div className="mb-4">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-2xl font-bold text-white">{userParticipant.current_progress.toLocaleString()}</span>
                                        <span className="text-xs text-gray-400">/ {challenge.goal_value?.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2">
                                        <div 
                                            className="bg-turquoise-surf h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min(100, (userParticipant.current_progress / challenge.goal_value) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                                {userParticipant.is_completed && (
                                    <div className="text-center py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-xs font-bold">
                                        🏆 CHALLENGE COMPLETED
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Main: Leaderboard */}
                    <div className="lg:col-span-2">
                        <div className="glass-card p-0 overflow-hidden">
                            <div className="px-6 py-6 border-b border-white/5">
                                <h2 className="text-xl font-bold">Leaderboard</h2>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                    <tr>
                                        <th className="px-6 py-4 w-16 text-center">Rank</th>
                                        <th className="px-6 py-4">Participant</th>
                                        <th className="px-6 py-4 text-right">Progress</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {challenge.participants.map((p, index) => (
                                        <tr key={p.user_id} className={`group hover:bg-white/[0.02] transition-colors ${p.user_id === user?.id ? 'bg-turquoise-surf/5' : ''}`}>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`text-sm font-bold ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-500' : 'text-gray-600'}`}>
                                                    {index + 1}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-white border border-white/10">
                                                        {p.first_name[0]}{p.last_name[0]}
                                                    </div>
                                                    <span className="font-bold text-white">{p.first_name} {p.last_name}</span>
                                                    {p.is_completed && <span className="text-[10px]">🏆</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right font-bold text-white tabular-nums">
                                                {p.current_progress.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
