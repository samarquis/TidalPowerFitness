'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

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

function formatTime(time24: string): string {
    const [hourStr, minuteStr] = time24.split(':');
    let hour = parseInt(hourStr);
    const period = hour >= 12 ? 'PM' : 'AM';
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
    return `${hour}:${minuteStr || '00'} ${period}`;
}

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

    const fetchAttendees = async (classId: string) => {
        setLoadingAttendees(true);
        try {
            const response = await apiClient.getClassAttendees(classId);
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

    const handleViewAttendees = (classItem: Class) => {
        setSelectedClass({ ...classItem, attendees: undefined });
        fetchAttendees(classItem.id);
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
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-4"></div>
            </div>
        );
    }

    if (!isAuthenticated || (!user?.roles?.includes('trainer') && !user?.roles?.includes('admin'))) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Trainer <span className="text-gradient">Dashboard</span>
                    </h1>
                    <p className="text-xl text-gray-300">
                        Manage your classes and log workouts
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="mb-8 flex flex-wrap gap-4">
                    <Link
                        href="/trainer/clients"
                        className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 rounded-lg font-semibold transition-colors"
                    >
                        👥 My Clients
                    </Link>
                    <Link
                        href="/trainer/availability"
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
                    >
                        📅 Manage Availability
                    </Link>
                    <Link
                        href="/workouts/templates"
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
                    >
                        💪 Workout Templates
                    </Link>
                    <Link
                        href="/workouts/assign"
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
                    >
                        📋 Assign Workouts
                    </Link>
                </div>

                {/* Today's Sessions */}
                <div className="glass rounded-xl p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Today's Sessions</h2>
                        <Link
                            href="/workouts/history"
                            className="text-teal-400 hover:underline text-sm"
                        >
                            View All Sessions →
                        </Link>
                    </div>

                    {loadingSessions ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-400"></div>
                        </div>
                    ) : todaysSessions.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-400 mb-4">No sessions scheduled for today.</p>
                            <Link
                                href="/workouts/assign"
                                className="text-teal-400 hover:underline"
                            >
                                Create a new session →
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {todaysSessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="bg-gradient-to-br from-teal-900/30 to-teal-800/20 border border-teal-500/30 rounded-lg p-4"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-bold text-lg">{session.class_name || 'Workout Session'}</h4>
                                            <p className="text-sm text-gray-400">{session.workout_type_name}</p>
                                        </div>
                                        {session.start_time && (
                                            <span className="text-sm text-teal-400">
                                                {formatTime(session.start_time)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-400">
                                            {session.participant_count || 0} participants
                                        </span>
                                        <Link
                                            href={`/trainer/class/${session.id}/log`}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold transition-colors"
                                        >
                                            📝 Start Logging
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Recent Sessions */}
                    {recentSessions.length > 0 && todaysSessions.length === 0 && (
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <h3 className="font-semibold text-gray-400 mb-4">Recent Sessions</h3>
                            <div className="space-y-2">
                                {recentSessions.map((session) => (
                                    <div
                                        key={session.id}
                                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                                    >
                                        <div>
                                            <span className="font-medium">{session.class_name || 'Session'}</span>
                                            <span className="text-gray-400 text-sm ml-2">
                                                {new Date(session.session_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <Link
                                            href={`/trainer/class/${session.id}/log`}
                                            className="text-teal-400 hover:underline text-sm"
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
                <div className="glass rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-6">My Classes</h2>


                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-400"></div>
                        </div>
                    ) : classes.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">
                            No classes assigned to you yet.
                        </p>
                    ) : (
                        <div className="space-y-6">
                            {classesByDay.filter(d => d.classes.length > 0).map(({ day, classes: dayClasses }) => (
                                <div key={day}>
                                    <h3 className="text-lg font-semibold text-teal-400 mb-3">{day}</h3>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {dayClasses.map((classItem) => (
                                            <div
                                                key={`${classItem.id}-${day}`}
                                                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h4 className="font-bold text-lg">{classItem.name}</h4>
                                                        <p className="text-sm text-gray-400">{classItem.category}</p>
                                                    </div>
                                                    <span className="text-sm text-teal-400">
                                                        {formatTime(classItem.start_time)}
                                                    </span>
                                                </div>

                                                <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                                                    {classItem.description}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-400">
                                                        {classItem.duration_minutes} min • Max {classItem.max_capacity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleViewAttendees(classItem)}
                                                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-sm font-semibold transition-colors"
                                                    >
                                                        View Attendees
                                                    </button>
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full border border-white/10 overflow-hidden max-h-[80vh] flex flex-col">
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{selectedClass.name}</h2>
                                        <p className="text-teal-100 text-sm">
                                            {formatTime(selectedClass.start_time)} • {selectedClass.duration_minutes} min
                                        </p>
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        className="text-white/80 hover:text-white text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto flex-1">
                                {loadingAttendees ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-400"></div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Attendee Count */}
                                        <div className="mb-6 p-4 bg-white/5 rounded-lg">
                                            <div className="text-3xl font-bold text-teal-400">
                                                {selectedClass.attendee_count || 0}
                                            </div>
                                            <div className="text-gray-400 text-sm">
                                                / {selectedClass.max_capacity} spots filled
                                            </div>
                                        </div>

                                        {/* Attendee List */}
                                        <h3 className="font-bold mb-4">Registered Attendees</h3>

                                        {!selectedClass.attendees || selectedClass.attendees.length === 0 ? (
                                            <p className="text-gray-400 text-center py-6">
                                                No one has signed up for this class yet.
                                            </p>
                                        ) : (
                                            <div className="space-y-3">
                                                {selectedClass.attendees.map((attendee) => (
                                                    <div
                                                        key={attendee.booking_id}
                                                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold">
                                                                {attendee.first_name?.[0]}{attendee.last_name?.[0]}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold">
                                                                    {attendee.first_name} {attendee.last_name}
                                                                </p>
                                                                <p className="text-sm text-gray-400">
                                                                    {attendee.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right text-sm text-gray-400">
                                                            <p>Booked</p>
                                                            <p>{new Date(attendee.booking_date).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-white/10">
                                <button
                                    onClick={closeModal}
                                    className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
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
