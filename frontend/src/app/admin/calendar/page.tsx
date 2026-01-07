'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminMonthCalendar from '@/components/AdminMonthCalendar';
import Link from 'next/link';
import { formatTime12Hour } from "@/lib/utils";

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
    is_published?: boolean;
}

export default function AdminCalendarPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [classes, setClasses] = useState<Class[]>([]);
    const [sessions, setSessions] = useState<WorkoutSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    // Modal states
    // Modal states
    const [selectedClassInstance, setSelectedClassInstance] = useState<{ classItem: Class, date: Date } | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        if (isAuthenticated && !user?.roles?.includes('admin')) {
            router.push('/');
            return;
        }

        // Set start date to today
        setCurrentDate(new Date());

        if (isAuthenticated) {
            fetchClasses();
        }
    }, [isAuthenticated, user, router]);

    useEffect(() => {
        if (isAuthenticated && currentDate) {
            fetchSessions();
        }
    }, [isAuthenticated, currentDate]);

    const fetchClasses = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

            const response = await fetch(`${apiUrl}/classes`, {
                credentials: 'include'
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

            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0); // Last day of month

            const response = await fetch(`${apiUrl}/workout-sessions?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setSessions(data);
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
        }
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const handleAddClass = (date: Date) => {
        // Format date as YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        // Redirect to add class page with pre-filled date (assuming we'll implement this param handling in Add Class page later)
        // For now just go to classes page, or ideally /admin/classes/new if that existed.
        // The requirement was "Interface for trainers to add classes to specific days".
        // Let's assume we can pass a query param to the classes management page or a new class wizard.
        // Since /admin/classes is the management list, let's assume we want to open a "New Class" modal or page.
        // For now, let's redirect to /admin/classes with a query param that could trigger a "New Class" mode if implemented,
        // or just to the list.
        // BETTER: The prompt implies a direct action. Let's assume we might want to create a new class instance.
        // But classes are recurring definitions usually.
        // If "Add Class" means "Schedule a Class Instance", that's what we do by defining days_of_week.
        // If it means "Create a new Class Definition that happens on this day", we can pass the day.

        // Let's redirect to /admin/classes?action=new&day=${dayOfWeek}
        const dayOfWeek = date.getDay();
        router.push(`/admin/classes?action=new&day=${dayOfWeek}`);
    };

    const handleClassClick = (classItem: Class, date?: Date) => {
        if (date) {
            setSelectedClassInstance({ classItem, date });
            setShowDetailsModal(true);
        }
    };

    const handleAssignWorkout = () => {
        if (!selectedClassInstance) return;

        const { classItem, date } = selectedClassInstance;

        // Format date as YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        router.push(`/workouts/assign?date=${dateStr}&class_id=${classItem.id}`);
    };

    const handlePublishSession = async () => {
        if (!currentSession) return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/workout-sessions/${currentSession.id}/publish`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                // Refresh sessions and update modal
                fetchSessions();
                // Don't close modal, just refresh state? 
                // We need to re-find currentSession, which depends on 'sessions' state.
                // fetchSessions will update 'sessions', causing 'currentSession' to re-calc on next render.
            } else {
                console.error('Failed to publish session');
            }
        } catch (error) {
            console.error('Error publishing session:', error);
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
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col gap-6 mb-8">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                            Class <span className="text-gradient">Schedule</span>
                        </h1>
                        <p className="text-gray-400 text-sm md:text-base">Manage weekly schedule and assign workouts</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-center md:justify-between">
                        <div className="flex bg-white/10 rounded-lg p-1 w-full sm:w-auto">
                            <button onClick={handlePrevMonth} className="px-3 md:px-4 py-2 hover:bg-white/10 rounded-md transition-colors text-lg">
                                ←
                            </button>
                            <div className="px-3 md:px-4 py-2 font-semibold border-l border-r border-white/10 min-w-[140px] md:min-w-[150px] text-center text-sm md:text-base">
                                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </div>
                            <button onClick={handleNextMonth} className="px-3 md:px-4 py-2 hover:bg-white/10 rounded-md transition-colors text-lg">
                                →
                            </button>
                        </div>
                        <Link
                            href="/admin/classes"
                            className="w-full sm:w-auto text-center px-4 md:px-6 py-3 bg-gradient-to-r from-turquoise-surf to-pacific-cyan hover:from-pacific-cyan hover:to-turquoise-surf text-black font-bold rounded-lg transition-all text-sm md:text-base"
                        >
                            Manage Classes
                        </Link>
                    </div>
                </div>

                {/* Calendar */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
                        <p className="mt-4 text-gray-400 text-sm md:text-base">Loading schedule...</p>
                    </div>
                ) : (
                    <div className="glass rounded-xl p-3 md:p-6">
                        <AdminMonthCalendar
                            classes={classes}
                            sessions={sessions}
                            currentDate={currentDate}
                            onClassClick={handleClassClick}
                            onAddClassClick={handleAddClass}
                        />
                    </div>
                )}
            </div>

            {/* Class Details Modal */}
            {showDetailsModal && selectedClassInstance && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-xl max-w-md w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex-1 pr-4">
                                <h3 className="text-xl md:text-2xl font-bold text-white break-words">{selectedClassInstance.classItem.name}</h3>
                                <p className="text-turquoise-surf text-sm md:text-base">{selectedClassInstance.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-white text-3xl leading-none flex-shrink-0">×</button>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span className="text-gray-400 text-sm md:text-base">Time</span>
                                <span className="text-white font-medium text-sm md:text-base text-right">{formatTime12Hour(selectedClassInstance.classItem.start_time)} ({selectedClassInstance.classItem.duration_minutes}m)</span>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span className="text-gray-400 text-sm md:text-base">Instructor</span>
                                <span className="text-white font-medium text-sm md:text-base text-right break-words">{selectedClassInstance.classItem.instructor_name}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span className="text-gray-400 text-sm md:text-base">Category</span>
                                <span className="text-white font-medium text-sm md:text-base text-right">{selectedClassInstance.classItem.category}</span>
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

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => router.push(`/admin/classes?edit=${selectedClassInstance.classItem.id}`)}
                                className="flex-1 px-4 py-2.5 md:py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors text-sm md:text-base"
                            >
                                Edit Class
                            </button>
                            {!currentSession && (
                                <button
                                    onClick={handleAssignWorkout}
                                    className="flex-1 px-4 py-2.5 md:py-3 bg-gradient-to-r from-turquoise-surf to-pacific-cyan hover:from-pacific-cyan hover:to-turquoise-surf text-black font-semibold rounded-lg transition-colors text-sm md:text-base"
                                >
                                    Assign Workout
                                </button>
                            )}
                            {currentSession && !currentSession.is_published && (
                                <button
                                    onClick={handlePublishSession}
                                    className="flex-1 px-4 py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-colors text-sm md:text-base"
                                >
                                    Publish Class
                                </button>
                            )}
                            {currentSession && currentSession.is_published && (
                                <div className="flex-1 px-4 py-2.5 md:py-3 bg-green-600/20 border border-green-600 text-green-400 font-semibold rounded-lg text-center text-sm md:text-base cursor-default">
                                    Published
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}
