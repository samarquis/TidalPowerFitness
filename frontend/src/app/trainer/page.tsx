'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import Skeleton from '@/components/ui/Skeleton';
import { formatTime12Hour } from "@/lib/utils";

interface Class {
    id: string;
    name: string;
    description: string;
    start_time: string;
    duration_minutes: number;
    category: string;
    day_of_week: number;
    days_of_week?: number[];
    max_capacity: number;
    instructor_id: string;
}

interface Attendee {
    booking_id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    booking_date: string;
}

interface ClassWithAttendees extends Class {
    attendee_count?: number;
    attendees?: Attendee[];
}

interface WorkoutSession {
    id: string;
    session_date: string;
    start_time?: string;
    class_name?: string;
    workout_type_name?: string;
    participant_count?: number;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TrainerDashboardPage() {
    const { user, isAuthenticated, loading: authLoading, token } = useAuth();
    const router = useRouter();
    const [classes, setClasses] = useState<ClassWithAttendees[]>([]);
    const [sessions, setSessions] = useState<WorkoutSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [selectedClass, setSelectedClass] = useState<ClassWithAttendees | null>(null);
    const [loadingAttendees, setLoadingAttendees] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (isAuthenticated && !user?.roles?.includes('trainer') && !user?.roles?.includes('admin')) {
            router.push('/');
            return;
        }

        if (isAuthenticated && user) {
            fetchClasses();
            fetchSessions();
        } else if (!isAuthenticated) {
            router.push('/login?redirect=/trainer');
        }
    }, [isAuthenticated, authLoading, user, router]);

    const fetchClasses = async () => {
        try {
            const response = await apiClient.getMyClasses();
            if (response.data) {
                setClasses(response.data);
            } else if (response.error) {
                setError(response.error);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
            setError('Failed to fetch classes');
        } finally {
            setLoading(false);
        }
    };

    const fetchSessions = async () => {
        try {
            const response = await apiClient.getWorkoutSessions();
            if (response.data) {
                setSessions(response.data);
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
        } finally {
            setLoadingSessions(false);
        }
    };

    const fetchAttendees = async (classId: string, date?: string) => {
        setLoadingAttendees(true);
        try {
            const response = await apiClient.getClassAttendees(classId, date);
            if (response.data) {
                setSelectedClass(prev => {
                    const classData = classes.find(c => c.id === classId);
                    return classData ? { ...classData, ...response.data } : null;
                });
            }
        } catch (error) {
            console.error('Error fetching attendees:', error);
        } finally {
            setLoadingAttendees(false);
        }
    };

    const handleViewAttendees = (classItem: Class, dayIndex: number) => {
        // Calculate the date for the specified day in the current week
        const now = new Date();
        const currentDay = now.getDay();
        const diff = dayIndex - currentDay;
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + diff);
        const dateStr = targetDate.toISOString().split('T')[0];

        setSelectedClass({ ...classItem, attendees: undefined });
        fetchAttendees(classItem.id, dateStr);
    };

    const closeModal = () => {
        setSelectedClass(null);
    };

    // Group classes by day
    const classesByDay = DAYS.map((day, dayIndex) => ({
        day,
        dayIndex,
        classes: classes.filter(c => {
            const days = c.days_of_week && c.days_of_week.length > 0 ? c.days_of_week : [c.day_of_week];
            return days.includes(dayIndex);
        })
    }));

    // Get today's and upcoming sessions
    const today = new Date().toISOString().split('T')[0];
    const todaysSessions = sessions.filter(s => s.session_date?.split('T')[0] === today);
    const recentSessions = sessions.slice(0, 5);

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16 flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
            </div>
        );
    }

    if (!isAuthenticated || (!user?.roles?.includes('trainer') && !user?.roles?.includes('admin'))) {
        return null;
    }

    return (
        <div className="min-h-screen page-container logo-watermark">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Trainer <span className="text-gradient">Dashboard</span>
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400">
                        Manage your classes and log workouts
                    </p>
                </div>

                {/* Program Builder CTA */}
                <div className="mb-12 grid md:grid-cols-2 gap-6">
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-dark-teal/80 to-black border border-turquoise-surf/30 p-10 shadow-[0_0_50px_rgba(0,242,255,0.1)] group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-2 h-2 rounded-full bg-turquoise-surf animate-pulse"></span>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-turquoise-surf">Primary Mission</span>
                            </div>
                            <h2 className="text-4xl font-black mb-3 text-white tracking-tighter uppercase italic">Assign Workout</h2>
                            <p className="text-gray-400 mb-8 max-w-md font-medium leading-relaxed">
                                Design a tactical workout session and deploy it to your class or specific client roster.
                            </p>
                            <Link
                                href="/workouts/assign"
                                className="inline-flex items-center gap-3 rounded-2xl bg-white text-black px-8 py-4 font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
                            >
                                🚀 Launch Wizard
                            </Link>
                        </div>
                        <div className="absolute -right-12 -bottom-12 text-9xl opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700 pointer-events-none group-hover:scale-110">
                            📋
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 p-10 shadow-2xl group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Asset Management</span>
                            </div>
                            <h2 className="text-4xl font-black mb-3 text-white tracking-tighter uppercase italic">Workout Library</h2>
                            <p className="text-gray-500 mb-8 max-w-md font-medium leading-relaxed">
                                Curate and manage your tactical movement database. Build reusable templates for rapid deployment.
                            </p>
                            <div className="flex gap-4">
                                <Link
                                    href="/workouts/templates"
                                    className="inline-flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 text-white px-8 py-4 font-black uppercase tracking-widest text-xs transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-xl"
                                >
                                    Manage Templates
                                </Link>
                            </div>
                        </div>
                        <div className="absolute -right-12 -bottom-12 text-9xl opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-700 pointer-events-none group-hover:scale-110">
                            💪
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-12 flex flex-wrap gap-4">
                    <Link
                        href="/trainer/clients"
                        className="btn-primary active:scale-95 transition-all"
                    >
                        👥 My Clients
                    </Link>
                    <Link
                        href="/trainer/calendar"
                        className="btn-secondary active:scale-95 transition-all"
                    >
                        📅 View Full Calendar
                    </Link>
                    <Link
                        href="/trainer/availability"
                        className="btn-secondary"
                    >
                        🕒 Manage Availability
                    </Link>
                    <Link
                        href="/trainer/reports"
                        className="btn-secondary"
                    >
                        📊 Attendance Reports
                    </Link>
                    <Link
                        href="/trainer/analytics"
                        className="btn-secondary"
                    >
                        📈 Trainer Analytics
                    </Link>
                    <Link
                        href="/workouts/templates"
                        className="btn-secondary"
                    >
                        💪 Workout Templates
                    </Link>
                    <Link
                        href="/workouts/assign"
                        className="btn-secondary"
                    >
                        📋 Assign Workouts
                    </Link>
                    <Link
                        href="/trainer/programs"
                        className="btn-secondary"
                    >
                        🗓️ Workout Programs
                    </Link>
                    <Link
                        href="/support"
                        className="px-6 py-2 bg-pacific-cyan/10 border border-pacific-cyan/30 text-pacific-cyan hover:bg-pacific-cyan hover:text-black rounded-lg transition-all text-sm font-bold flex items-center gap-2"
                    >
                        🚀 Feedback & Support
                    </Link>
                </div>

                {/* Today's Sessions */}
                <div className="glass-card mb-12">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-turquoise-surf"></span>
                            Today's Sessions
                        </h2>
                        <Link
                            href="/workouts/history"
                            className="text-turquoise-surf hover:underline text-sm font-bold uppercase tracking-wider"
                        >
                            View All History →
                        </Link>
                    </div>

                    {loadingSessions ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 h-32">
                                    <Skeleton className="h-6 w-3/4 mb-3" />
                                    <Skeleton className="h-4 w-1/2 mb-6" />
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-1/4" />
                                        <Skeleton className="h-8 w-1/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : todaysSessions.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">No sessions scheduled for today.</p>
                            <Link
                                href="/workouts/assign"
                                className="text-turquoise-surf hover:underline font-bold"
                            >
                                Create a new session →
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {todaysSessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="bg-gradient-to-br from-dark-teal/20 to-pacific-cyan/10 border border-pacific-cyan/20 rounded-lg p-4"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-lg truncate">{session.class_name || 'Workout Session'}</h4>
                                            <p className="text-sm text-gray-500 truncate">{session.workout_type_name}</p>
                                        </div>
                                        {session.start_time && (
                                            <span className="text-sm text-turquoise-surf font-bold shrink-0 ml-2">
                                                {formatTime12Hour(session.start_time)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">
                                            {session.participant_count || 0} participants
                                        </span>
                                        <Link
                                            href={`/trainer/class/${session.id}/log`}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-bold text-white transition-colors"
                                        >
                                            📝 Log
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Recent Sessions */}
                    {recentSessions.length > 0 && todaysSessions.length === 0 && (
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <h3 className="font-bold text-gray-500 uppercase text-xs tracking-widest mb-4">Recent Sessions</h3>
                            <div className="space-y-2">
                                {recentSessions.map((session) => (
                                    <div
                                        key={session.id}
                                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-all"
                                    >
                                        <div className="min-w-0">
                                            <span className="font-bold truncate inline-block max-w-[150px] md:max-w-none">{session.class_name || 'Session'}</span>
                                            <span className="text-gray-500 text-sm ml-2">
                                                {new Date(session.session_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <Link
                                            href={`/trainer/class/${session.id}/log`}
                                            className="text-turquoise-surf hover:underline font-bold text-sm shrink-0 ml-4"
                                        >
                                            View/Edit
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Classes Section */}
                <div className="glass-card mb-12">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-cerulean"></span>
                        My Weekly Schedule
                    </h2>


                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 h-48">
                                    <div className="flex justify-between mb-4">
                                        <Skeleton className="h-6 w-1/2" />
                                        <Skeleton className="h-4 w-1/4" />
                                    </div>
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-full mb-6" />
                                    <div className="flex justify-between items-center">
                                        <Skeleton className="h-4 w-1/3" />
                                        <Skeleton className="h-9 w-1/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : classes.length === 0 ? (
                        <div className="bg-white/5 rounded-2xl p-12 text-center border border-dashed border-white/10">
                            <p className="text-gray-500 text-lg">No classes assigned to you yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {classesByDay.filter(d => d.classes.length > 0).map(({ day, dayIndex, classes: dayClasses }) => (
                                <div key={day}>
                                    <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2 inline-block pr-8 uppercase tracking-wider">{day}</h3>
                                    <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
                                        {dayClasses.map((classItem) => (
                                            <div
                                                key={`${classItem.id}-${day}`}
                                                className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 hover:border-turquoise-surf/30 transition-all group"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-lg md:text-xl truncate group-hover:text-turquoise-surf transition-colors">{classItem.name}</h4>
                                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 truncate">{classItem.category}</p>
                                                    </div>
                                                    <span className="text-xs md:text-sm font-bold text-turquoise-surf bg-turquoise-surf/10 px-2 py-1 rounded-md shrink-0 ml-2">
                                                        {formatTime12Hour(classItem.start_time)}
                                                    </span>
                                                </div>

                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">
                                                    {classItem.description}
                                                </p>

                                                <div className="flex items-center justify-between gap-3">
                                                    <button
                                                        onClick={() => handleViewAttendees(classItem, dayIndex)}
                                                        className="btn-secondary py-1.5 px-3 md:py-2 md:px-4 text-[10px] md:text-xs flex-1"
                                                    >
                                                        Attendees
                                                    </button>
                                                    <Link
                                                        href={`/workouts/assign?classId=${classItem.id}&date=${new Date(new Date().setDate(new Date().getDate() + (dayIndex - new Date().getDay()))).toISOString().split('T')[0]}`}
                                                        className="btn-primary py-1.5 px-3 md:py-2 md:px-4 text-[10px] md:text-xs flex-1 text-center"
                                                    >
                                                        📝 Log
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Attendees Modal */}
                {selectedClass && (
                    <div className="modal-overlay">
                        <div className="glass rounded-2xl shadow-2xl max-w-2xl w-full border border-white/10 overflow-hidden max-h-[80vh] flex flex-col relative">
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-cerulean to-pacific-cyan px-6 py-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{selectedClass.name}</h2>
                                        <p className="text-white/80 text-sm font-medium uppercase tracking-wider mt-1">
                                            {formatTime12Hour(selectedClass.start_time)} • {selectedClass.duration_minutes} min
                                        </p>
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        className="text-white/80 hover:text-white text-3xl leading-none"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-8 overflow-y-auto flex-1">
                                {loadingAttendees ? (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-turquoise-surf"></div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Attendee Count */}
                                        <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                                            <div>
                                                <div className="text-4xl font-bold text-turquoise-surf">
                                                    {selectedClass.attendee_count || 0}
                                                </div>
                                                <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
                                                    Spots Filled
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-gray-400">
                                                    {selectedClass.max_capacity}
                                                </div>
                                                <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                                                    Capacity
                                                </div>
                                            </div>
                                        </div>

                                        {/* Attendee List */}
                                        <h3 className="font-bold text-lg mb-4 uppercase tracking-tight">Registered Attendees</h3>

                                        {!selectedClass.attendees || selectedClass.attendees.length === 0 ? (
                                            <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
                                                <p className="text-gray-500">No one has signed up for this class yet.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {selectedClass.attendees.map((attendee) => (
                                                    <div
                                                        key={attendee.booking_id}
                                                        className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pacific-cyan to-cerulean flex items-center justify-center text-white font-bold shadow-lg shadow-pacific-cyan/20">
                                                                {attendee.first_name?.[0]}{attendee.last_name?.[0]}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-foreground">
                                                                    {attendee.first_name} {attendee.last_name}
                                                                </p>
                                                                <p className="text-xs text-gray-500 font-medium">
                                                                    {attendee.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                                            <p>Booked</p>
                                                            <p className="text-foreground mt-0.5">{new Date(attendee.booking_date).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="px-8 py-6 border-t border-white/10 bg-white/5">
                                <button
                                    onClick={closeModal}
                                    className="btn-secondary w-full py-4"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}