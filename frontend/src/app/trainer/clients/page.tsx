'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

interface Client {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    total_bookings: number;
    last_booking_date: string;
}

export default function MyClientsPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>([]);
    const [filteredClients, setFilteredClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (authLoading) return;

        if (isAuthenticated && !user?.roles?.includes('trainer') && !user?.roles?.includes('admin')) {
            router.push('/');
            return;
        }

        if (isAuthenticated) {
            fetchClients();
        } else if (!isAuthenticated) {
            router.push('/login?redirect=/trainer/clients');
        }
    }, [isAuthenticated, authLoading, user, router]);

    useEffect(() => {
        if (searchTerm) {
            const filtered = clients.filter(client =>
                `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredClients(filtered);
        } else {
            setFilteredClients(clients);
        }
    }, [searchTerm, clients]);

    const fetchClients = async () => {
        try {
            const response = await apiClient.getMyClients();
            if (response.data) {
                setClients(response.data);
                setFilteredClients(response.data);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16 flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
            </div>
        );
    }

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
                        My <span className="text-gradient">Clients</span>
                    </h1>
                    <p className="text-gray-400">View and manage clients who attend your classes</p>
                </div>

                {/* Search Bar */}
                <div className="glass rounded-xl p-6 mb-8">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-turquoise-surf transition-all"
                    />
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl font-bold text-turquoise-surf">{clients.length}</div>
                        <div className="text-gray-400 mt-1">Total Clients</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl font-bold text-blue-400">
                            {clients.reduce((sum, c) => sum + parseInt(c.total_bookings.toString()), 0)}
                        </div>
                        <div className="text-gray-400 mt-1">Total Bookings</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl font-bold text-purple-400">
                            {clients.filter(c => {
                                const lastBooking = new Date(c.last_booking_date);
                                const thirtyDaysAgo = new Date();
                                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                                return lastBooking >= thirtyDaysAgo;
                            }).length}
                        </div>
                        <div className="text-gray-400 mt-1">Active (30 days)</div>
                    </div>
                </div>

                {/* Clients List */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
                        <p className="mt-4 text-gray-400">Loading clients...</p>
                    </div>
                ) : filteredClients.length === 0 ? (
                    <div className="glass rounded-xl p-12 text-center">
                        <p className="text-gray-400 text-lg">
                            {searchTerm ? 'No clients found matching your search.' : 'No clients yet. Clients will appear here once they attend your classes.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredClients.map((client) => (
                            <Link
                                key={client.id}
                                href={`/trainer/clients/${client.id}`}
                                className="glass rounded-xl p-6 hover:bg-white/10 transition-all transform hover:scale-105 cursor-pointer"
                            >
                                {/* Avatar */}
                                <div className="flex items-center mb-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-turquoise-surf to-cerulean flex items-center justify-center text-white text-2xl font-bold mr-4">
                                        {client.first_name[0]}{client.last_name[0]}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">
                                            {client.first_name} {client.last_name}
                                        </h3>
                                        <p className="text-gray-400 text-sm">{client.email}</p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="space-y-2 border-t border-white/10 pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Total Classes:</span>
                                        <span className="text-white font-semibold">{client.total_bookings}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Last Attended:</span>
                                        <span className="text-white font-semibold">
                                            {new Date(client.last_booking_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* View Button */}
                                <div className="mt-4">
                                    <div className="px-4 py-2 bg-gradient-to-r from-cerulean to-pacific-cyan text-white text-center rounded-lg font-semibold">
                                        View Workouts →
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
