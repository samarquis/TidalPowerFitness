'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import BadgeCard from '@/components/BadgeCard';

interface WorkoutStats {
    total_workouts: number;
    total_sets: number;
    total_volume_lbs: number;
}

interface WorkoutSession {
    session_id: string;
    session_date: string;
    exercise_name: string;
    set_number: number;
    reps_completed: number;
    weight_used_lbs: number;
    rpe?: number;
}

interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    earned?: boolean;
    earned_at?: string;
}

export default function ProfilePage() {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<WorkoutStats | null>(null);
    const [history, setHistory] = useState<WorkoutSession[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else if (user) {
            fetchData();
        }
    }, [isAuthenticated, user, router]);

    const fetchData = async () => {
        try {
            if (!user) return;

            // Fetch Stats and History
            const [statsRes, historyRes, allAchievementsRes, userAchievementsRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/workout-sessions/client/${user.id}/stats`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/workout-sessions/client/${user.id}/history`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                }),
                apiClient.getAllAchievements(),
                apiClient.getUserAchievements(user.id)
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (historyRes.ok) setHistory(await historyRes.json());

            const allAchievements = allAchievementsRes.data || [];
            const userAchievements = userAchievementsRes.data || [];

            // Merge achievements to determine earned status
            const mergedAchievements = allAchievements.map((achievement: any) => {
                const userAchievement = userAchievements.find((ua: any) => ua.achievement_id === achievement.id);
                return {
                    ...achievement,
                    earned: !!userAchievement,
                    earned_at: userAchievement ? userAchievement.earned_at : undefined
                };
            });

            setAchievements(mergedAchievements);

        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    // Group history by session
    const sessions = history.reduce((acc, log) => {
        if (!acc[log.session_id]) {
            acc[log.session_id] = {
                date: log.session_date,
                exercises: {}
            };
        }
        if (!acc[log.session_id].exercises[log.exercise_name]) {
            acc[log.session_id].exercises[log.exercise_name] = [];
        }
        acc[log.session_id].exercises[log.exercise_name].push(log);
        return acc;
    }, {} as Record<string, { date: string; exercises: Record<string, WorkoutSession[]> }>);

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="glass rounded-2xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-teal-600 to-teal-500 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                            {user.first_name[0]}{user.last_name[0]}
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                {user.first_name} {user.last_name}
                            </h1>
                            <p className="text-teal-400 font-semibold mb-6 uppercase tracking-wide">
                                {user.roles.join(', ')} Account
                            </p>

                            <div className="flex flex-col md:flex-row gap-6 text-gray-300 border-t border-white/10 pt-4">
                                <div>
                                    <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Email</span>
                                    <span className="text-sm">{user.email}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Member Since</span>
                                    <span className="text-sm">{new Date().getFullYear()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={logout}
                                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50 rounded-lg text-sm font-semibold transition-all"
                            >
                                Sign Out
                            </button>
                            {user.roles.includes('admin') && (
                                <Link
                                    href="/admin/classes"
                                    className="px-4 py-2 bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 border border-teal-600/50 rounded-lg text-sm font-semibold transition-all text-center"
                                >
                                    Admin Dashboard
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="glass p-6 rounded-xl text-center">
                            <div className="text-gray-400 text-sm uppercase tracking-wider mb-1">Workouts</div>
                            <div className="text-3xl font-bold text-white">{stats.total_workouts || 0}</div>
                        </div>
                        <div className="glass p-6 rounded-xl text-center">
                            <div className="text-gray-400 text-sm uppercase tracking-wider mb-1">Total Sets</div>
                            <div className="text-3xl font-bold text-white">{stats.total_sets || 0}</div>
                        </div>
                        <div className="glass p-6 rounded-xl text-center">
                            <div className="text-gray-400 text-sm uppercase tracking-wider mb-1">Volume Lifted</div>
                            <div className="text-3xl font-bold text-teal-400">
                                {(Number(stats.total_volume_lbs) || 0).toLocaleString()} <span className="text-sm font-normal text-gray-400">lbs</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Badges & Achievements */}
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <span className="mr-2">🏆</span> Badges & Achievements
                </h2>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {achievements.map((achievement) => (
                            <BadgeCard
                                key={achievement.id}
                                name={achievement.name}
                                description={achievement.description}
                                icon={achievement.icon}
                                earned={!!achievement.earned}
                                earnedDate={achievement.earned_at}
                            />
                        ))}
                        {achievements.length === 0 && (
                            <div className="col-span-full glass p-8 text-center text-gray-400">
                                No achievements available yet.
                            </div>
                        )}
                    </div>
                )}

                {/* Workout History */}
                <h2 className="text-2xl font-bold mb-6">Recent Workouts</h2>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-400 mx-auto"></div>
                    </div>
                ) : Object.keys(sessions).length === 0 ? (
                    <div className="glass p-8 rounded-xl text-center">
                        <p className="text-gray-400 text-lg mb-2">No workouts logged yet.</p>
                        <p className="text-gray-500 text-sm">Join a class to start tracking your progress!</p>
                        <Link href="/classes" className="inline-block mt-4 text-teal-400 hover:text-teal-300 hover:underline">
                            Browse Classes →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(sessions).map(([sessionId, sessionData]) => (
                            <div key={sessionId} className="glass rounded-xl overflow-hidden">
                                <div className="bg-white/5 px-6 py-4 flex justify-between items-center">
                                    <h3 className="font-bold text-lg">
                                        {new Date(sessionData.date).toLocaleDateString(undefined, {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </h3>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Completed</span>
                                </div>
                                <div className="p-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {Object.entries(sessionData.exercises).map(([exerciseName, sets]) => (
                                            <div key={exerciseName} className="bg-black/20 rounded-lg p-4">
                                                <div className="flex justify-between items-baseline mb-3">
                                                    <h4 className="font-semibold text-teal-400">{exerciseName}</h4>
                                                    <span className="text-xs text-gray-500">{sets.length} sets</span>
                                                </div>
                                                <div className="space-y-1">
                                                    {sets.map((set, i) => (
                                                        <div key={i} className="flex justify-between text-sm">
                                                            <span className="text-gray-400">Set {set.set_number}</span>
                                                            <span>
                                                                <span className="font-semibold text-white">{set.weight_used_lbs}</span> <span className="text-gray-500">lbs</span>
                                                                <span className="mx-2 text-gray-600">×</span>
                                                                <span className="font-semibold text-white">{set.reps_completed}</span> <span className="text-gray-500">reps</span>
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
