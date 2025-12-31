'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Skeleton from '@/components/ui/Skeleton';

interface Challenge {
    id: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    type: string;
    goal_value: number;
    trainer_name: string;
    participant_count: number;
}

export default function ChallengesPage() {
    const { isAuthenticated } = useAuth();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChallenges();
    }, []);

    const fetchChallenges = async () => {
        try {
            const response = await apiClient.getChallenges();
            if (response.data) {
                setChallenges(response.data);
            }
        } catch (error) {
            console.error('Error fetching challenges:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (id: string) => {
        if (!isAuthenticated) return;
        try {
            const response = await apiClient.joinChallenge(id);
            if (response.data) {
                fetchChallenges();
            }
        } catch (error) {
            console.error('Error joining challenge:', error);
        }
    };

    return (
        <div className="min-h-screen bg-black page-container">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Community <span className="text-gradient">Challenges</span>
                    </h1>
                    <p className="text-gray-400 text-lg">Push your limits together with the Tidal Power community.</p>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-card h-64 animate-pulse">
                                <Skeleton className="h-8 w-3/4 mb-4" />
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        ))}
                    </div>
                ) : challenges.length === 0 ? (
                    <div className="text-center py-20 glass-card border-dashed">
                        <p className="text-gray-500 italic">No active challenges at the moment. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {challenges.map((challenge) => (
                            <div key={challenge.id} className="glass-card flex flex-col group hover:border-turquoise-surf/30 transition-all">
                                <div className="mb-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-2xl font-bold text-white group-hover:text-turquoise-surf transition-colors">{challenge.name}</h3>
                                        <span className="bg-turquoise-surf/10 text-turquoise-surf text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">
                                            {challenge.type.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm line-clamp-2">{challenge.description}</p>
                                </div>

                                <div className="space-y-3 mb-8 flex-1">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span>📅 {new Date(challenge.start_date).toLocaleDateString()} - {new Date(challenge.end_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span>👥 {challenge.participant_count} Participants</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span>🏆 Goal: {challenge.goal_value?.toLocaleString()} {challenge.type.includes('volume') ? 'lbs' : challenge.type.includes('workouts') ? 'sessions' : ''}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Link 
                                        href={`/challenges/${challenge.id}`}
                                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white text-center rounded-lg font-bold text-sm border border-white/5 transition-all"
                                    >
                                        Details
                                    </Link>
                                    <button 
                                        onClick={() => handleJoin(challenge.id)}
                                        className="flex-1 py-2 bg-turquoise-surf text-black rounded-lg font-bold text-sm hover:bg-pacific-cyan transition-all"
                                    >
                                        Join Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
