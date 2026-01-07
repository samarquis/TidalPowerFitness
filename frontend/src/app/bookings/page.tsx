'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { formatTime12Hour } from "@/lib/utils";
import Link from 'next/link';

interface Booking {
    id: string;
    class_id: string;
    class_name: string;
    instructor_name: string;
    target_date: string;
    start_time: string;
    status: string;
    credits_used: number;
    attendee_count: number;
}

export default function MyBookingsPage() {
    const { user, isAuthenticated } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelling, setCancelling] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchBookings();
        }
    }, [isAuthenticated, user]);

    const fetchBookings = async () => {
        if (!user) return;
        try {
            const { data, error } = await apiClient.getUserBookings(user.id);
            if (error) throw new Error(error);
            if (Array.isArray(data)) {
                setBookings(data);
            }
        } catch (error: any) {
            console.error('Error fetching bookings:', error);
            setError('Failed to load your bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        setCancelling(bookingId);
        try {
            const { error } = await apiClient.cancelBooking(bookingId);
            if (error) throw new Error(error);
            
            // Refresh bookings
            await fetchBookings();
        } catch (error: any) {
            console.error('Error cancelling booking:', error);
            alert(error.message || 'Failed to cancel booking');
        } finally {
            setCancelling(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    const upcomingBookings = bookings.filter(b => new Date(b.target_date) >= new Date(new Date().setHours(0,0,0,0)));
    const pastBookings = bookings.filter(b => new Date(b.target_date) < new Date(new Date().setHours(0,0,0,0)));

    return (
        <div className="min-h-screen bg-black pt-24 pb-16 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">My <span className="text-gradient">Bookings</span></h1>
                        <p className="text-gray-400">View and manage your upcoming and past classes</p>
                    </div>
                    <Link 
                        href="/classes"
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all"
                    >
                        Book a Class
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl mb-8">
                        {error}
                    </div>
                )}

                <div className="space-y-12">
                    {/* Upcoming Bookings */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                            Upcoming Classes
                        </h2>

                        {upcomingBookings.length === 0 ? (
                            <div className="bg-white/5 rounded-2xl p-12 text-center border border-dashed border-white/10">
                                <p className="text-gray-500 mb-6 text-lg">You don't have any upcoming classes booked.</p>
                                <Link 
                                    href="/classes"
                                    className="inline-block px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold transition-all"
                                >
                                    Explore Class Schedule
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {upcomingBookings.map(booking => (
                                    <div 
                                        key={booking.id}
                                        className="glass rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6"
                                    >
                                        <div className="flex gap-6 items-center">
                                            <div className="bg-teal-600/20 w-16 h-16 rounded-xl flex flex-col items-center justify-center text-teal-400 border border-teal-500/20">
                                                <span className="text-xs font-bold uppercase">{new Date(booking.target_date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                                <span className="text-xl font-bold">{new Date(booking.target_date).toLocaleDateString('en-US', { day: 'numeric' })}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">{booking.class_name}</h3>
                                                <p className="text-gray-400 text-sm">
                                                    {booking.instructor_name} • {formatTime12Hour(booking.start_time)}
                                                </p>
                                                <div className="flex gap-2 mt-2">
                                                    <span className="bg-white/5 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-white/10">
                                                        {booking.attendee_count} {booking.attendee_count === 1 ? 'Attendee' : 'Attendees'}
                                                    </span>
                                                    <span className="bg-teal-500/10 text-teal-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-teal-500/20">
                                                        {booking.credits_used} {booking.credits_used === 1 ? 'Token' : 'Tokens'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => handleCancelBooking(booking.id)}
                                                disabled={cancelling === booking.id}
                                                className="w-full md:w-auto px-6 py-3 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-all text-sm disabled:opacity-50"
                                            >
                                                {cancelling === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Past Bookings */}
                    {pastBookings.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                                Past Classes
                            </h2>
                            <div className="grid gap-4 opacity-70">
                                {pastBookings.map(booking => (
                                    <div 
                                        key={booking.id}
                                        className="glass rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6"
                                    >
                                        <div className="flex gap-6 items-center">
                                            <div className="bg-white/5 w-16 h-16 rounded-xl flex flex-col items-center justify-center text-gray-400 border border-white/10">
                                                <span className="text-xs font-bold uppercase">{new Date(booking.target_date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                                <span className="text-xl font-bold">{new Date(booking.target_date).toLocaleDateString('en-US', { day: 'numeric' })}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">{booking.class_name}</h3>
                                                <p className="text-gray-400 text-sm">
                                                    {booking.instructor_name} • {formatTime12Hour(booking.start_time)}
                                                </p>
                                                <div className="flex gap-2 mt-2">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                                                        booking.status === 'attended' 
                                                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                                            : 'bg-white/5 text-gray-500 border-white/10'
                                                    }`}>
                                                        {booking.status || 'Completed'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-gray-500 text-sm">
                                                Used {booking.credits_used} {booking.credits_used === 1 ? 'Token' : 'Tokens'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
