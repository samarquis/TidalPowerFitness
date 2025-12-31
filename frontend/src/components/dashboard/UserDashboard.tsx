'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import ClassSignupModal from '@/components/ClassSignupModal';

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

interface UserCredits {
    total: number;
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
    const { user, token } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [classes, setClasses] = useState<Class[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [credits, setCredits] = useState<UserCredits>({ total: 0 });
    const [stats, setStats] = useState<WorkoutStats | null>(null);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
    const [activeProgram, setActiveProgram] = useState<ActiveProgram | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (user && token) {
            fetchData();
        }
    }, [user, token]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('payment') === 'success') {
            setSuccessMessage('Payment successful! Your credits have been updated.');
            // Remove the query parameter from the URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const fetchData = async () => {
        try {
            // Fetch everything in parallel
            const [
                classesRes,
                bookingsRes,
                creditsRes,
                statsRes,
                achievementsRes,
                prRes,
                programRes
            ] = await Promise.all([
                apiClient.getClasses(),
                apiClient.getUserBookings(user!.id),
                apiClient.getUserCredits(user!.id),
                apiClient.getClientStats(user!.id),
                apiClient.getUserAchievements(user!.id),
                apiClient.getPersonalRecords(user!.id),
                apiClient.getMyActiveProgram()
            ]);

            if (classesRes.data) setClasses(classesRes.data);
            if (bookingsRes.data) setBookings(bookingsRes.data.filter((b: Booking) => b.status === 'confirmed'));
            if (creditsRes.data) setCredits({ total: creditsRes.data.credits || 0 });
            if (statsRes.data) setStats(statsRes.data);
            if (achievementsRes.data) setAchievements(achievementsRes.data);
            if (prRes.data) setPersonalRecords(prRes.data);
            if (programRes.data) setActiveProgram(programRes.data);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookClass = async (classId: string, attendeeCount: number = 1) => {
        try {
            const response = await (apiClient as any).request('/bookings', {
                method: 'POST',
                body: JSON.stringify({
                    class_id: classId,
                    attendee_count: attendeeCount
                })
            });

            if (response.error) {
                throw new Error(response.error);
            }

            // Refresh data after booking
            await fetchData();
            setSuccessMessage(`Class booked successfully for ${attendeeCount} ${attendeeCount === 1 ? 'person' : 'people'}! ${attendeeCount} ${attendeeCount === 1 ? 'credit has' : 'credits have'} been deducted.`);
            setTimeout(() => setSuccessMessage(''), 5000);
        } catch (error: any) {
            console.error('Booking error:', error);
            alert(error.message || 'Failed to book class');
        }
    };

    const handleClassClick = (classItem: Class) => {
        setSelectedClass(classItem);
        setShowModal(true);
    };

    // Calendar helpers
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const getClassesForDate = (day: number) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dayOfWeek = date.getDay();

        return classes.filter(c => {
            const days = c.days_of_week && c.days_of_week.length > 0 ? c.days_of_week : [c.day_of_week];
            return days.includes(dayOfWeek);
        });
    };

    const isClassBooked = (classId: string) => {
        return bookings.some(b => b.class_id === classId);
    };

    const { days, firstDay } = getDaysInMonth(currentDate);
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const selectedDayClasses = getClassesForDate(selectedDate.getDate());

    return (
        <div className="min-h-screen bg-black page-container">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Welcome back, <span className="text-gradient">{user?.first_name}</span>
                        </h1>
                        <p className="text-gray-400 text-lg">Here's your fitness overview for today.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/classes" className="btn-primary">
                            Book a Class
                        </Link>
                    </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-lg flex items-center justify-between">
                        <span>{successMessage}</span>
                        <button onClick={() => setSuccessMessage('')} className="text-green-300 hover:text-white">✕</button>
                    </div>
                )}

                {/* Credits Banner */}
                <div className="glass-card mb-12 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pacific-cyan to-cerulean flex items-center justify-center">
                            <span className="text-2xl font-bold">{credits.total}</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 uppercase font-bold">Available Tokens</p>
                            <p className="font-semibold text-white">Ready to book classes</p>
                        </div>
                    </div>
                    <Link href="/packages" className="btn-primary">
                        Buy More Tokens
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Calendar & Selected Day Classes */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Active Program Card */}
                        {activeProgram && (
                            <div className="bg-gradient-to-br from-cerulean/20 to-dark-teal/20 border border-turquoise-surf/30 rounded-2xl p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                    <span className="text-8xl">🗓️</span>
                                </div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="px-3 py-1 bg-turquoise-surf text-black text-[10px] font-bold uppercase tracking-widest rounded-full">
                                            Current Program
                                        </span>
                                        <span className="text-gray-400 text-sm font-medium">
                                            Week {activeProgram.current_week} of {activeProgram.total_weeks}
                                        </span>
                                    </div>

                                    <h2 className="text-3xl font-bold mb-2">{activeProgram.program_name}</h2>
                                    
                                    {activeProgram.next_workout ? (
                                        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-white/5">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Next Scheduled Workout</p>
                                                <h3 className="text-xl font-bold text-white">{activeProgram.next_workout.workout_name}</h3>
                                                <p className="text-sm text-gray-400">Scheduled for Day {activeProgram.next_workout.day_number}</p>
                                            </div>
                                            <Link 
                                                href={`/workouts/active?template=${activeProgram.next_workout.workout_template_id}&assignment=${activeProgram.id}`}
                                                className="btn-primary py-3 px-8 text-center"
                                            >
                                                Start Workout
                                            </Link>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 mt-4 italic">No more workouts scheduled for this week. Great job!</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Overall Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="glass-card text-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:scale-110 transition-transform">
                                    <span className="text-4xl">🔥</span>
                                </div>
                                <p className="text-gray-400 text-[10px] font-bold uppercase mb-1 tracking-widest">Current Streak</p>
                                <p className="text-3xl font-bold text-orange-500">{user?.current_streak || 0}</p>
                                <p className="text-[10px] text-gray-600 font-bold uppercase mt-1">Days</p>
                            </div>
                            <div className="glass-card text-center">
                                <p className="text-gray-400 text-[10px] font-bold uppercase mb-1 tracking-widest">Total Workouts</p>
                                <p className="text-3xl font-bold text-turquoise-surf">{stats?.total_workouts || 0}</p>
                                <p className="text-[10px] text-gray-600 font-bold uppercase mt-1">Sessions</p>
                            </div>
                            <div className="glass-card text-center">
                                <p className="text-gray-400 text-[10px] font-bold uppercase mb-1 tracking-widest">Total Sets</p>
                                <p className="text-3xl font-bold text-blue-400">{stats?.total_sets || 0}</p>
                                <p className="text-[10px] text-gray-600 font-bold uppercase mt-1">Completed</p>
                            </div>
                            <div className="glass-card text-center">
                                <p className="text-gray-400 text-[10px] font-bold uppercase mb-1 tracking-widest">Volume (lbs)</p>
                                <p className="text-3xl font-bold text-purple-400">
                                    {stats?.total_volume_lbs ? (stats.total_volume_lbs / 1000).toFixed(1) + 'k' : '0'}
                                </p>
                                <p className="text-[10px] text-gray-600 font-bold uppercase mt-1">Lbs Lifted</p>
                            </div>
                        </div>

                        {/* Calendar Section */}
                        <div className="glass-card">
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                                <h2 className="text-2xl font-bold">Class Schedule</h2>
                                <div className="flex items-center gap-4 bg-white/5 p-1 rounded-xl border border-white/10">
                                    <button onClick={handlePrevMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">←</button>
                                    <span className="font-bold w-32 text-center text-sm">
                                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                    </span>
                                    <button onClick={handleNextMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">→</button>
                                </div>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {Array.from({ length: firstDay }).map((_, i) => (
                                    <div key={`empty-${i}`} className="aspect-square"></div>
                                ))}
                                {Array.from({ length: days }).map((_, i) => {
                                    const day = i + 1;
                                    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                                    const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth() && selectedDate.getFullYear() === currentDate.getFullYear();
                                    const dayClasses = getClassesForDate(day);
                                    const hasClasses = dayClasses.length > 0;
                                    const hasBookedClass = dayClasses.some(c => isClassBooked(c.id));

                                    return (
                                        <div
                                            key={day}
                                            onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                                            className={`
                                                aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all relative p-1
                                                ${isSelected ? 'bg-gradient-to-br from-cerulean to-pacific-cyan text-white ring-2 ring-turquoise-surf shadow-lg' : 'bg-white/5 hover:bg-white/10 border border-white/5'}
                                                ${isToday && !isSelected ? 'border-2 border-turquoise-surf' : ''}
                                            `}
                                        >
                                            <span className="text-sm font-bold">{day}</span>
                                            {hasClasses && (
                                                <div className="flex gap-1 mt-1">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${hasBookedClass ? 'bg-green-400' : 'bg-turquoise-surf'}`}></div>
                                                    {dayClasses.length > 1 && (
                                                        <div className={`w-1.5 h-1.5 rounded-full ${hasBookedClass ? 'bg-green-400 shadow-sm' : 'bg-turquoise-surf'}`}></div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Selected Day Classes */}
                        <div className="glass-card">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-turquoise-surf"></span>
                                Classes on {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </h2>
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-turquoise-surf"></div>
                                </div>
                            ) : selectedDayClasses.length === 0 ? (
                                <div className="bg-white/5 rounded-2xl p-12 text-center border border-dashed border-white/10">
                                    <p className="text-gray-500 text-lg">No classes scheduled for this day.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedDayClasses.map((classItem) => {
                                        const booked = isClassBooked(classItem.id);
                                        return (
                                            <div
                                                key={classItem.id}
                                                className={`p-5 rounded-2xl border transition-all ${booked
                                                    ? 'bg-green-500/10 border-green-500/30'
                                                    : 'bg-white/5 border-white/10 hover:border-turquoise-surf/30 hover:bg-white/10 cursor-pointer group'
                                                    }`}
                                                onClick={() => !booked && handleClassClick(classItem)}
                                            >
                                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                                    <div>
                                                        <h3 className="font-bold text-xl flex items-center gap-3 group-hover:text-turquoise-surf transition-colors">
                                                            {classItem.name}
                                                            {booked && (
                                                                <span className="px-3 py-1 text-[10px] font-bold bg-green-500/20 text-green-400 rounded-full border border-green-500/20 uppercase tracking-wider">
                                                                    ✓ Booked
                                                                </span>
                                                            )}
                                                        </h3>
                                                        <p className="text-sm text-gray-400 mt-2 line-clamp-1">{classItem.description}</p>
                                                        <div className="flex flex-wrap gap-4 mt-4 text-xs font-medium text-gray-300">
                                                            <span className="flex items-center gap-1.5"><span className="text-turquoise-surf">🕐</span> {classItem.start_time.slice(0, 5)} <span className="text-gray-600">•</span> {classItem.duration_minutes}m</span>
                                                            <span className="flex items-center gap-1.5"><span className="text-turquoise-surf">👤</span> {classItem.instructor_name}</span>
                                                            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-turquoise-surf/10 text-turquoise-surf rounded-md">⚡ 1 Credit</span>
                                                        </div>
                                                    </div>
                                                    {!booked && (
                                                        <button
                                                            className="btn-primary w-full sm:w-auto py-2 px-6"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleClassClick(classItem);
                                                            }}
                                                        >
                                                            Book Now
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

                    {/* Right Column: PRs & Achievements */}
                    <div className="space-y-8">
                        {/* Personal Records */}
                        <div className="glass-card">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">Personal Records</h2>
                                <Link href="/progress" className="text-xs font-bold text-turquoise-surf hover:underline uppercase tracking-wider">View All</Link>
                            </div>
                            
                            {personalRecords.length === 0 ? (
                                <p className="text-gray-500 text-sm italic">No personal records yet. Keep pushing!</p>
                            ) : (
                                <div className="space-y-4">
                                    {personalRecords.slice(0, 4).map((pr) => (
                                        <div key={pr.id} className="bg-white/5 p-4 rounded-xl border border-white/5">
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{pr.exercise_name}</p>
                                            <div className="flex justify-between items-baseline">
                                                <p className="font-bold text-white text-lg">
                                                    {pr.value} <span className="text-xs text-gray-500 font-normal">{pr.record_type === 'max_weight' ? 'lbs' : pr.record_type === 'max_reps' ? 'reps' : ''}</span>
                                                </p>
                                                <p className="text-[10px] text-gray-600">{new Date(pr.achieved_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Achievements */}
                        <div className="glass-card">
                            <h2 className="text-xl font-bold mb-6">Achievements</h2>
                            {achievements.length === 0 ? (
                                <p className="text-gray-500 text-sm italic">Unlock badges by completing workouts!</p>
                            ) : (
                                <div className="grid grid-cols-3 gap-4">
                                    {achievements.map((achievement) => (
                                        <div key={achievement.id} className="flex flex-col items-center text-center group cursor-help relative">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 flex items-center justify-center text-2xl mb-2 group-hover:scale-110 group-hover:bg-yellow-500/20 transition-all duration-300">
                                                🏆
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 leading-tight uppercase tracking-tighter">{achievement.name}</span>
                                            <div className="absolute bottom-full mb-3 px-3 py-2 bg-gray-900 text-[10px] font-medium text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-normal w-32 shadow-2xl pointer-events-none z-10 border border-white/10 text-center">
                                                {achievement.description}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* My Upcoming Bookings */}
                        <div className="glass-card">
                            <h2 className="text-xl font-bold mb-6">Upcoming Classes</h2>
                            {bookings.length === 0 ? (
                                <p className="text-gray-500 text-sm italic">No upcoming classes booked.</p>
                            ) : (
                                <div className="space-y-3">
                                    {bookings.slice(0, 3).map((booking) => (
                                        <div key={booking.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 text-xs border border-green-500/20">
                                                ✓
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm text-white truncate">{booking.class_name}</p>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase">
                                                    {new Date(booking.booking_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="glass-card bg-gradient-to-br from-dark-teal/20 to-black border-teal-500/20">
                            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                            <div className="space-y-3">
                                <Link href="/classes" className="btn-primary w-full text-sm">
                                    Browse Classes
                                </Link>
                                <Link href="/workouts/templates" className="btn-secondary w-full text-sm">
                                    My Templates
                                </Link>
                            </div>
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
                    userCredits={credits.total}
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