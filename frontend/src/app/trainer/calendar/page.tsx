'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import ClassCalendar from '@/components/ClassCalendar';

export default function TrainerCalendarPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [classes, setClasses] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [weekStartDate, setWeekStartDate] = useState(() => {
        const now = new Date();
        const diff = now.getDate() - now.getDay();
        return new Date(now.setDate(diff));
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (isAuthenticated && !user?.roles?.includes('trainer') && !user?.roles?.includes('admin')) {
            router.push('/');
            return;
        }

        if (isAuthenticated && user) {
            fetchData();
        } else if (!isAuthenticated) {
            router.push('/login?redirect=/trainer/calendar');
        }
    }, [isAuthenticated, authLoading, user, router, weekStartDate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [classesRes, sessionsRes] = await Promise.all([
                apiClient.getMyClasses(),
                apiClient.getWorkoutSessions()
            ]);

            if (classesRes.data) setClasses(classesRes.data);
            if (sessionsRes.data) setSessions(sessionsRes.data);
            
            if (classesRes.error) setError(classesRes.error);
        } catch (error) {
            console.error('Error fetching calendar data:', error);
            setError('Failed to load calendar data');
        } finally {
            setLoading(false);
        }
    };

    const nextWeek = () => {
        const next = new Date(weekStartDate);
        next.setDate(next.getDate() + 7);
        setWeekStartDate(next);
    };

    const prevWeek = () => {
        const prev = new Date(weekStartDate);
        prev.setDate(prev.getDate() - 7);
        setWeekStartDate(prev);
    };

    const goToToday = () => {
        const now = new Date();
        const diff = now.getDate() - now.getDay();
        setWeekStartDate(new Date(now.setDate(diff)));
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
            </div>
        );
    }

    if (!isAuthenticated || (!user?.roles?.includes('trainer') && !user?.roles?.includes('admin'))) {
        return null;
    }

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <Link href="/trainer" className="text-turquoise-surf hover:text-pacific-cyan mb-2 inline-block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-bold">
                        Class <span className="text-gradient">Schedule</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-2 rounded-lg border border-white/10">
                    <button
                        onClick={prevWeek}
                        className="p-2 hover:bg-white/10 rounded-md transition-colors"
                        title="Previous Week"
                    >
                        ←
                    </button>
                    <button
                        onClick={goToToday}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md font-semibold text-sm transition-colors"
                    >
                        Today
                    </button>
                    <button
                        onClick={nextWeek}
                        className="p-2 hover:bg-white/10 rounded-md transition-colors"
                        title="Next Week"
                    >
                        →
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="glass rounded-2xl p-6 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
                    </div>
                ) : (
                    <ClassCalendar
                        classes={classes}
                        sessions={sessions}
                        weekStartDate={weekStartDate}
                        onClassClick={(classItem) => {
                            // Potentially navigate to class detail or show attendees
                        }}
                    />
                )}
            </div>
        </div>
    );
}
