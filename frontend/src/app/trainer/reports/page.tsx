'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { formatTime12Hour } from "@/lib/utils";

interface AttendanceRecord {
    class_id: string;
    class_name: string;
    start_time: string;
    target_date: string;
    booking_count: string;
    total_attendees: string;
}

export default function TrainerReportsPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [report, setReport] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (authLoading) return;

        if (isAuthenticated && !user?.roles?.includes('trainer') && !user?.roles?.includes('admin')) {
            router.push('/');
            return;
        }

        if (isAuthenticated) {
            fetchReport();
        } else {
            router.push('/login?redirect=/trainer/reports');
        }
    }, [isAuthenticated, authLoading, user, router]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const response = await apiClient.getAttendanceReport(dateRange.start, dateRange.end);
            if (response.data) {
                setReport(response.data);
            } else if (response.error) {
                setError(response.error);
            }
        } catch (error) {
            console.error('Error fetching report:', error);
            setError('Failed to fetch report');
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateRange({ ...dateRange, [e.target.name]: e.target.value });
    };

    if (!isAuthenticated || (!user?.roles?.includes('trainer') && !user?.roles?.includes('admin'))) {
        return null;
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/trainer" className="text-turquoise-surf hover:text-pacific-cyan mb-4 inline-block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Attendance <span className="text-gradient">Report</span>
                    </h1>
                    <p className="text-xl text-gray-300">
                        View class attendance statistics for your sessions
                    </p>
                </div>

                {/* Filters */}
                <div className="glass rounded-xl p-6 mb-8 flex flex-col md:flex-row items-end gap-4">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Start Date</label>
                        <input
                            type="date"
                            name="start"
                            value={dateRange.start}
                            onChange={handleDateChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pacific-cyan"
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-semibold text-gray-400 mb-2">End Date</label>
                        <input
                            type="date"
                            name="end"
                            value={dateRange.end}
                            onChange={handleDateChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pacific-cyan"
                        />
                    </div>
                    <button
                        onClick={fetchReport}
                        className="px-8 py-3 bg-gradient-to-r from-cerulean to-pacific-cyan text-white font-bold rounded-lg transition-all transform hover:scale-105"
                    >
                        Generate Report
                    </button>
                </div>

                {/* Report Table */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
                        <p className="mt-4 text-gray-400">Generating report...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-6 rounded-xl text-center">
                        {error}
                    </div>
                ) : report.length === 0 ? (
                    <div className="glass rounded-xl p-12 text-center text-gray-400">
                        No attendance records found for this period.
                    </div>
                ) : (
                    <div className="glass rounded-xl overflow-hidden overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-gray-300">Date</th>
                                    <th className="px-6 py-4 font-bold text-gray-300">Class</th>
                                    <th className="px-6 py-4 font-bold text-gray-300">Time</th>
                                    <th className="px-6 py-4 font-bold text-gray-300">Bookings</th>
                                    <th className="px-6 py-4 font-bold text-gray-300">Total People</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {report.map((row, index) => (
                                    <tr key={index} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-white">
                                            {new Date(row.target_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-white font-semibold">
                                            {row.class_name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {formatTime12Hour(row.start_time)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm font-bold">
                                                {row.booking_count}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm font-bold">
                                                {row.total_attendees}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
