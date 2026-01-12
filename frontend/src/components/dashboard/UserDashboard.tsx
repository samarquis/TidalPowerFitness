'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ClassSignupModal from '@/components/ClassSignupModal';
import { formatTime12Hour } from "@/lib/utils";
import Skeleton from '@/components/ui/Skeleton';

interface Class {
    id: string;
    name: string;
    description: string;
    start_time: string;
    duration_minutes: number;
    instructor_name: string;
    category: string;
    day_of_week: number;
    days_of_week?: number[];
}

interface Booking {
    id: string;
    class_id: string;
    class_name: string;
    status: string;
    booking_date: string;
}

interface WorkoutStats {
    total_workouts: number;
    total_sets: number;
    total_volume_lbs: number;
}

interface Achievement {
    id: string;
    name: string;
    description: string;
    earned_at: string;
    icon_url?: string;
}

interface PersonalRecord {
    id: string;
    exercise_name: string;
    record_type: string;
    value: number;
    achieved_at: string;
}

interface ActiveProgram {
    id: string;
    program_name: string;
    current_week: number;
    current_day: number;
    total_weeks: number;
    next_workout?: {
        workout_template_id: string;
        workout_name: string;
        day_number: number;
    };
}

export default function UserDashboard() {
    const { user, refreshUser } = useAuth();
    const searchParams = useSearchParams();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [classes, setClasses] = useState<Class[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [stats, setStats] = useState<WorkoutStats | null>(null);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
    const [activeProgram, setActiveProgram] = useState<ActiveProgram | null>(null);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    useEffect(() => {
        if (searchParams.get('payment') === 'success') {
            setSuccessMessage('Payment successful! Your credits have been updated.');
            const url = new URL(window.location.href);
            url.searchParams.delete('payment');
            window.history.replaceState({}, '', url.pathname);
        }
    }, [searchParams]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [
                classesRes,
                bookingsRes,
                statsRes,
                achievementsRes,
                prRes,
                programRes,
                recRes
            ] = await Promise.all([
                apiClient.getClasses(),
                apiClient.getUserBookings(user!.id),
                apiClient.getClientStats(user!.id),
                apiClient.getUserAchievements(user!.id),
                apiClient.getPersonalRecords(user!.id),
                apiClient.getMyActiveProgram(),
                apiClient.getAIRecommendations()
            ]);

            if (classesRes.data) setClasses(classesRes.data);
            if (bookingsRes.data) {
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                setBookings(bookingsRes.data.filter((b: Booking) => {
                    const bookingDate = new Date(b.booking_date);
                    return b.status === 'confirmed' && bookingDate >= now;
                }));
            }
            if (statsRes.data) setStats(statsRes.data);
            if (achievementsRes.data) setAchievements(achievementsRes.data);
            if (prRes.data) setPersonalRecords(prRes.data);
            if (programRes.data) setActiveProgram(programRes.data);
            if (recRes.data) setRecommendations(recRes.data);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookClass = async (classId: string, attendeeCount: number = 1) => {
        try {
            const targetDateStr = selectedDate.toISOString().split('T')[0];
            const response = await (apiClient as any).request('/bookings', {
                method: 'POST',
                body: JSON.stringify({
                    class_id: classId,
                    target_date: targetDateStr,
                    attendee_count: attendeeCount
                })
            });

            if (response.error) throw new Error(response.error);

            await Promise.all([fetchData(), refreshUser()]);
            setSuccessMessage(`Class booked successfully!`);
            setTimeout(() => setSuccessMessage(''), 5000);
        } catch (error: any) {
            alert(error.message || 'Failed to book class');
        }
    };

    const handleClassClick = (classItem: Class) => {
        setSelectedClass(classItem);
        setShowModal(true);
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const getClassesForDate = (date: Date) => {
        const dayOfWeek = date.getDay();
        return classes.filter(c => {
            const days = c.days_of_week && c.days_of_week.length > 0 ? c.days_of_week : [c.day_of_week];
            return days.includes(dayOfWeek);
        });
    };

    const isClassBooked = (classId: string, date: Date) => {
        return bookings.some(b => 
            b.class_id === classId && 
            new Date(b.booking_date).toDateString() === date.toDateString()
        );
    };

    const handleUpcomingClassClick = (booking: Booking) => {
        const date = new Date(booking.booking_date);
        const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        setCurrentDate(new Date(localDate.getFullYear(), localDate.getMonth(), 1));
        setSelectedDate(localDate);
        const classItem = classes.find(c => c.id === booking.class_id);
        if (classItem) {
            setSelectedClass(classItem);
            setShowModal(true);
        }
    };

    const { days: daysCount, firstDay } = getDaysInMonth(currentDate);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

    const selectedDayClasses = getClassesForDate(selectedDate);

    return (
        <div className="min-h-screen bg-background page-container relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-turquoise-surf/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cerulean/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-7xl font-black mb-4 tracking-tighter uppercase italic">
                            Welcome, <span className="text-gradient">{user?.first_name}</span>
                        </h1>
                        <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs">The Vault is Open • Progress Awaits</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/classes" className="btn-primary px-8 py-4 rounded-2xl shadow-xl shadow-turquoise-surf/20 transition-all hover:scale-105 active:scale-95 font-black uppercase tracking-widest text-xs">
                            Book Session
                        </Link>
                    </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-8 bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-2xl flex items-center justify-between backdrop-blur-md animate-in fade-in slide-in-from-top-4">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="font-bold text-sm uppercase tracking-wider">{successMessage}</span>
                        </div>
                        <button onClick={() => setSuccessMessage('')} className="hover:text-white transition-colors">✕</button>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Core Flow */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Quick Actions (World-Class Refinement) */}
                        <div className="glass-card border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-1">
                            <div className="p-6">
                                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                                    <h2 className="text-xl font-black uppercase tracking-tighter italic text-turquoise-surf">Fast <span className="text-white">Track</span></h2>
                                    <Link href="/programs/my-program" className="text-[10px] font-black text-gray-500 hover:text-turquoise-surf uppercase tracking-[0.2em] transition-all border-b border-transparent hover:border-turquoise-surf pb-1">
                                        Full Program →
                                    </Link>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Classes', icon: '🏫', href: '/classes', color: 'turquoise-surf' },
                                        { label: 'Templates', icon: '📝', href: '/workouts/templates', color: 'cerulean' },
                                        { label: 'History', icon: '📅', href: '/workouts/history', color: 'pacific-cyan' },
                                        { label: 'Rankings', icon: '🏆', href: '/leaderboard', color: 'blue-500' }
                                    ].map((action) => (
                                        <Link 
                                            key={action.label}
                                            href={action.href} 
                                            className="flex flex-col items-center justify-center p-6 bg-white/[0.03] border border-white/5 rounded-3xl hover:border-white/20 transition-all group relative overflow-hidden active:scale-95"
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-br from-${action.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                                            <span className="text-3xl mb-3 group-hover:scale-110 transition-transform relative z-10">{action.icon}</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white relative z-10">{action.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Active Program (High-Impact Hero) */}
                        {activeProgram && (
                            <div className="bg-gradient-to-br from-cerulean/20 to-dark-teal/20 border border-turquoise-surf/30 rounded-[2.5rem] p-10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                                    <span className="text-[12rem]">🗓️</span>
                                </div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <span className="px-4 py-1.5 bg-turquoise-surf text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-turquoise-surf/20">
                                            Live Program
                                        </span>
                                        <div className="h-px w-12 bg-white/10"></div>
                                        <span className="text-gray-400 text-xs font-black uppercase tracking-widest">
                                            Week {activeProgram.current_week} <span className="text-gray-600">/</span> {activeProgram.total_weeks}
                                        </span>
                                    </div>

                                    <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase italic text-white">{activeProgram.program_name}</h2>
                                    
                                    {activeProgram.next_workout ? (
                                        <div className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 group-hover:border-turquoise-surf/20 transition-all">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Next Objective</p>
                                                <h3 className="text-2xl font-bold text-white mb-1">{activeProgram.next_workout.workout_name}</h3>
                                                <p className="text-xs font-bold text-turquoise-surf uppercase tracking-widest">Scheduled for Day {activeProgram.next_workout.day_number}</p>
                                            </div>
                                            <Link 
                                                href={`/workouts/active?template=${activeProgram.next_workout.workout_template_id}&assignment=${activeProgram.id}`}
                                                className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl"
                                            >
                                                Deploy Workout
                                            </Link>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mt-6 italic">No more objectives for this phase. Awaiting next cycle.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Overall Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Streak', value: user?.current_streak || 0, unit: 'Days', color: 'text-orange-500', icon: '🔥' },
                                { label: 'Workouts', value: stats?.total_workouts || 0, unit: 'Sessions', color: 'text-turquoise-surf', icon: '⚡' },
                                { label: 'Sets', value: stats?.total_sets || 0, unit: 'Completed', color: 'text-blue-400', icon: '💪' },
                                { label: 'Volume', value: stats?.total_volume_lbs ? (stats.total_volume_lbs / 1000).toFixed(1) + 'k' : '0', unit: 'Lbs', color: 'text-purple-400', icon: '🏋️' }
                            ].map((stat) => (
                                <div key={stat.label} className="glass-card text-center relative overflow-hidden group p-6 border-white/5 hover:border-white/10 transition-all">
                                    <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:scale-110 transition-transform">
                                        <span className="text-4xl">{stat.icon}</span>
                                    </div>
                                    <p className="text-gray-500 text-[8px] sm:text-[10px] font-black uppercase mb-2 tracking-[0.2em]">{stat.label}</p>
                                    <p className={`text-3xl sm:text-4xl font-black tracking-tighter ${stat.color} italic`}>{stat.value}</p>
                                    <p className="text-[8px] sm:text-[10px] text-gray-600 font-black uppercase mt-1 tracking-widest">{stat.unit}</p>
                                </div>
                            ))}
                        </div>

                        {/* Class Schedule Section (Premium Upgrade) */}
                        <div className="glass-card p-8 border-white/5">
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
                                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Session <span className="text-gradient">Schedule</span></h2>
                                <div className="flex items-center gap-4 bg-white/[0.03] p-1.5 rounded-2xl border border-white/5">
                                    <button onClick={handlePrevMonth} className="px-3 py-2 hover:bg-white/5 rounded-xl transition-colors text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-turquoise-surf">Prev</button>
                                    <div className="h-4 w-px bg-white/10"></div>
                                    <span className="font-black w-32 text-center text-[10px] uppercase tracking-[0.2em] text-white">
                                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                    </span>
                                    <div className="h-4 w-px bg-white/10"></div>
                                    <button onClick={handleNextMonth} className="px-3 py-2 hover:bg-white/5 rounded-xl transition-colors text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-turquoise-surf">Next</button>
                                </div>
                            </div>

                            {/* Weekly Date Strip */}
                            <div className="flex justify-between gap-3 mb-12 overflow-x-auto pb-6 custom-scrollbar px-1">
                                {Array.from({ length: 7 }).map((_, i) => {
                                    const startOfWeek = new Date();
                                    startOfWeek.setDate(new Date().getDate() - new Date().getDay());
                                    const dateObj = new Date(startOfWeek);
                                    dateObj.setDate(startOfWeek.getDate() + i);

                                    const isSelected = dateObj.toDateString() === selectedDate.toDateString();
                                    const isToday = dateObj.toDateString() === new Date().toDateString();
                                    const dayClasses = getClassesForDate(dateObj);
                                    const hasClasses = dayClasses.length > 0;

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedDate(dateObj)}
                                            className={`
                                                flex-1 min-w-[75px] py-6 rounded-3xl flex flex-col items-center transition-all duration-500 relative
                                                ${isSelected 
                                                    ? 'bg-gradient-to-b from-cerulean to-pacific-cyan text-black shadow-[0_20px_40px_rgba(8,172,214,0.3)] scale-110 z-10' 
                                                    : 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-gray-500'}
                                            `}
                                        >
                                            {isToday && !isSelected && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-turquoise-surf text-black text-[8px] font-black uppercase rounded-full shadow-xl">TODAY</div>
                                            )}
                                            <span className={`text-[9px] font-black uppercase tracking-widest mb-2 ${isSelected ? 'text-black/60' : 'text-gray-600'}`}>
                                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObj.getDay()]}
                                            </span>
                                            <span className={`text-3xl font-black tracking-tighter ${isSelected ? 'text-black' : 'text-white'}`}>
                                                {dateObj.getDate()}
                                            </span>
                                            {hasClasses && (
                                                <div className={`w-1.5 h-1.5 rounded-full mt-3 ${isSelected ? 'bg-black/40' : 'bg-turquoise-surf animate-pulse'}`}></div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Monthly Calendar Grid (Compact & Minimal) */}
                            <div className="grid grid-cols-7 gap-1 mb-4 text-center text-gray-700 text-[8px] font-black uppercase tracking-[0.3em] opacity-40">
                                <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {Array.from({ length: firstDay }).map((_, i) => (
                                    <div key={`empty-${i}`} className="aspect-square"></div>
                                ))}
                                {Array.from({ length: daysCount }).map((_, i) => {
                                    const day = i + 1;
                                    const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                                    const isToday = new Date().toDateString() === dateObj.toDateString();
                                    const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth() && selectedDate.getFullYear() === currentDate.getFullYear();
                                    const dayClasses = getClassesForDate(dateObj);
                                    const hasClasses = dayClasses.length > 0;
                                    const hasBookedClass = dayClasses.some(c => isClassBooked(c.id, dateObj));

                                    return (
                                        <div
                                            key={day}
                                            onClick={() => setSelectedDate(dateObj)}
                                            className={`
                                                aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all relative border
                                                ${isSelected ? 'bg-turquoise-surf/20 border-turquoise-surf/50 ring-4 ring-turquoise-surf/5' : 'bg-white/[0.02] border-transparent hover:border-white/10'}
                                                ${isToday ? 'ring-1 ring-white/20' : ''}
                                            `}
                                        >
                                            <span className={`text-xs font-bold ${isSelected ? 'text-turquoise-surf' : isToday ? 'text-white' : 'text-gray-600'}`}>{day}</span>
                                            {hasClasses && (
                                                <div className={`w-1 h-1 rounded-full mt-1 ${hasBookedClass ? 'bg-green-500' : 'bg-turquoise-surf/40'}`}></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Classes for Selected Day */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-4">
                                <h3 className="text-xl font-black uppercase tracking-tighter italic text-white">Daily <span className="text-turquoise-surf">Lineup</span></h3>
                                <div className="h-px flex-1 bg-white/5"></div>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                            </div>

                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2].map(i => <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse"></div>)}
                                </div>
                            ) : selectedDayClasses.length === 0 ? (
                                <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-[2rem] p-16 text-center">
                                    <p className="text-gray-600 font-bold uppercase tracking-widest text-sm mb-6">Zero sessions scheduled for this date</p>
                                    <Link href="/classes" className="text-turquoise-surf font-black uppercase tracking-[0.2em] text-[10px] hover:underline">Explore All Classes →</Link>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {selectedDayClasses.map((classItem) => {
                                        const booked = isClassBooked(classItem.id, selectedDate);
                                        return (
                                            <div
                                                key={classItem.id}
                                                className={`p-8 rounded-[2rem] border transition-all relative overflow-hidden group ${booked
                                                    ? 'bg-green-500/5 border-green-500/20'
                                                    : 'bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/[0.05] cursor-pointer'
                                                    }`}
                                                onClick={() => !booked && handleClassClick(classItem)}
                                            >
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h4 className="font-black text-2xl tracking-tight text-white group-hover:text-turquoise-surf transition-colors uppercase">
                                                                {classItem.name}
                                                            </h4>
                                                            {booked && (
                                                                <span className="px-3 py-1 text-[8px] font-black bg-green-500 text-black rounded-full uppercase tracking-widest">Confirmed</span>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-500 text-sm font-medium line-clamp-1 mb-4">{classItem.description}</p>
                                                        <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                            <span className="flex items-center gap-2 text-white"><span className="text-turquoise-surf">🕐</span> {formatTime12Hour(classItem.start_time)} <span className="text-gray-700">•</span> {classItem.duration_minutes}M</span>
                                                            <span className="flex items-center gap-2"><span className="text-turquoise-surf">👤</span> {classItem.instructor_name}</span>
                                                            <span className="flex items-center gap-2 px-2.5 py-1 bg-turquoise-surf/10 text-turquoise-surf rounded-lg">⚡ 1 Token</span>
                                                        </div>
                                                    </div>
                                                    {!booked && (
                                                        <button className="bg-turquoise-surf text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all w-full md:w-auto">
                                                            Reserve
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Insights & Stats */}
                    <div className="space-y-8">
                        
                        {/* AI Insights (Top of Right Column) */}
                        {recommendations.length > 0 && (
                            <div className="glass-card border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent p-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-xl">🤖</div>
                                    <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">AI <span className="text-purple-400">Insights</span></h2>
                                </div>
                                <div className="space-y-4">
                                    {recommendations.slice(0, 3).map(rec => (
                                        <Link 
                                            key={rec.id}
                                            href={`/exercises/${rec.id}`}
                                            className="block p-5 bg-white/[0.03] border border-white/5 rounded-[1.5rem] hover:border-purple-500/30 transition-all group relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <p className="text-[9px] font-black text-purple-400 uppercase mb-2 tracking-[0.2em]">{rec.muscle_group_name}</p>
                                            <h4 className="font-bold text-white group-hover:text-purple-300 transition-colors text-sm">{rec.name}</h4>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Personal Records (High Fidelity) */}
                        <div className="glass-card p-8 border-white/5">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-black uppercase tracking-tighter italic">The <span className="text-gradient">Vault</span></h2>
                                <Link href="/progress" className="text-[10px] font-black text-turquoise-surf hover:underline uppercase tracking-widest">All Records →</Link>
                            </div>
                            
                            {personalRecords.length === 0 ? (
                                <p className="text-gray-600 text-xs font-bold uppercase tracking-widest italic">No records stored yet.</p>
                            ) : (
                                <div className="grid gap-4">
                                    {personalRecords.slice(0, 4).map((pr) => (
                                        <div key={pr.id} className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 relative group overflow-hidden">
                                            <div className="absolute right-0 top-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                                <span className="text-4xl">🏆</span>
                                            </div>
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">{pr.exercise_name}</p>
                                            <div className="flex justify-between items-end">
                                                <p className="font-black text-white text-2xl tracking-tighter italic">
                                                    {pr.value} <span className="text-xs text-turquoise-surf not-italic font-bold uppercase ml-1">{pr.record_type === 'max_weight' ? 'lbs' : 'reps'}</span>
                                                </p>
                                                <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">{new Date(pr.achieved_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Achievements (Horizontal Scroll or Grid) */}
                        <div className="glass-card p-8 border-white/5">
                            <h2 className="text-xl font-black uppercase tracking-tighter italic mb-8 text-white">Honors</h2>
                            {achievements.length === 0 ? (
                                <p className="text-gray-600 text-xs font-bold uppercase tracking-widest italic">Unlock honors through training.</p>
                            ) : (
                                <div className="grid grid-cols-3 gap-4">
                                    {achievements.map((achievement) => (
                                        <div key={achievement.id} className="flex flex-col items-center text-center group cursor-help relative">
                                            <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/10 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 group-hover:bg-yellow-500/10 transition-all duration-500">
                                                🏆
                                            </div>
                                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-tight">{achievement.name}</span>
                                            <div className="absolute bottom-full mb-4 px-4 py-3 bg-gray-950 text-[10px] font-bold text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all whitespace-normal w-40 shadow-2xl pointer-events-none z-20 border border-white/10 text-center scale-95 group-hover:scale-100">
                                                <p className="text-yellow-500 mb-1 uppercase tracking-widest text-[8px]">Achievement Unlocked</p>
                                                {achievement.description}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Upcoming Classes */}
                        <div className="glass-card p-8 border-white/5">
                            <h2 className="text-xl font-black uppercase tracking-tighter italic mb-8 text-white">Upcoming</h2>
                            {bookings.length === 0 ? (
                                <p className="text-gray-600 text-xs font-bold uppercase tracking-widest italic">No confirmed missions.</p>
                            ) : (
                                <div className="grid gap-4">
                                    {bookings.slice(0, 3).map((booking) => (
                                        <div 
                                            key={booking.id} 
                                            className="flex items-center gap-5 p-5 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-turquoise-surf/20 cursor-pointer transition-all group active:scale-95"
                                            onClick={() => handleUpcomingClassClick(booking)}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 text-xs border border-green-500/20 group-hover:bg-green-500 group-hover:text-black transition-colors">
                                                ✓
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-black text-sm text-white truncate uppercase tracking-tight">{booking.class_name}</p>
                                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">
                                                    {new Date(booking.booking_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Support Card (Enhanced) */}
                        <div className="glass-card border-pacific-cyan/20 bg-gradient-to-br from-pacific-cyan/10 to-transparent p-8">
                            <h2 className="text-xl font-black uppercase tracking-tighter italic mb-4 text-white text-center">Tactical <span className="text-pacific-cyan">Support</span></h2>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center mb-8 leading-loose">
                                System malfunctions or feature requests? Pipe them directly to our dev team.
                            </p>
                            <Link 
                                href="/support" 
                                className="flex items-center justify-center gap-3 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-turquoise-surf transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/40"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                Open Channel
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Class Signup Modal */}
            {selectedClass && (
                <ClassSignupModal
                    classInfo={{
                        ...selectedClass,
                        date: selectedDate
                    }}
                    isBooked={isClassBooked(selectedClass.id, selectedDate)}
                    userCredits={user?.credits || 0}
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedClass(null);
                    }}
                    onConfirm={handleBookClass}
                />
            )}
        </div>
    );
}
