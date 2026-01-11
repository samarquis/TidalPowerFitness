'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

interface AvailabilitySlot {
    id: string;
    trainer_id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TrainerAvailabilityPage() {
    const { user, isAuthenticated, token } = useAuth();
    const router = useRouter();
    const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);
    const [formData, setFormData] = useState({
        day_of_week: 1,
        start_time: '09:00',
        end_time: '17:00'
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated && !user?.roles?.includes('trainer') && !user?.roles?.includes('admin')) {
            router.push('/');
            return;
        }

        if (isAuthenticated && user) {
            fetchAvailability();
        }
    }, [isAuthenticated, user, router]);

    const fetchAvailability = async () => {
        try {
            const response = await apiClient.getAvailability(user?.id || '');
            if (response.data) {
                setAvailability(response.data);
            } else if (response.error) {
                setError(response.error);
            }
        } catch (error) {
            console.error('Error fetching availability:', error);
            setError('Failed to fetch availability');
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingSlot(null);
        setFormData({ day_of_week: 1, start_time: '09:00', end_time: '17:00' });
        setError('');
        setShowModal(true);
    };

    const openEditModal = (slot: AvailabilitySlot) => {
        setEditingSlot(slot);
        setFormData({
            day_of_week: slot.day_of_week,
            start_time: slot.start_time,
            end_time: slot.end_time
        });
        setError('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingSlot(null);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const body = editingSlot
                ? formData
                : { ...formData, trainer_id: user?.id };

            const response = editingSlot
                ? await apiClient.updateAvailability(editingSlot.id, body)
                : await apiClient.createAvailability(body);

            if (response.error) {
                throw new Error(response.error);
            }

            await fetchAvailability();
            closeModal();
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this availability slot?')) return;

        try {
            const response = await apiClient.deleteAvailability(id);

            if (response.error) {
                throw new Error(response.error);
            }

            await fetchAvailability();
        } catch (error: any) {
            console.error('Error deleting availability:', error);
            alert(error.message || 'Failed to delete availability slot');
        }
    };

    // Group availability by day
    const availabilityByDay = DAYS.map((_, dayIndex) => ({
        day: DAYS[dayIndex],
        slots: availability.filter(a => a.day_of_week === dayIndex)
    }));

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
                        My <span className="text-gradient">Availability</span>
                    </h1>
                    <p className="text-xl text-gray-300">
                        Set your weekly availability for teaching classes
                    </p>
                </div>

                {/* Add Button */}
                <div className="mb-8">
                    <button
                        onClick={openCreateModal}
                        className="px-6 py-3 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white font-bold rounded-lg transition-all transform hover:scale-105"
                    >
                        + Add Availability Slot
                    </button>
                </div>

                {/* Weekly Calendar */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
                        <p className="mt-4 text-gray-400">Loading availability...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-7 gap-4">
                        {availabilityByDay.map(({ day, slots }) => (
                            <div key={day} className="glass rounded-lg p-4">
                                <h3 className="font-bold text-lg mb-3 text-center">{day}</h3>
                                <div className="space-y-2">
                                    {slots.length === 0 ? (
                                        <p className="text-gray-500 text-sm text-center">No availability</p>
                                    ) : (
                                        slots.map((slot) => (
                                            <div
                                                key={slot.id}
                                                className="bg-gradient-to-r from-pacific-cyan to-cerulean p-3 rounded-lg text-white text-sm"
                                            >
                                                <div className="font-bold">
                                                    {slot.start_time} - {slot.end_time}
                                                </div>
                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        onClick={() => openEditModal(slot)}
                                                        className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(slot.id)}
                                                        className="text-xs bg-red-500/50 hover:bg-red-500/70 px-2 py-1 rounded"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="glass rounded-2xl p-8 max-w-md w-full">
                            <h2 className="text-2xl font-bold mb-6">
                                {editingSlot ? 'Edit' : 'Add'} Availability Slot
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Day of Week
                                    </label>
                                    <select
                                        value={formData.day_of_week}
                                        onChange={(e) => setFormData({ ...formData, day_of_week: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-turquoise-surf"
                                    >
                                        {DAYS.map((day, index) => (
                                            <option key={index} value={index}>{day}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        value={formData.start_time}
                                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-turquoise-surf"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        value={formData.end_time}
                                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-turquoise-surf"
                                        required
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white font-bold rounded-lg transition-all"
                                    >
                                        {editingSlot ? 'Update' : 'Add'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
