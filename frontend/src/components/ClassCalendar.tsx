import { formatTime12Hour } from "@/lib/utils";
import React from 'react';

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

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface ClassCalendarProps {


// Helper to get color based on category
function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
        'Strength Training': 'bg-red-500/20 border-red-500/50 text-red-200',
        'Cardio': 'bg-orange-500/20 border-orange-500/50 text-orange-200',
        'HIIT': 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200',
        'Yoga': 'bg-green-500/20 border-green-500/50 text-green-200',
        'Pilates': 'bg-pacific-cyan/20 border-pacific-cyan/50 text-turquoise-surf',
        'CrossFit': 'bg-blue-500/20 border-blue-500/50 text-blue-200',
        'Boxing': 'bg-purple-500/20 border-purple-500/50 text-purple-200',
        'Cycling': 'bg-pink-500/20 border-pink-500/50 text-pink-200',
    };
    return colors[category] || 'bg-gray-500/20 border-gray-500/50 text-gray-200';
}

export default function ClassCalendar({ classes, sessions = [], weekStartDate, onClassClick }: ClassCalendarProps) {
    // Helper to get date for a specific day index (0=Sunday)
    const getDateForDayIndex = (dayIndex: number): Date | null => {
        if (!weekStartDate) return null;
        const date = new Date(weekStartDate);
        // Adjust date based on day index (assuming weekStartDate is Sunday)
        const currentDay = date.getDay();
        const diff = dayIndex - currentDay;
        date.setDate(date.getDate() + diff);
        return date;
    };
    // Expand multi-day classes into individual instances for the calendar
    const calendarEvents = classes.flatMap(c => {
        const days = c.days_of_week && c.days_of_week.length > 0
            ? c.days_of_week
            : [c.day_of_week];

        return days.map(day => ({
            ...c,
            displayDay: day
        }));
    }).sort((a, b) => {
        // Sort by time
        return a.start_time.localeCompare(b.start_time);
    });

    return (
        <div className="overflow-x-auto pb-4">
            <div className="min-w-[1000px] grid grid-cols-7 gap-4">
                {DAYS.map((day, index) => (
                    <div key={day} className="flex flex-col gap-4">
                        {/* Day Header */}
                        <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                            <h3 className="font-bold text-white">{day}</h3>
                            {weekStartDate && (
                                <div className="text-sm text-gray-400 mt-1">
                                    {getDateForDayIndex(index)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                            )}
                        </div>

                        {/* Classes for this day */}
                        <div className="flex flex-col gap-3">
                            {calendarEvents
                                .filter(c => c.displayDay === index && c.is_active)
                                .map((classItem, i) => {
                                    const date = getDateForDayIndex(index);
                                    const session = sessions?.find(s =>
                                        s.class_id === classItem.id &&
                                        date &&
                                        new Date(s.session_date).toDateString() === date.toDateString()
                                    );

                                    return (
                                        <div
                                            key={`${classItem.id}-${index}-${i}`}
                                            onClick={() => onClassClick && onClassClick(classItem, date || undefined)}
                                            className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-105 hover:shadow-lg relative ${getCategoryColor(classItem.category)}`}
                                        >
                                            <div className="font-bold text-sm mb-1">{classItem.name}</div>
                                            <div className="text-xs opacity-80 mb-1">
                                                {formatTime12Hour(classItem.start_time)} ({classItem.duration_minutes}m)
                                            </div>
                                            <div className="text-xs opacity-80 mb-2">
                                                {classItem.instructor_name}
                                            </div>

                                            {session && (
                                                <div className="mt-2 pt-2 border-t border-white/20">
                                                    <div className="text-xs font-bold text-white flex items-center gap-1">
                                                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                                        Workout Assigned
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                            {calendarEvents.filter(c => c.displayDay === index && c.is_active).length === 0 && (
                                <div className="text-center py-8 text-gray-600 text-sm italic">
                                    No classes
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
