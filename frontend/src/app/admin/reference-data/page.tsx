'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface ReferenceData {
    id: string;
    name: string;
    description?: string;
    created_at?: Date;
}

export default function ReferenceDataPage() {
    const { user, isAuthenticated, token } = useAuth();
    const router = useRouter();
    const [bodyFocusAreas, setBodyFocusAreas] = useState<ReferenceData[]>([]);
    const [workoutTypes, setWorkoutTypes] = useState<ReferenceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'body' | 'workout'>('body');
    const [editingItem, setEditingItem] = useState<ReferenceData | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [errors, setErrors] = useState<{ name?: string }>({});

    useEffect(() => {
        if (isAuthenticated && !user?.roles?.includes('admin')) {
            router.push('/');
            return;
        }

        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated, user, router]);

    const fetchData = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

            const [bodyRes, workoutRes] = await Promise.all([
                fetch(`${apiUrl}/exercises/body-focus-areas`, {
                    credentials: 'include'
                }),
                fetch(`${apiUrl}/exercises/workout-types`, {
                    credentials: 'include'
                })
            ]);

            if (bodyRes.ok) setBodyFocusAreas(await bodyRes.json());
            if (workoutRes.ok) setWorkoutTypes(await workoutRes.json());
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = (type: 'body' | 'workout') => {
        setModalType(type);
        setEditingItem(null);
        setFormData({ name: '', description: '' });
        setErrors({});
        setShowModal(true);
    };

    const openEditModal = (item: ReferenceData, type: 'body' | 'workout') => {
        setModalType(type);
        setEditingItem(item);
        setFormData({ name: item.name, description: item.description || '' });
        setErrors({});
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setFormData({ name: '', description: '' });
        setErrors({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setErrors({ name: 'Name is required' });
            return;
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const endpoint = modalType === 'body' ? 'body-focus-areas' : 'workout-types';
            const url = editingItem
                ? `${apiUrl}/exercises/${endpoint}/${editingItem.id}`
                : `${apiUrl}/exercises/${endpoint}`;
            const method = editingItem ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchData();
                closeModal();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to save');
            }
        } catch (error) {
            console.error('Error saving:', error);
            alert('Failed to save');
        }
    };

    const handleDelete = async (id: string, type: 'body' | 'workout') => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const endpoint = type === 'body' ? 'body-focus-areas' : 'workout-types';

            const response = await fetch(`${apiUrl}/exercises/${endpoint}/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                fetchData();
            }
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    if (!isAuthenticated || !user?.roles?.includes('admin')) {
        return null;
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-8">
                    Reference Data <span className="text-gradient">Management</span>
                </h1>
                <p className="text-gray-400 mb-8">Manage body focus areas and workout types</p>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Body Focus Areas */}
                        <div className="glass rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Body Focus Areas</h2>
                                <button
                                    onClick={() => openCreateModal('body')}
                                    className="px-4 py-2 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white font-bold rounded-lg transition-all"
                                >
                                    + Add New
                                </button>
                            </div>

                            <div className="space-y-3">
                                {bodyFocusAreas.map((area) => (
                                    <div key={area.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-white">{area.name}</h3>
                                                {area.description && (
                                                    <p className="text-sm text-gray-400 mt-1">{area.description}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <button
                                                    onClick={() => openEditModal(area, 'body')}
                                                    className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all border border-blue-500/20"
                                                    title="Edit"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(area.id, 'body')}
                                                    className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-all border border-red-500/20"
                                                    title="Delete"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {bodyFocusAreas.length === 0 && (
                                    <p className="text-gray-400 text-center py-8">No body focus areas yet</p>
                                )}
                            </div>
                        </div>

                        {/* Workout Types */}
                        <div className="glass rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Workout Types</h2>
                                <button
                                    onClick={() => openCreateModal('workout')}
                                    className="px-4 py-2 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white font-bold rounded-lg transition-all"
                                >
                                    + Add New
                                </button>
                            </div>

                            <div className="space-y-3">
                                {workoutTypes.map((type) => (
                                    <div key={type.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-white">{type.name}</h3>
                                                {type.description && (
                                                    <p className="text-sm text-gray-400 mt-1">{type.description}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <button
                                                    onClick={() => openEditModal(type, 'workout')}
                                                    className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all border border-blue-500/20"
                                                    title="Edit"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(type.id, 'workout')}
                                                    className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-all border border-red-500/20"
                                                    title="Delete"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {workoutTypes.length === 0 && (
                                    <p className="text-gray-400 text-center py-8">No workout types yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-2xl max-w-md w-full p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">
                                {editingItem ? 'Edit' : 'Create'} {modalType === 'body' ? 'Body Focus Area' : 'Workout Type'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white text-2xl">
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-turquoise-surf"
                                    placeholder={modalType === 'body' ? 'e.g., Chest' : 'e.g., Strength'}
                                />
                                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-turquoise-surf"
                                    rows={3}
                                    placeholder="Optional description..."
                                />
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white font-bold rounded-lg transition-all"
                                >
                                    {editingItem ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
