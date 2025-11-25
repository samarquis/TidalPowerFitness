'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Class {
    id: string;
    name: string;
    description: string;
    category: string;
    instructor_name: string;
    day_of_week: number;
    start_time: string;
    duration_minutes: number;
    max_capacity: number;
    price_cents: number;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Generate consistent color for each class name
const getClassColor = (className: string): string => {
    const colors = [
        'from-blue-500 to-blue-600',
        'from-purple-500 to-purple-600',
        'from-pink-500 to-pink-600',
        'from-red-500 to-red-600',
        'from-orange-500 to-orange-600',
        'from-yellow-500 to-yellow-600',
        'from-green-500 to-green-600',
        'from-teal-500 to-teal-600',
        'from-cyan-500 to-cyan-600',
        'from-indigo-500 to-indigo-600',
    ];

    // Simple hash function to consistently map class name to color
    let hash = 0;
    for (let i = 0; i < className.length; i++) {
        hash = className.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

export default function ClassScheduleSection() {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/classes`);
            const data = await response.json();
            // Ensure data is an array before using array methods
            if (Array.isArray(data)) {
                setClasses(data);
            } else {
                console.error('API returned non-array data:', data);
                setClasses([]);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
            setClasses([]);
        } finally {
            setLoading(false);
        }
    };

    // Group classes by day
    const classesByDay = DAYS.map((_, dayIndex) => ({
        day: DAYS[dayIndex],
        classes: classes.filter(c => c.day_of_week === dayIndex)
    }));

    return (
        <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">
                        Weekly <span className="text-gradient">Class Schedule</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Join our expert-led classes throughout the week. Each class is color-coded for easy identification.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-4"></div>
                        <p className="mt-4 text-gray-400">Loading schedule...</p>
                    </div>
                ) : (
                    <>
                        {/* Weekly Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
                            {classesByDay.map(({ day, classes: dayClasses }) => (
                                <div key={day} className="glass rounded-lg p-4">
                                    <h3 className="font-bold text-lg mb-3 text-center">{day}</h3>
                                    <div className="space-y-2">
                                        {dayClasses.length === 0 ? (
                                            <p className="text-gray-500 text-sm text-center">No classes</p>
                                        ) : (
                                            dayClasses.map((classItem) => (
                                                <div
                                                    key={classItem.id}
                                                    className={`bg-gradient-to-r ${getClassColor(classItem.name)} p-3 rounded-lg text-white text-sm`}
                                                >
                                                    <div className="font-bold">{classItem.name}</div>
                                                    <div className="text-xs opacity-90 mt-1">
                                                        {classItem.start_time} • {classItem.duration_minutes}min
                                                    </div>
                                                    <div className="text-xs opacity-80">{classItem.instructor_name}</div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Color Legend */}
                        {classes.length > 0 && (
                            <div className="glass rounded-lg p-6 mb-8">
                                <h3 className="text-lg font-bold mb-4 text-center">Class Legend</h3>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {Array.from(new Set(classes.map(c => c.name))).map((className) => (
                                        <div
                                            key={className}
                                            className="flex items-center gap-2"
                                        >
                                            <div className={`w-4 h-4 rounded bg-gradient-to-r ${getClassColor(className)}`}></div>
                                            <span className="text-sm text-gray-300">{className}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="text-center">
                            <Link
                                href="/classes"
                                className="inline-block px-8 py-4 bg-gradient-to-r from-teal-6 to-teal-6 hover:from-teal-700 hover:to-teal-700 text-white font-bold rounded-lg text-lg transition-all transform hover:scale-105"
                            >
                                View Full Schedule & Book
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
