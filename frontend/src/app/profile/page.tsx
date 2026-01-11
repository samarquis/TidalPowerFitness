'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import BadgeCard from '@/components/BadgeCard';
import ProgressDashboard from '@/components/ProgressDashboard';

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
    const { user, isAuthenticated, logout, loading: authLoading } = useAuth(); // renamed to avoid conflict
    const router = useRouter();
    const [stats, setStats] = useState<WorkoutStats | null>(null);
    const [history, setHistory] = useState<WorkoutSession[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [credits, setCredits] = useState<number | null>(null);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return; // Wait for auth check

        if (!isAuthenticated) {
            router.push('/login');
        } else if (user) {
            fetchData();
        }
    }, [isAuthenticated, user, router, authLoading]);

    const fetchData = async () => {
        try {
            if (!user) return;

            // Fetch Stats, History, and Credits
            const [statsRes, historyRes, creditsRes, allAchievementsRes, userAchievementsRes] = await Promise.all([
                apiClient.getClientStats(user.id),
                apiClient.getClientHistory(user.id),
                apiClient.getUserCredits(user.id),
                apiClient.getAllAchievements(),
                apiClient.getUserAchievements(user.id)
            ]);

            if (statsRes.data) setStats(statsRes.data);
            if (historyRes.data) setHistory(historyRes.data);
            if (creditsRes.data) setCredits(creditsRes.data.credits);

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
            setDataLoading(false);
        }
    };

    if (authLoading || (!user && !isAuthenticated)) { // Show loading while checking auth
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

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
        <div className="min-h-screen bg-black page-container">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="glass-card mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cerulean to-pacific-cyan flex items-center justify-center text-4xl font-bold text-white shadow-xl shrink-0 border-2 border-white/10">
                            {user.first_name[0]}{user.last_name[0]}
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl md:text-5xl font-bold mb-3">
                                {user.first_name} {user.last_name}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                                {user.roles.map(role => (
                                    <span key={role} className="px-3 py-1 bg-turquoise-surf/10 text-turquoise-surf text-[10px] font-bold uppercase tracking-widest rounded-full border border-turquoise-surf/20">
                                        {role}
                                    </span>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-300 border-t border-white/5 pt-6">
                                <div>
                                    <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Email Address</span>
                                    <span className="text-sm font-medium">{user.email}</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Account Status</span>
                                    <span className="text-sm font-medium flex items-center justify-center md:justify-start gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                        Active Member
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            <button
                                onClick={logout}
                                className="btn-secondary py-2 text-sm w-full md:w-auto"
                            >
                                Sign Out
                            </button>
                            {user.roles.includes('admin') && (
                                <Link
                                    href="/admin/classes"
                                    className="btn-primary py-2 text-sm w-full md:w-auto"
                                >
                                    Admin Panel
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                {stats && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
                        <div className="glass-card flex flex-col items-center justify-center text-center p-4">
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Available</div>
                            <div className="text-3xl font-bold text-turquoise-surf leading-none mb-1">{credits !== null ? credits : '-'}</div>
                            <div className="text-[10px] text-gray-600 font-medium">Credits</div>
                        </div>
                        <div className="glass-card flex flex-col items-center justify-center text-center p-4">
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Total</div>
                            <div className="text-3xl font-bold text-white leading-none mb-1">{stats.total_workouts || 0}</div>
                            <div className="text-[10px] text-gray-600 font-medium">Workouts</div>
                        </div>
                        <div className="glass-card flex flex-col items-center justify-center text-center p-4">
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Average</div>
                            <div className="text-3xl font-bold text-white leading-none mb-1">{stats.total_sets || 0}</div>
                            <div className="text-[10px] text-gray-600 font-medium">Sets</div>
                        </div>
                        <div className="glass-card flex flex-col items-center justify-center text-center p-4">
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Volume</div>
                            <div className="text-3xl font-bold text-teal-400 leading-none mb-1">
                                {((Number(stats.total_volume_lbs) || 0) / 1000).toFixed(1)}k
                            </div>
                            <div className="text-[10px] text-gray-600 font-medium">Lbs Lifted</div>
                        </div>
                    </div>
                )}

                {/* Badges & Achievements */}
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-cerulean"></span>
                    Badges & Achievements
                </h2>

                {dataLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse border border-white/5"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-16">
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
                            <div className="col-span-full glass-card py-12 text-center text-gray-500 border-dashed">
                                No achievements unlocked yet.
                            </div>
                        )}
                    </div>
                )}

                {/* Progress Dashboard */}
                <div className="mb-16">
                    <ProgressDashboard clientId={user.id} />
                </div>

                {/* Workout History */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-turquoise-surf"></span>
                        Recent Workouts
                    </h2>
                    <Link href="/workouts/history" className="text-xs font-bold text-turquoise-surf uppercase tracking-widest hover:underline">View Full History &rarr;</Link>
                </div>

                {dataLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-turquoise-surf mx-auto"></div>
                    </div>
                ) : Object.keys(sessions).length === 0 ? (
                    <div className="glass-card py-16 text-center border-dashed">
                        <p className="text-gray-400 text-lg mb-6 font-medium">No workouts logged yet.</p>
                        <Link href="/classes" className="btn-primary py-2 px-8">
                            Start Training
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(sessions).slice(0, 3).map(([sessionId, sessionData]) => (
                            <div key={sessionId} className="glass-card overflow-hidden p-0 group border border-white/5 hover:border-turquoise-surf/20">
                                <div className="bg-white/5 px-6 py-4 flex justify-between items-center border-b border-white/5 group-hover:bg-white/10 transition-colors">
                                    <h3 className="font-bold text-lg text-white">
                                        {new Date(sessionData.date).toLocaleDateString(undefined, {
                                            weekday: 'long',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </h3>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 py-1 bg-black/30 rounded-full">Completed</span>
                                </div>
                                <div className="p-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {Object.entries(sessionData.exercises).map(([exerciseName, sets]) => (
                                            <div key={exerciseName} className="bg-black/20 rounded-xl p-4 border border-white/5">
                                                <div className="flex justify-between items-baseline mb-4">
                                                    <h4 className="font-bold text-turquoise-surf text-sm uppercase tracking-tight">{exerciseName}</h4>
                                                    <span className="text-[10px] font-bold text-gray-600 uppercase">{sets.length} sets</span>
                                                </div>
                                                <div className="space-y-2">
                                                    {sets.map((set, i) => (
                                                        <div key={i} className="flex justify-between text-xs">
                                                            <span className="text-gray-500 font-bold">Set {set.set_number}</span>
                                                            <span className="flex items-center gap-2">
                                                                <span className="font-bold text-white text-sm">{set.weight_used_lbs}</span> <span className="text-gray-600 font-medium">lbs</span>
                                                                <span className="text-gray-700">×</span>
                                                                <span className="font-bold text-white text-sm">{set.reps_completed}</span> <span className="text-gray-600 font-medium">reps</span>
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
