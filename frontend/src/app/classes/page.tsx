'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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
    const { user, token, isAuthenticated } = useAuth();
    const [classes, setClasses] = useState<Class[]>([]);
    const [credits, setCredits] = useState<UserCredits | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingClass, setBookingClass] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchClasses();
        if (isAuthenticated && user) {
            fetchUserCredits();
        }
    }, [isAuthenticated, user]);

    const fetchClasses = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/classes`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setClasses(data);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserCredits = async () => {
        if (!token || !user) return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/users/${user.id}/credits`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const total = data.reduce((sum: number, c: any) => sum + c.remaining_credits, 0);
                setCredits({ total, details: data });
            }
        } catch (error) {
            console.error('Error fetching credits:', error);
        }
    };

    const handleBookClass = async (classId: string) => {
        if (!isAuthenticated) {
            window.location.href = '/login?redirect=/classes';
            return;
        }

        if (!credits || credits.total < 1) {
            setError('You need at least 1 credit to book a class. Please purchase a package.');
            return;
        }

        setBookingClass(classId);
        setError('');
        setSuccess('');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ class_id: classId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Failed to book class');
            }

            setSuccess('Class booked successfully! 1 credit has been deducted.');
            fetchUserCredits(); // Refresh credits
        } catch (error: any) {
            setError(error.message);
        } finally {
            setBookingClass(null);
        }
    };

    // Group classes by day
    const classesByDay = DAYS.map((day, dayIndex) => ({
        day,
        classes: classes.filter(c => c.day_of_week === dayIndex)
    }));

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Class Schedule</h1>
                    <p className="text-gray-600">Browse and book classes using your credits</p>
                </div>

                {/* Credits Display */}
                {isAuthenticated && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Your Credits</h2>
                                <p className="text-3xl font-bold text-teal-600 mt-2">
                                    {credits?.total || 0} {credits?.total === 1 ? 'Credit' : 'Credits'}
                                </p>
                            </div>
                            <a
                                href="/packages"
                                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                            >
                                Buy More Credits
                            </a>
                        </div>
                    </div>
                )}

                {/* Error/Success Messages */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {success}
                    </div>
                )}

                {/* Classes by Day */}
                <div className="space-y-8">
                    {classesByDay.map(({ day, classes: dayClasses }) => (
                        <div key={day}>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{day}</h2>
                            {dayClasses.length === 0 ? (
                                <p className="text-gray-500">No classes scheduled</p>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {dayClasses.map((classItem) => (
                                        <div
                                            key={classItem.id}
                                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                                        >
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {classItem.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-4">
                                                {classItem.description}
                                            </p>
                                            <div className="space-y-2 text-sm text-gray-700 mb-4">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {classItem.start_time} • {classItem.duration_minutes} min
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    {classItem.instructor_name}
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                    <span className="font-semibold text-teal-600">1 Credit</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleBookClass(classItem.id)}
                                                disabled={bookingClass === classItem.id || !isAuthenticated}
                                                className="w-full py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                            >
                                                {bookingClass === classItem.id ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Booking...
                                                    </>
                                                ) : (
                                                    isAuthenticated ? 'Book Class' : 'Login to Book'
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
