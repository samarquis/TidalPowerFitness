'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

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

function TrainersContent() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
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

    // Handle 'edit' query param
    useEffect(() => {
        const editId = searchParams.get('edit');
        if (editId && trainers.length > 0) {
            const trainerToEdit = trainers.find(t => t.user_id === editId);
            if (trainerToEdit) {
                handleEdit(trainerToEdit);
                // Clear the query param without refreshing
                const url = new URL(window.location.href);
                url.searchParams.delete('edit');
                window.history.replaceState({}, '', url.pathname);
            }
        }
    }, [searchParams, trainers]);

    const fetchTrainers = async () => {
        try {
            const { data, error } = await apiClient.getTrainers();
            if (error) {
                console.error('Error fetching trainers:', error);
            } else if (data) {
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
                response = await apiClient.updateTrainer(editingId, payload);
            } else {
                response = await apiClient.createTrainer(payload);
            }

            const { error } = response;

            if (error) {
                throw new Error(error);
            }

            setSuccess(`Trainer ${editingId ? 'updated' : 'created'} successfully!`);
            handleCloseModal();
            fetchTrainers();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMessage);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-4">
                    <Link href="/admin" className="text-turquoise-surf hover:text-pacific-cyan inline-flex items-center gap-2 transition-colors">
                        ← Back to Admin Dashboard
                    </Link>
                </div>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-turquoise-surf">Manage Trainers</h1>
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setFormData(initialFormData);
                            setIsModalOpen(true);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-cerulean/20 font-bold"
                    >
                        Add New Trainer
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trainers.map((trainer) => (
                        <div key={trainer.user_id} className="glass rounded-xl p-6 border border-white/10 hover:border-turquoise-surf/30 transition-all group">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-white/5 overflow-hidden border border-white/10 shrink-0">
                                    {trainer.profile_image_url ? (
                                        <img src={trainer.profile_image_url} alt={trainer.first_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-500">
                                            {trainer.first_name[0]}{trainer.last_name[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-xl font-bold truncate">{trainer.first_name} {trainer.last_name}</h3>
                                    <p className="text-gray-400 text-sm truncate">{trainer.email}</p>
                                </div>
                                <button
                                    onClick={() => handleEdit(trainer)}
                                    className="ml-auto p-2 bg-white/5 hover:bg-turquoise-surf/20 text-turquoise-surf rounded-lg transition-colors border border-white/10"
                                    title="Edit Trainer"
                                >
                                    📝
                                </button>
                            </div>
                            <div className="space-y-3 text-sm text-gray-300">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-gray-500">Experience</span>
                                    <span className="font-semibold text-white">{trainer.years_experience} years</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block mb-1">Specialties</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {trainer.specialties?.length ? (
                                            trainer.specialties.map(s => (
                                                <span key={s} className="px-2 py-0.5 bg-pacific-cyan/10 text-turquoise-surf rounded-md text-[10px] font-bold border border-pacific-cyan/20">{s}</span>
                                            ))
                                        ) : <span className="text-gray-600 italic">None specified</span>}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-gray-500">Status</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${trainer.is_accepting_clients ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {trainer.is_accepting_clients ? 'ACCEPTING CLIENTS' : 'NOT ACCEPTING'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-white">{editingId ? 'Edit Trainer' : 'Add New Trainer'}</h2>
                                <button onClick={handleCloseModal} className="text-gray-400 hover:text-white text-2xl transition-colors">×</button>
                            </div>

                            {error && <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-sm font-semibold">{error}</div>}
                            {success && <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg text-sm font-semibold">{success}</div>}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">First Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.first_name}
                                            onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pacific-cyan focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Last Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.last_name}
                                            onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pacific-cyan focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Email *</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pacific-cyan focus:border-transparent outline-none transition-all disabled:opacity-50"
                                            disabled={!!editingId}
                                        />
                                    </div>
                                    {!editingId && (
                                        <div>
                                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Password *</label>
                                            <input
                                                type="password"
                                                required
                                                value={formData.password}
                                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pacific-cyan focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pacific-cyan focus:border-transparent outline-none transition-all"
                                        placeholder="(555) 000-0000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Bio</label>
                                    <textarea
                                        rows={3}
                                        value={formData.bio}
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pacific-cyan focus:border-transparent outline-none transition-all"
                                        placeholder="Trainer biography..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Specialties</label>
                                        <input
                                            type="text"
                                            value={formData.specialties}
                                            onChange={e => setFormData({ ...formData, specialties: e.target.value })}
                                            placeholder="HIIT, Yoga, Strength"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pacific-cyan focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Certifications</label>
                                        <input
                                            type="text"
                                            value={formData.certifications}
                                            onChange={e => setFormData({ ...formData, certifications: e.target.value })}
                                            placeholder="NASM, ACE"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pacific-cyan focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Years Experience</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.years_experience}
                                            onChange={e => setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pacific-cyan focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Acuity Calendar ID</label>
                                        <input
                                            type="text"
                                            value={formData.acuity_calendar_id}
                                            onChange={e => setFormData({ ...formData, acuity_calendar_id: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pacific-cyan focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Profile Image URL</label>
                                    <input
                                        type="url"
                                        value={formData.profile_image_url}
                                        onChange={e => setFormData({ ...formData, profile_image_url: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pacific-cyan focus:border-transparent outline-none transition-all"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg border border-white/5">
                                    <input
                                        type="checkbox"
                                        id="is_accepting_clients"
                                        checked={formData.is_accepting_clients}
                                        onChange={e => setFormData({ ...formData, is_accepting_clients: e.target.checked })}
                                        className="w-5 h-5 text-pacific-cyan rounded focus:ring-pacific-cyan bg-gray-700 border-gray-600 cursor-pointer"
                                    />
                                    <label htmlFor="is_accepting_clients" className="text-sm font-bold text-gray-300 cursor-pointer uppercase tracking-wider">
                                        Accepting New Clients
                                    </label>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg border border-white/10 transition-colors order-2 sm:order-1"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white rounded-lg transition-all font-bold shadow-lg shadow-cerulean/20 order-1 sm:order-2"
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

export default function AdminTrainersPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center font-bold text-xl uppercase tracking-widest animate-pulse">Loading...</div>}>
            <TrainersContent />
        </Suspense>
    );
}