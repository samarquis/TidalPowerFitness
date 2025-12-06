'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api';

interface Trainer {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    bio?: string;
    specialties?: string[];
    certifications?: string[];
    years_experience?: number;
    profile_image_url?: string;
    acuity_calendar_id?: string;
    is_accepting_clients: boolean;
}

interface TrainerFormData {
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    phone: string;
    bio: string;
    specialties: string; // Comma separated for input
    certifications: string; // Comma separated for input
    years_experience: number;
    profile_image_url: string;
    acuity_calendar_id: string;
    is_accepting_clients: boolean;
}

const initialFormData: TrainerFormData = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    bio: '',
    specialties: '',
    certifications: '',
    years_experience: 0,
    profile_image_url: '',
    acuity_calendar_id: '',
    is_accepting_clients: true
};

export default function AdminTrainersPage() {
    const { user, isAuthenticated, token } = useAuth();
    const router = useRouter();
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<TrainerFormData>(initialFormData);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!isAuthenticated || (user && !user.roles?.includes('admin'))) {
            router.push('/');
            return;
        }
        fetchTrainers();
    }, [isAuthenticated, user, router]);

    const fetchTrainers = async () => {
        try {
            const { data, error } = await apiClient.getTrainers();
            if (error) {
                console.error('Error fetching trainers:', error);
            } else if (data) {
                // Handle both { trainers: [...] } object and direct [...] array formats
                const trainersData = data.trainers || data;
                if (Array.isArray(trainersData)) {
                    setTrainers(trainersData);
                } else {
                    console.error('Admin API returned non-array data:', data);
                    setTrainers([]);
                }
            }
        } catch (error) {
            console.error('Error fetching trainers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (trainer: Trainer) => {
        setEditingId(trainer.user_id);
        setFormData({
            first_name: trainer.first_name,
            last_name: trainer.last_name,
            email: trainer.email,
            password: '', // Password not required for update
            phone: trainer.phone || '',
            bio: trainer.bio || '',
            specialties: trainer.specialties?.join(', ') || '',
            certifications: trainer.certifications?.join(', ') || '',
            years_experience: trainer.years_experience || 0,
            profile_image_url: trainer.profile_image_url || '',
            acuity_calendar_id: trainer.acuity_calendar_id || '',
            is_accepting_clients: trainer.is_accepting_clients
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData(initialFormData);
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const payload = {
                ...formData,
                specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s),
                certifications: formData.certifications.split(',').map(s => s.trim()).filter(s => s),
            };

            let response;
            if (editingId) {
                // Update existing trainer
                response = await apiClient.updateTrainer(editingId, payload);
            } else {
                // Create new trainer
                response = await apiClient.createTrainer(payload);
            }

            const { error } = response;

            if (error) {
                throw new Error(error);
            }

            setSuccess(`Trainer ${editingId ? 'updated' : 'created'} successfully!`);
            handleCloseModal();
            fetchTrainers();
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-teal-400">Manage Trainers</h1>
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setFormData(initialFormData);
                            setIsModalOpen(true);
                        }}
                        className="px-4 py-2 bg-teal-6 hover:bg-teal-700 text-white rounded-lg transition-colors"
                    >
                        Add New Trainer
                    </button>
                </div>

                {/* Trainers List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trainers.map((trainer) => (
                        <div key={trainer.user_id} className="bg-gray-900 rounded-xl p-6 border border-white/10">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-gray-800 overflow-hidden">
                                    {trainer.profile_image_url ? (
                                        <img src={trainer.profile_image_url} alt={trainer.first_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-500">
                                            {trainer.first_name[0]}{trainer.last_name[0]}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{trainer.first_name} {trainer.last_name}</h3>
                                    <p className="text-gray-400 text-sm">{trainer.email}</p>
                                </div>
                                <button
                                    onClick={() => handleEdit(trainer)}
                                    className="ml-auto px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                                >
                                    Edit
                                </button>
                            </div>
                            <div className="space-y-2 text-sm text-gray-300">
                                <p><span className="text-gray-500">Experience:</span> {trainer.years_experience} years</p>
                                <p><span className="text-gray-500">Specialties:</span> {trainer.specialties?.join(', ')}</p>
                                <p><span className="text-gray-500">Status:</span> <span className={trainer.is_accepting_clients ? 'text-green-400' : 'text-red-400'}>{trainer.is_accepting_clients ? 'Active' : 'Not Accepting Clients'}</span></p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add/Edit Trainer Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
                            <h2 className="text-2xl font-bold mb-6 text-white">{editingId ? 'Edit Trainer' : 'Add New Trainer'}</h2>

                            {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg">{error}</div>}
                            {success && <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg">{success}</div>}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">First Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.first_name}
                                            onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Last Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.last_name}
                                            onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Email *</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                            disabled={!!editingId} // Disable email edit as it's the primary key/login
                                        />
                                    </div>
                                    {!editingId && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Password *</label>
                                            <input
                                                type="password"
                                                required
                                                value={formData.password}
                                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                                    <textarea
                                        rows={3}
                                        value={formData.bio}
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Specialties</label>
                                        <input
                                            type="text"
                                            value={formData.specialties}
                                            onChange={e => setFormData({ ...formData, specialties: e.target.value })}
                                            placeholder="e.g. HIIT, Yoga, Strength"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Certifications</label>
                                        <input
                                            type="text"
                                            value={formData.certifications}
                                            onChange={e => setFormData({ ...formData, certifications: e.target.value })}
                                            placeholder="e.g. NASM, ACE"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Years Experience</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.years_experience}
                                            onChange={e => setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Acuity Calendar ID</label>
                                        <input
                                            type="text"
                                            value={formData.acuity_calendar_id}
                                            onChange={e => setFormData({ ...formData, acuity_calendar_id: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Profile Image URL</label>
                                    <input
                                        type="url"
                                        value={formData.profile_image_url}
                                        onChange={e => setFormData({ ...formData, profile_image_url: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                </div>

                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="is_accepting_clients"
                                        checked={formData.is_accepting_clients}
                                        onChange={e => setFormData({ ...formData, is_accepting_clients: e.target.checked })}
                                        className="w-4 h-4 text-teal-6 rounded focus:ring-teal-500 bg-gray-700 border-gray-600"
                                    />
                                    <label htmlFor="is_accepting_clients" className="text-sm font-medium text-gray-300">
                                        Accepting New Clients
                                    </label>
                                </div>

                                <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-teal-6 hover:bg-teal-700 text-white rounded-lg transition-colors font-semibold"
                                    >
                                        {editingId ? 'Update Trainer' : 'Create Trainer'}
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
