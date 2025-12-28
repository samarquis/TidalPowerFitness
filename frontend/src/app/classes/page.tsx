'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

interface Class {
    id: string;
    name: string;
    description: string;
    category: string;
    instructor_name: string;
    day_of_week: number;
    days_of_week?: number[];
    start_time: string;
    duration_minutes: number;
    max_capacity: number;
    price_cents: number;
}

interface UserCredits {
    total: number;
    details: Array<{
        id: string;
        remaining_credits: number;
        expires_at: string | null;
    }>;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ClassesPage() {
    const { user, isAuthenticated } = useAuth();
    const [classes, setClasses] = useState<Class[]>([]);
    const [credits, setCredits] = useState<UserCredits | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingClass, setBookingClass] = useState<string | null>(null);
    const [attendeeCount, setAttendeeCount] = useState<number>(1);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());

    useEffect(() => {
        fetchClasses();
        if (isAuthenticated && user) {
            fetchUserCredits();
        }
    }, [isAuthenticated, user]);

    const fetchClasses = async () => {
        try {
            const { data, error } = await apiClient.getClasses();
            if (error) throw new Error(error);
            if (Array.isArray(data)) {
                setClasses(data);
            }
        } catch (error: any) {
            console.error('Error fetching classes:', error);
            setError('Failed to load classes');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserCredits = async () => {
        if (!user) return;

        try {
            const { data, error } = await apiClient.getUserCredits(user.id);

            if (error) {
                console.error('Error fetching credits:', error);
                return;
            }

            if (data) {
                // Handle new standardized response { credits: number, details: UserCredit[] }
                if (data.details && Array.isArray(data.details)) {
                    setCredits({ total: data.credits || 0, details: data.details });
                }
                // Fallback for legacy array response (just in case)
                else if (Array.isArray(data)) {
                    const total = data.reduce((sum: number, c: any) => sum + c.remaining_credits, 0);
                    setCredits({ total, details: data });
                }
                // Handle new response with just total if details missing
                else if (data.credits !== undefined) {
                    setCredits({ total: data.credits, details: [] });
                }
            }
        } catch (error) {
            console.error('Error calculating credits:', error);
        }
    };

    const handleBookClass = async (classId: string) => {
        if (!isAuthenticated) {
            window.location.href = `/login?redirect=/classes`;
            return;
        }

        if (!credits || credits.total < attendeeCount) {
            setError(`You need at least ${attendeeCount} credits to book this class. Please purchase more packages.`);
            return;
        }

        setBookingClass(classId);
        setError('');
        setSuccess('');

        // Optimistic update for credits
        const previousCredits = credits ? { ...credits } : null;
        if (credits) {
            setCredits({
                ...credits,
                total: credits.total - attendeeCount
            });
        }

        try {
            // Calculate target date (next upcoming instance of this class)
            const classItem = classes.find(c => c.id === classId);
            let targetDateStr = undefined;

            if (classItem) {
                const today = new Date();
                const currentDay = today.getDay();
                const classDay = classItem.day_of_week;

                let daysUntil = classDay - currentDay;
                if (daysUntil < 0) daysUntil += 7; 

                const targetDate = new Date(today);
                targetDate.setDate(today.getDate() + daysUntil);
                targetDateStr = targetDate.toISOString().split('T')[0];
            }

            const response = await (apiClient as any).request('/bookings', {
                method: 'POST',
                body: JSON.stringify({
                    class_id: classId,
                    target_date: targetDateStr,
                    attendee_count: attendeeCount
                })
            });

            if (response.error) {
                throw new Error(response.error);
            }

            setSuccess(`Class booked successfully for ${attendeeCount} people! ${attendeeCount} ${attendeeCount === 1 ? 'credit has' : 'credits have'} been deducted.`);
            fetchUserCredits(); // Refresh credits from server to be sure
            setAttendeeCount(1); // Reset for next time
        } catch (error: any) {
            // Revert credits on error
            setCredits(previousCredits);
            setError(error.message || 'Failed to book class');
        } finally {
            setBookingClass(null);
        }
    };

    // Group classes by day
    const filteredDays = DAYS.map((day, index) => ({ day, index })).filter(({ index }) => selectedDay === -1 || index === selectedDay);

    const classesByDay = filteredDays.map(({ day, index }) => ({
        day,
        classes: classes.filter(c => {
            // Check if class is scheduled for this day (supporting both legacy and new array format)
            if (c.days_of_week && c.days_of_week.length > 0) {
                return c.days_of_week.includes(index);
            }
            return c.day_of_week === index;
        })
    }));

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black page-container">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Class <span className="text-gradient">Schedule</span>
                    </h1>
                    <p className="text-gray-400 text-lg">Browse and book classes using your credits</p>
                </div>

                {/* Credits Display */}
                {isAuthenticated && (
                    <div className="glass-card mb-12">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <h2 className="text-xl font-semibold text-white mb-2">Available Tokens</h2>
                                <div className="text-5xl font-bold text-teal-400">
                                    {credits?.total || 0}
                                    <span className="text-lg text-gray-500 ml-2 font-normal">
                                        {credits?.total === 1 ? 'Token' : 'Tokens'}
                                    </span>
                                </div>
                            </div>
                            <div className="w-full md:w-auto">
                                <a
                                    href="/packages"
                                    className="block text-center btn-primary w-full md:w-auto"
                                >
                                    Purchase Tokens
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error/Success Messages */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl mb-8 animate-shake">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-6 py-4 rounded-xl mb-8">
                        {success}
                    </div>
                )}

                {/* Day Selection Tabs - Sticky on Mobile */}
                <div className="sticky top-20 z-10 bg-black/80 backdrop-blur-md py-4 mb-8 -mx-4 px-4 border-b border-white/5 md:relative md:top-0 md:bg-transparent md:backdrop-blur-none md:border-none md:px-0">
                    <div className="flex overflow-x-auto gap-2 no-scrollbar">
                        <button
                            onClick={() => setSelectedDay(-1)}
                            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all text-sm md:text-base ${selectedDay === -1
                                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            All Days
                        </button>
                        {DAYS.map((day, index) => (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(index)}
                                className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all text-sm md:text-base ${selectedDay === index
                                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Classes by Day */}
                <div className="space-y-12 md:space-y-16">
                    {classesByDay.map(({ day, classes: dayClasses }) => (
                        <div key={day} className="scroll-mt-36 md:scroll-mt-24">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 border-b border-white/10 pb-4 inline-block pr-12">
                                {day}
                            </h2>
                            {dayClasses.length === 0 ? (
                                <div className="bg-white/5 rounded-xl p-8 text-center text-gray-500 border border-dashed border-white/10">
                                    No classes scheduled for {day}
                                </div>
                            ) : (
                                <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {dayClasses.map((classItem) => (
                                        <div
                                            key={classItem.id}
                                            className="glass-card group overflow-hidden relative"
                                        >
                                            <div className="absolute top-0 right-0 p-3 md:p-4">
                                                <span className="bg-teal-500/10 text-teal-400 text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full border border-teal-500/20">
                                                    {classItem.category || 'Fitness'}
                                                </span>
                                            </div>

                                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 pt-4">
                                                {classItem.name}
                                            </h3>
                                            <p className="text-gray-400 text-xs md:text-sm mb-4 md:mb-6 line-clamp-2 min-h-[2.5rem]">
                                                {classItem.description}
                                            </p>

                                            <div className="grid grid-cols-2 gap-3 md:block md:space-y-4 mb-6 md:mb-8">
                                                <div className="flex items-center text-gray-300">
                                                    <div className="hidden md:flex w-10 h-10 rounded-lg bg-white/5 items-center justify-center mr-3 group-hover:bg-teal-500/10 transition-colors">
                                                        <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-gray-500 uppercase font-bold md:mb-0.5">Time</div>
                                                        <div className="text-xs md:text-sm">{classItem.start_time.slice(0, 5)} <span className="text-gray-500">•</span> {classItem.duration_minutes}m</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center text-gray-300">
                                                    <div className="hidden md:flex w-10 h-10 rounded-lg bg-white/5 items-center justify-center mr-3 group-hover:bg-teal-500/10 transition-colors">
                                                        <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-gray-500 uppercase font-bold md:mb-0.5">Instructor</div>
                                                        <div className="text-xs md:text-sm truncate max-w-[120px] md:max-w-none">{classItem.instructor_name}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-4 flex items-center justify-between bg-white/5 p-2 md:p-3 rounded-lg border border-white/5">
                                                <span className="text-xs md:text-sm font-semibold text-gray-300">Attendees</span>
                                                <div className="flex items-center gap-2 md:gap-3">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setAttendeeCount(Math.max(1, attendeeCount - 1)) }}
                                                        className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-base md:text-lg font-bold text-teal-400 w-4 text-center">{attendeeCount}</span>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setAttendeeCount(Math.min(5, attendeeCount + 1)) }}
                                                        className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleBookClass(classItem.id)}
                                                disabled={bookingClass === classItem.id || !isAuthenticated}
                                                className={`w-full ${isAuthenticated
                                                    ? 'btn-primary'
                                                    : 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed py-3 rounded-xl'
                                                    }`}
                                            >
                                                {bookingClass === classItem.id ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    isAuthenticated ? `Book for ${attendeeCount}` : 'Login to Book'
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
