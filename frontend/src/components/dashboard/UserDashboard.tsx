'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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

// Mock data for stats - these will be replaced with real data in Phase 4
const STATS = {
    weightLifted: [
        { muscle: 'Legs', weight: 1250, unit: 'lbs' },
        { muscle: 'Chest', weight: 850, unit: 'lbs' },
        { muscle: 'Back', weight: 950, unit: 'lbs' },
        { muscle: 'Arms', weight: 450, unit: 'lbs' },
        { muscle: 'Shoulders', weight: 350, unit: 'lbs' }
    ],
    badges: [
        { id: 1, name: 'Early Bird', icon: '🌅', description: 'Completed 5 morning classes' },
        { id: 2, name: 'Heavy Lifter', icon: '💪', description: 'Lifted over 1000lbs total' },
        { id: 3, name: 'Streak Master', icon: '🔥', description: '3 week workout streak' }
    ]
};

export default function UserDashboard() {
    const { user, token } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [classes, setClasses] = useState<Class[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [credits, setCredits] = useState<UserCredits>({ total: 0 });
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (user && token) {
            fetchData();
        }
    }, [user, token]);

    const fetchData = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

        try {
            // Fetch classes
            const classesRes = await fetch(`${apiUrl}/classes`);
            if (classesRes.ok) {
                const classesData = await classesRes.json();
                if (Array.isArray(classesData)) {
                    setClasses(classesData);
                }
            }

            // Fetch user's bookings
            const bookingsRes = await fetch(`${apiUrl}/bookings/user/${user?.id}`, {
                credentials: 'include'
            });
            if (bookingsRes.ok) {
                const bookingsData = await bookingsRes.json();
                setBookings(bookingsData.filter((b: Booking) => b.status === 'confirmed'));
            }

            // Fetch user credits
            const creditsRes = await fetch(`${apiUrl}/users/${user?.id}/credits`, {
                credentials: 'include'
            });
            if (creditsRes.ok) {
                const creditsData = await creditsRes.json();
                const total = creditsData.reduce((sum: number, c: any) => sum + c.remaining_credits, 0);
                setCredits({ total });
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookClass = async (classId: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

        const response = await fetch(`${apiUrl}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ class_id: classId })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'Failed to book class');
        }

        // Refresh data after booking
        await fetchData();
        setSuccessMessage('Class booked successfully! 1 credit has been deducted.');
        setTimeout(() => setSuccessMessage(''), 5000);
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
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome back, <span className="text-gradient">{user?.first_name}</span>
                    </h1>
                    <p className="text-gray-400">Here's your fitness overview for today.</p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-lg flex items-center justify-between">
                        <span>{successMessage}</span>
                        <button onClick={() => setSuccessMessage('')} className="text-green-300 hover:text-white">✕</button>
                    </div>
                )}

                {/* Credits Banner */}
                <div className="glass rounded-xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                            <span className="text-2xl font-bold">{credits.total}</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Available Credits</p>
                            <p className="font-semibold">Ready to book classes</p>
                        </div>
                    </div>
                    <Link href="/packages" className="px-5 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg font-semibold transition-colors">
                        Buy More Credits
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Calendar & Selected Day Classes */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Calendar Section */}
                        <div className="glass rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Class Schedule</h2>
                                <div className="flex items-center gap-4">
                                    <button onClick={handlePrevMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">←</button>
                                    <span className="font-semibold w-40 text-center">
                                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                    </span>
                                    <button onClick={handleNextMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">→</button>
                                </div>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-gray-400 text-sm">
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
                                                aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all relative p-1
                                                ${isSelected ? 'bg-teal-600 text-white ring-2 ring-teal-400' : 'bg-white/5 hover:bg-white/10'}
                                                ${isToday ? 'border-2 border-teal-400' : ''}
                                            `}
                                        >
                                            <span className="text-sm font-medium">{day}</span>
                                            {hasClasses && (
                                                <div className="flex gap-0.5 mt-1">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${hasBookedClass ? 'bg-green-400' : 'bg-teal-400'}`}></div>
                                                    {dayClasses.length > 1 && (
                                                        <div className={`w-1.5 h-1.5 rounded-full ${hasBookedClass ? 'bg-green-400' : 'bg-teal-400'}`}></div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="flex gap-6 mt-4 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-teal-400"></div>
                                    <span>Classes Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    <span>You're Booked</span>
                                </div>
                            </div>
                        </div>

                        {/* Selected Day Classes */}
                        <div className="glass rounded-xl p-6">
                            <h2 className="text-2xl font-bold mb-4">
                                Classes on {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </h2>
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-400"></div>
                                </div>
                            ) : selectedDayClasses.length === 0 ? (
                                <p className="text-gray-400 py-8 text-center">No classes scheduled for this day.</p>
                            ) : (
                                <div className="space-y-4">
                                    {selectedDayClasses.map((classItem) => {
                                        const booked = isClassBooked(classItem.id);
                                        return (
                                            <div
                                                key={classItem.id}
                                                className={`p-4 rounded-lg border transition-all ${booked
                                                        ? 'bg-green-500/10 border-green-500/30'
                                                        : 'bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer'
                                                    }`}
                                                onClick={() => !booked && handleClassClick(classItem)}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                                            {classItem.name}
                                                            {booked && (
                                                                <span className="px-2 py-0.5 text-xs bg-green-500/30 text-green-300 rounded-full">
                                                                    ✓ Booked
                                                                </span>
                                                            )}
                                                        </h3>
                                                        <p className="text-sm text-gray-400 mt-1">{classItem.description}</p>
                                                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-300">
                                                            <span>🕐 {classItem.start_time} • {classItem.duration_minutes}min</span>
                                                            <span>👤 {classItem.instructor_name}</span>
                                                            <span className="text-teal-400 font-semibold">⚡ 1 Credit</span>
                                                        </div>
                                                    </div>
                                                    {!booked && (
                                                        <button
                                                            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-sm font-semibold transition-colors"
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

                    {/* Right Column: Stats & Badges */}
                    <div className="space-y-8">
                        {/* My Bookings */}
                        <div className="glass rounded-xl p-6">
                            <h2 className="text-xl font-bold mb-4">My Upcoming Classes</h2>
                            {bookings.length === 0 ? (
                                <p className="text-gray-400 text-sm">No upcoming classes booked.</p>
                            ) : (
                                <div className="space-y-3">
                                    {bookings.slice(0, 5).map((booking) => (
                                        <div key={booking.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                                ✓
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{booking.class_name}</p>
                                                <p className="text-xs text-gray-400">
                                                    Booked {new Date(booking.booking_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Weight Lifted Stats (Placeholder for Phase 4) */}
                        <div className="glass rounded-xl p-6">
                            <h2 className="text-xl font-bold mb-6">Weight Lifted</h2>
                            <div className="space-y-4">
                                {STATS.weightLifted.map((stat) => (
                                    <div key={stat.muscle}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-300">{stat.muscle}</span>
                                            <span className="font-bold text-teal-400">{stat.weight} {stat.unit}</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full"
                                                style={{ width: `${(stat.weight / 1500) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Badges (Placeholder for Phase 5) */}
                        <div className="glass rounded-xl p-6">
                            <h2 className="text-xl font-bold mb-4">Achievements</h2>
                            <div className="grid grid-cols-3 gap-4">
                                {STATS.badges.map((badge) => (
                                    <div key={badge.id} className="flex flex-col items-center text-center group cursor-help relative">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform">
                                            {badge.icon}
                                        </div>
                                        <span className="text-xs font-semibold text-gray-300">{badge.name}</span>
                                        <div className="absolute bottom-full mb-2 px-2 py-1 bg-black text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                            {badge.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="glass rounded-xl p-6">
                            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <Link href="/classes" className="block w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 rounded-lg text-center font-bold transition-colors">
                                    Browse All Classes
                                </Link>
                                <Link href="/trainers" className="block w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-center font-semibold transition-colors">
                                    View Trainers
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
