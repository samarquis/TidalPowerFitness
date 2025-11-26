'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

// Mock data for stats - in a real app this would come from an API
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
    ],
    recentWorkouts: [
        { id: 1, name: 'HIIT Blast', date: '2023-11-24', type: 'Cardio', duration: '45m' },
        { id: 2, name: 'Power Lifting', date: '2023-11-22', type: 'Strength', duration: '60m' },
        { id: 3, name: 'Yoga Flow', date: '2023-11-20', type: 'Flexibility', duration: '50m' }
    ]
};

export default function UserDashboard() {
    const { user } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Calendar helpers
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome back, <span className="text-gradient">{user?.first_name}</span>
                    </h1>
                    <p className="text-gray-400">Here's your fitness overview for today.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Calendar & Upcoming */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Calendar Section */}
                        <div className="glass rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Schedule</h2>
                                <div className="flex items-center gap-4">
                                    <button onClick={handlePrevMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">←</button>
                                    <span className="font-semibold w-32 text-center">
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
                                    const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth();

                                    return (
                                        <div
                                            key={day}
                                            onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                                            className={`
                                                aspect-square rounded-lg flex items-center justify-center cursor-pointer transition-all relative
                                                ${isSelected ? 'bg-teal-600 text-white' : 'bg-white/5 hover:bg-white/10'}
                                                ${isToday ? 'border border-teal-400' : ''}
                                            `}
                                        >
                                            {day}
                                            {/* Dot for events (mock) */}
                                            {[3, 7, 12, 15, 22, 25].includes(day) && (
                                                <div className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-teal-400"></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="glass rounded-xl p-6">
                            <h2 className="text-2xl font-bold mb-6">Recent Workouts</h2>
                            <div className="space-y-4">
                                {STATS.recentWorkouts.map((workout) => (
                                    <div key={workout.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex items-center justify-center text-xl">
                                                {workout.type === 'Cardio' ? '🏃' : workout.type === 'Strength' ? '🏋️' : '🧘'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold">{workout.name}</h3>
                                                <p className="text-sm text-gray-400">{workout.date} • {workout.duration}</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10">
                                            {workout.type}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stats & Badges */}
                    <div className="space-y-8">
                        {/* Weight Lifted Stats */}
                        <div className="glass rounded-xl p-6">
                            <h2 className="text-2xl font-bold mb-6">Weight Lifted</h2>
                            <div className="space-y-4">
                                {STATS.weightLifted.map((stat) => (
                                    <div key={stat.muscle}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-300">{stat.muscle}</span>
                                            <span className="font-bold text-teal-400">{stat.weight} {stat.unit}</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-teal-6 to-teal-4 rounded-full"
                                                style={{ width: `${(stat.weight / 1500) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="glass rounded-xl p-6">
                            <h2 className="text-2xl font-bold mb-6">Achievements</h2>
                            <div className="grid grid-cols-3 gap-4">
                                {STATS.badges.map((badge) => (
                                    <div key={badge.id} className="flex flex-col items-center text-center group cursor-help relative">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center text-3xl mb-2 group-hover:scale-110 transition-transform">
                                            {badge.icon}
                                        </div>
                                        <span className="text-xs font-semibold text-gray-300">{badge.name}</span>

                                        {/* Tooltip */}
                                        <div className="absolute bottom-full mb-2 px-2 py-1 bg-black text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
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
                                    Book a Class
                                </Link>
                                <Link href="/contact" className="block w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-center font-semibold transition-colors">
                                    Contact Trainer
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
