'use client';

import { useState, useEffect } from 'react';
import ClassCard from '@/components/ui/ClassCard';

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

const DAYS = ['All Days', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ClassesPage() {
    const [classes, setClasses] = useState<Class[]>([]);
    const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (selectedDay === null) {
            setFilteredClasses(classes);
        } else {
            setFilteredClasses(classes.filter(c => c.day_of_week === selectedDay));
        }
    }, [selectedDay, classes]);

    const fetchClasses = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/classes`);
            const data = await response.json();
            setClasses(data);
            setFilteredClasses(data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Group Fitness <span className="text-gradient">Classes</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Join our high-energy group classes led by expert instructors. From strength training to yoga, we have something for everyone.
                    </p>
                </div>

                {/* Day filter */}
                <div className="mb-12">
                    <div className="flex flex-wrap justify-center gap-3">
                        {DAYS.map((day, index) => (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(index === 0 ? null : index - 1)}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all ${(selectedDay === null && index === 0) || selectedDay === index - 1
                                        ? 'bg-gradient-to-r from-teal-6 to-teal-6 text-white'
                                        : 'glass text-gray-300 hover:bg-white/10'
                                    }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Classes grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-4"></div>
                        <p className="mt-4 text-gray-400">Loading classes...</p>
                    </div>
                ) : filteredClasses.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-400">No classes found for the selected day.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredClasses.map((classItem) => (
                            <ClassCard
                                key={classItem.id}
                                id={classItem.id}
                                name={classItem.name}
                                description={classItem.description}
                                category={classItem.category}
                                instructorName={classItem.instructor_name}
                                dayOfWeek={classItem.day_of_week}
                                startTime={classItem.start_time}
                                durationMinutes={classItem.duration_minutes}
                                maxCapacity={classItem.max_capacity}
                                priceCents={classItem.price_cents}
                            />
                        ))}
                    </div>
                )}

                {/* CTA Section */}
                <div className="mt-20 text-center glass rounded-2xl p-12">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        Book your first class today and experience the Tidal Power difference. All fitness levels welcome!
                    </p>
                    <a
                        href="https://app.acuityscheduling.com/schedule/cf017c84"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-8 py-4 bg-gradient-to-r from-teal-6 to-teal-6 hover:from-teal-700 hover:to-teal-700 text-white font-bold rounded-lg text-lg transition-all transform hover:scale-105"
                    >
                        View Schedule & Book
                    </a>
                </div>
            </div>
        </div>
    );
}
