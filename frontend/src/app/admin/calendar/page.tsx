'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ClassCalendar from '@/components/ClassCalendar';
import WorkoutSelectionModal from '@/components/WorkoutSelectionModal';
import Link from 'next/link';

interface Class {
    id: string;
    name: string;
    description: string;
    category: string;
    instructor_id?: string;
    instructor_name: string;
    day_of_week: number;
    days_of_week?: number[];
    start_time: string;
    duration_minutes: number;
    max_capacity: number;
    price_cents: number;
    is_active: boolean;
    acuity_appointment_type_id?: string;
}

interface WorkoutSession {
    id: string;
    class_id?: string;
    session_date: string;
    workout_type_name?: string;
    trainer_id: string;
}

export default function AdminCalendarPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [classes, setClasses] = useState<Class[]>([]);
    const [sessions, setSessions] = useState<WorkoutSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [weekStartDate, setWeekStartDate] = useState<Date>(new Date());

    // Modal states
    const [selectedClassInstance, setSelectedClassInstance] = useState<{ classItem: Class, date: Date } | null>(null);
    const [showWorkoutModal, setShowWorkoutModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        if (isAuthenticated && !user?.roles?.includes('admin')) {
            router.push('/');
            return;
        }

        // Set start date to the most recent Sunday
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day;
        const sunday = new Date(today.setDate(diff));
        sunday.setHours(0, 0, 0, 0);
        setWeekStartDate(sunday);

        if (isAuthenticated) {
            fetchClasses();
        }
    }, [isAuthenticated, user, router]);

    useEffect(() => {
        if (isAuthenticated && weekStartDate) {
            fetchSessions();
        }
    }, [isAuthenticated, weekStartDate]);

    const fetchClasses = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('auth_token');

            const response = await fetch(`${apiUrl}/classes`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setClasses(data);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSessions = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('auth_token');

            const startDate = new Date(weekStartDate);
            const endDate = new Date(weekStartDate);
            endDate.setDate(endDate.getDate() + 7);

            const response = await fetch(`${apiUrl}/workout-sessions?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSessions(data);
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
        }
    };

    const handlePrevWeek = () => {
        const newDate = new Date(weekStartDate);
        newDate.setDate(newDate.getDate() - 7);
        setWeekStartDate(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(weekStartDate);
        newDate.setDate(newDate.getDate() + 7);
        setWeekStartDate(newDate);
    };

    const handleClassClick = (classItem: Class, date?: Date) => {
        if (date) {
            setSelectedClassInstance({ classItem, date });
            setShowDetailsModal(true);
        }
    };

    const handleAssignWorkout = () => {
        setShowDetailsModal(false);
        setShowWorkoutModal(true);
    };

    const handleWorkoutSelected = async (template: any) => {
        if (!selectedClassInstance) return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('auth_token');

            const { classItem, date } = selectedClassInstance;

            // Format date as YYYY-MM-DD for consistency
            // Note: date is a Date object, we need to be careful with timezones
            // Using toISOString() might shift the day if not careful.
            // Let's use local date components.
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            const response = await fetch(`${apiUrl}/workout-sessions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    class_id: classItem.id,
                    template_id: template.id,
                    session_date: dateStr,
                    start_time: `${dateStr}T${classItem.start_time}:00`,
                    workout_type_id: template.workout_type_id
                })
            });

            if (response.ok) {
                fetchSessions();
                setShowWorkoutModal(false);
                setSelectedClassInstance(null);
            } else {
                alert('Failed to assign workout');
            }
        } catch (error) {
            console.error('Error assigning workout:', error);
            alert('Failed to assign workout');
        }
    };

    if (!isAuthenticated || !user?.roles?.includes('admin')) {
        return null;
    }

    const currentSession = selectedClassInstance ? sessions.find(s =>
        s.class_id === selectedClassInstance.classItem.id &&
        new Date(s.session_date).toDateString() === selectedClassInstance.date.toDateString()
    ) : null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">
                            Class <span className="text-gradient">Schedule</span>
                        </h1>
                        <p className="text-gray-400">Manage weekly schedule and assign workouts</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="flex bg-white/10 rounded-lg p-1">
                            <button onClick={handlePrevWeek} className="px-4 py-2 hover:bg-white/10 rounded-md transition-colors">
                                ←
                            </button>
                            <div className="px-4 py-2 font-semibold border-l border-r border-white/10">
                                {weekStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(new Date(weekStartDate).setDate(weekStartDate.getDate() + 6)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <button onClick={handleNextWeek} className="px-4 py-2 hover:bg-white/10 rounded-md transition-colors">
                                →
                            </button>
                        </div>
                        <Link
                            href="/admin/classes"
                            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-all"
                        >
                            Manage Classes
                        </Link>
                    </div>
                </div>

                {/* Calendar */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-4"></div>
                        <p className="mt-4 text-gray-400">Loading schedule...</p>
                    </div>
                ) : (
                    <div className="glass rounded-xl p-6">
                        <ClassCalendar
                            classes={classes}
                            sessions={sessions}
                            weekStartDate={weekStartDate}
                            onClassClick={handleClassClick}
                        />
                    </div>
                )}
            </div>

            {/* Class Details Modal */}
            {showDetailsModal && selectedClassInstance && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-white">{selectedClassInstance.classItem.name}</h3>
                                <p className="text-teal-400">{selectedClassInstance.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span className="text-gray-400">Time</span>
                                <span className="text-white font-medium">{selectedClassInstance.classItem.start_time} ({selectedClassInstance.classItem.duration_minutes}m)</span>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span className="text-gray-400">Instructor</span>
                                <span className="text-white font-medium">{selectedClassInstance.classItem.instructor_name}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span className="text-gray-400">Category</span>
                                <span className="text-white font-medium">{selectedClassInstance.classItem.category}</span>
                            </div>

                            <div className="pt-2">
                                <span className="text-gray-400 block mb-2">Workout Status</span>
                                {currentSession ? (
                                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
                                        <div className="flex items-center gap-2 text-green-400 font-bold mb-1">
                                            <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                            Assigned
                                        </div>
                                        <div className="text-sm text-gray-300">
                                            {currentSession.workout_type_name || 'Workout'}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 text-yellow-200 text-sm">
                                        No workout assigned yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => router.push(`/admin/classes?edit=${selectedClassInstance.classItem.id}`)}
                                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors"
                            >
                                Edit Class
                            </button>
                            {!currentSession && (
                                <button
                                    onClick={handleAssignWorkout}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-6 to-teal-6 hover:from-teal-700 hover:to-teal-700 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Assign Workout
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Workout Selection Modal */}
            <WorkoutSelectionModal
                isOpen={showWorkoutModal}
                onClose={() => setShowWorkoutModal(false)}
                onSelect={handleWorkoutSelected}
            />
        </div>
    );
}
