'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import Link from 'next/link';

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

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Helper functions for time conversion
function convertTo12Hour(time24: string): { hour: string, minute: string, period: 'am' | 'pm' } {
    const [hourStr, minuteStr] = time24.split(':');
    let hour = parseInt(hourStr);
    const period: 'am' | 'pm' = hour >= 12 ? 'pm' : 'am';

    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;

    return {
        hour: hour.toString(),
        minute: minuteStr || '00',
        period
    };
}

function formatTime12Hour(time24: string): string {
    const { hour, minute, period } = convertTo12Hour(time24);
    return hour + ':' + minute + ' ' + period;
}

export default function ClassesPage() {
    const { user, isAuthenticated, refreshUser } = useAuth();
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingClass, setBookingClass] = useState<string | null>(null);
    const [attendeeCount, setAttendeeCount] = useState<number>(1);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedDay, setSelectedDay] = useState<number>(-1);
    const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchClasses();
    }, []);

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

    const handleBookClass = async (classId: string) => {
        if (!isAuthenticated) {
            window.location.href = `/login?redirect=/classes`;
            return;
        }

        if (!user || user.credits < attendeeCount) {
            setError(`You need at least ${attendeeCount} tokens to book this class.`);
            return;
        }

        setBookingClass(classId);
        setError('');
        setSuccess('');

        try {
            const response = await (apiClient as any).request('/bookings', {
                method: 'POST',
                body: JSON.stringify({
                    class_id: classId,
                    target_date: targetDate,
                    attendee_count: attendeeCount
                })
            });

            if (response.error) {
                throw new Error(response.error);
            }

            setSuccess(`Class booked successfully for ${targetDate} (${attendeeCount} ${attendeeCount === 1 ? 'person' : 'people'})!`);
            await refreshUser();
            setAttendeeCount(1);
        } catch (error: any) {
            setError(error.message || 'Failed to book class');
        } finally {
            setBookingClass(null);
        }
    };

    const filteredClasses = classes.filter(c => {
        if (selectedDay === -1) return true;
        const days = c.days_of_week && c.days_of_week.length > 0 ? c.days_of_week : [c.day_of_week];
        return days.includes(selectedDay);
    }).sort((a, b) => a.start_time.localeCompare(b.start_time));

    const getDayBadge = (dayIndex: number) => {
        const colors = [
            'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/20', // Sun
            'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/20', // Mon
            'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/20', // Tue
            'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/20', // Wed
            'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/20', // Thu
            'bg-pink-500/20 text-pink-600 dark:text-pink-400 border-pink-500/20', // Fri
            'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/20', // Sat
        ];
        return (
            <span key={dayIndex} className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${colors[dayIndex]}`}>
                {DAYS[dayIndex].substring(0, 3)}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
            </div>
        );
    }

    return (
        <div className="logo-watermark page-container">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Class <span className="text-gradient">Schedule</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">Find your next workout. Filter by day or browse all.</p>
                </div>

                {/* Credits Display */}
                {isAuthenticated && (
                    <div className="glass-card mb-12 flex flex-wrap items-center justify-between gap-6 border-turquoise-surf/20 bg-gradient-to-r from-turquoise-surf/5 to-transparent">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-turquoise-surf to-pacific-cyan flex items-center justify-center shadow-lg shadow-turquoise-surf/20">
                                <span className="text-3xl font-bold text-white">{user?.credits || 0}</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-foreground uppercase tracking-tight">Available Tokens</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Ready to book your next session</p>
                            </div>
                        </div>
                        <Link href="/packages" className="btn-primary py-3 px-8">
                            Get More Tokens
                        </Link>
                    </div>
                )}

                {/* Day & Date Selection Grid */}
                <div className="flex flex-col lg:flex-row gap-6 mb-12">
                    <div className="flex-1">
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Filter by Day</label>
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                            <button
                                onClick={() => setSelectedDay(-1)}
                                className={`py-3 rounded-xl font-bold transition-all text-xs uppercase tracking-widest border ${selectedDay === -1
                                    ? 'bg-turquoise-surf text-black border-turquoise-surf shadow-lg shadow-turquoise-surf/20'
                                    : 'bg-gray-100 dark:bg-white/5 text-gray-500 border-gray-200 dark:border-white/5 hover:border-turquoise-surf/50 dark:hover:border-white/20 hover:text-gray-900 dark:hover:text-gray-300'
                                    }`}
                            >
                                All
                            </button>
                            {DAYS.map((day, index) => (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDay(index)}
                                    className={`py-3 rounded-xl font-bold transition-all text-xs uppercase tracking-widest border ${selectedDay === index
                                        ? 'bg-turquoise-surf text-black border-turquoise-surf shadow-lg shadow-turquoise-surf/20'
                                        : 'bg-gray-100 dark:bg-white/5 text-gray-500 border-gray-200 dark:border-white/5 hover:border-turquoise-surf/50 dark:hover:border-white/20 hover:text-gray-900 dark:hover:text-gray-300'
                                        }`}
                                >
                                    {day.substring(0, 3)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-72">
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Pick Booking Date</label>
                        <input 
                            type="date"
                            value={targetDate}
                            onChange={(e) => {
                                const newDate = e.target.value;
                                setTargetDate(newDate);
                                if (newDate) {
                                    const dateObj = new Date(newDate + 'T00:00:00');
                                    setSelectedDay(dateObj.getDay());
                                }
                            }}
                            min={new Date().toISOString().split('T')[0]}
                            className="input-field py-3 font-bold text-turquoise-surf"
                        />
                    </div>
                </div>

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

                {/* Classes List */}
                <div className="space-y-4 pb-20">
                    {filteredClasses.length === 0 ? (
                        <div className="bg-gray-100 dark:bg-white/5 rounded-2xl p-20 text-center border border-dashed border-gray-300 dark:border-white/10">
                            <div className="text-5xl mb-4 opacity-20">📅</div>
                            <p className="text-gray-500 text-xl font-medium">No classes found for this day.</p>
                            <button onClick={() => setSelectedDay(-1)} className="mt-4 text-turquoise-surf hover:underline font-bold uppercase tracking-widest text-xs">
                                View all days
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {filteredClasses.map((classItem) => {
                                const days = classItem.days_of_week && classItem.days_of_week.length > 0 ? classItem.days_of_week : [classItem.day_of_week];
                                return (
                                    <div
                                        key={classItem.id}
                                        className="glass-card group hover:border-turquoise-surf/30 transition-all duration-300 flex flex-col lg:flex-row gap-6 p-6 lg:items-center"
                                    >
                                        {/* Time & Day Column */}
                                        <div className="flex-shrink-0 lg:w-48">
                                            <div className="text-3xl font-bold text-foreground mb-2 tabular-nums">
                                                {formatTime12Hour(classItem.start_time)}
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {days.map(d => getDayBadge(d))}
                                            </div>
                                        </div>

                                        {/* Content Column */}
                                        <div className="flex-grow">
                                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                                <h3 className="text-2xl font-bold text-foreground group-hover:text-turquoise-surf transition-colors">
                                                    {classItem.name}
                                                </h3>
                                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded border border-gray-200 dark:border-white/5">
                                                    {classItem.category}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 max-w-2xl">
                                                {classItem.description}
                                            </p>
                                            <div className="mt-4 flex items-center gap-4 text-xs font-bold text-gray-600 dark:text-gray-500 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5 text-turquoise-surf/80">
                                                    👤 {classItem.instructor_name}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    ⏱️ {classItem.duration_minutes}m
                                                </span>
                                                <span className="flex items-center gap-1.5 text-green-500/80">
                                                    ⚡ 1 Token
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Column */}
                                        <div className="flex-shrink-0 lg:w-64 space-y-4">
                                            <div className="flex items-center justify-between bg-gray-100 dark:bg-black/40 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/5">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Spots</span>
                                                <div className="flex items-center gap-3">
                                                    <button 
                                                        onClick={() => setAttendeeCount(Math.max(1, attendeeCount - 1))}
                                                        className="text-gray-500 dark:text-gray-400 hover:text-foreground transition-colors text-xl font-bold"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-lg font-bold text-foreground w-4 text-center">{attendeeCount}</span>
                                                    <button 
                                                        onClick={() => setAttendeeCount(Math.min(5, attendeeCount + 1))}
                                                        className="text-gray-500 dark:text-gray-400 hover:text-foreground transition-colors text-xl font-bold"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleBookClass(classItem.id)}
                                                disabled={bookingClass === classItem.id || (isAuthenticated && (!user || user.credits < attendeeCount))}
                                                className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest transition-all ${
                                                    isAuthenticated 
                                                        ? 'bg-turquoise-surf text-black hover:bg-pacific-cyan hover:scale-[1.02] shadow-lg shadow-turquoise-surf/10'
                                                        : 'bg-gray-200 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-white/5 hover:border-turquoise-surf/30 hover:text-turquoise-surf'
                                                }`}
                                            >
                                                {bookingClass === classItem.id 
                                                    ? 'Processing...' 
                                                    : isAuthenticated 
                                                        ? (user && user.credits < attendeeCount ? 'Insufficient Tokens' : `Book for ${attendeeCount}`) 
                                                        : 'Login to Book'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}