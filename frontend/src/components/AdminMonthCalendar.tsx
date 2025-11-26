'use client';

import React from 'react';
import Link from 'next/link';

interface Class {
    id: string;
    name: string;
    description: string;
    start_time: string;
    duration_minutes: number;
    instructor_id?: string;
    instructor_name: string;
    category: string;
    day_of_week: number;
    days_of_week?: number[];
    is_active: boolean;
    price_cents: number;
    max_capacity: number;
    [key: string]: any;
}

interface WorkoutSession {
    id: string;
    class_id?: string;
    session_date: string;
    workout_type_name?: string;
}

interface AdminMonthCalendarProps {
    classes: Class[];
    sessions?: WorkoutSession[];
    currentDate: Date;
    onClassClick?: (classItem: Class, date: Date) => void;
    onAddClassClick?: (date: Date) => void;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Helper to format time
function formatTime(time24: string): string {
    const [hourStr, minuteStr] = time24.split(':');
    let hour = parseInt(hourStr);
    const period = hour >= 12 ? 'pm' : 'am';
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
    return `${hour}:${minuteStr || '00'} ${period}`;
}

// Helper to get color based on category
function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
        'Strength Training': 'bg-red-500/20 border-red-500/50 text-red-200',
        'Cardio': 'bg-orange-500/20 border-orange-500/50 text-orange-200',
        'HIIT': 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200',
        'Yoga': 'bg-green-500/20 border-green-500/50 text-green-200',
        'Pilates': 'bg-teal-500/20 border-teal-500/50 text-teal-200',
        'CrossFit': 'bg-blue-500/20 border-blue-500/50 text-blue-200',
        'Boxing': 'bg-purple-500/20 border-purple-500/50 text-purple-200',
        'Cycling': 'bg-pink-500/20 border-pink-500/50 text-pink-200',
    };
    return colors[category] || 'bg-gray-500/20 border-gray-500/50 text-gray-200';
}

export default function AdminMonthCalendar({ classes, sessions = [], currentDate, onClassClick, onAddClassClick }: AdminMonthCalendarProps) {
    // Calendar helpers
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentDate);

    // Expand classes into daily instances for the month
    const getClassInstancesForDay = (day: number) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dayOfWeek = date.getDay();

        return classes
            .filter(c => {
                if (!c.is_active) return false;
                const days = c.days_of_week && c.days_of_week.length > 0 ? c.days_of_week : [c.day_of_week];
                return days.includes(dayOfWeek);
            })
            .sort((a, b) => a.start_time.localeCompare(b.start_time));
    };

    return (
        <div className="w-full">
            {/* Days Header */}
            <div className="grid grid-cols-7 gap-4 mb-4 text-center">
                {DAYS.map(day => (
                    <div key={day} className="font-bold text-gray-400 uppercase text-sm tracking-wider">
                        {day.slice(0, 3)}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-4 auto-rows-fr">
                {/* Empty cells for previous month */}
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[150px] bg-white/5 rounded-lg opacity-50"></div>
                ))}

                {/* Days of current month */}
                {Array.from({ length: days }).map((_, i) => {
                    const day = i + 1;
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const isToday = new Date().toDateString() === date.toDateString();
                    const dayClasses = getClassInstancesForDay(day);

                    return (
                        <div
                            key={day}
                            className={`min-h-[150px] bg-white/5 rounded-lg p-3 border transition-all hover:border-teal-500/30 group relative flex flex-col
                                ${isToday ? 'border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.2)]' : 'border-white/5'}
                            `}
                        >
                            {/* Date Number */}
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-lg font-bold ${isToday ? 'text-teal-400' : 'text-gray-300'}`}>
                                    {day}
                                </span>

                                {/* Add Class Button (Visible on Hover) */}
                                {onAddClassClick && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAddClassClick(date);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-teal-500/20 rounded text-teal-400 transition-all"
                                        title="Add class to this day"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Classes List */}
                            <div className="space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
                                {dayClasses.map((classItem, idx) => {
                                    const session = sessions?.find(s =>
                                        s.class_id === classItem.id &&
                                        new Date(s.session_date).toDateString() === date.toDateString()
                                    );

                                    return (
                                        <div
                                            key={`${classItem.id}-${day}-${idx}`}
                                            onClick={() => onClassClick && onClassClick(classItem, date)}
                                            className={`
                                                text-xs p-1.5 rounded border cursor-pointer transition-all hover:scale-[1.02]
                                                ${getCategoryColor(classItem.category)}
                                                ${session ? 'ring-1 ring-green-400' : ''}
                                            `}
                                        >
                                            <div className="font-bold truncate">{classItem.name}</div>
                                            <div className="flex justify-between opacity-80">
                                                <span>{formatTime(classItem.start_time)}</span>
                                                {session && <span className="text-green-400">✓</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                                {dayClasses.length === 0 && (
                                    <div className="flex-1 flex items-center justify-center text-gray-600 text-xs italic">
                                        No classes
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
