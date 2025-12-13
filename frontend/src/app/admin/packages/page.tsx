'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Package {
    id: string;
    name: string;
    description?: string;
    price_cents: number;
    credit_count: number;
    duration_days?: number;
    type: 'one_time' | 'subscription';
    is_active: boolean;
}

interface PackageFormData {
    name: string;
    description: string;
    price_cents: number;
    credit_count: number;
    duration_days: number;
    type: 'one_time' | 'subscription';
}

export default function AdminPackagesPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPackage, setEditingPackage] = useState<Package | null>(null);
    const [formData, setFormData] = useState<PackageFormData>({
        name: '',
        description: '',
        price_cents: 0,
        credit_count: 0,
        duration_days: 30,
        type: 'one_time'
    });

    useEffect(() => {
        if (isAuthenticated && !user?.roles?.includes('admin')) {
            router.push('/');
            return;
        }

        if (isAuthenticated) {
            fetchPackages();
        }
    }, [isAuthenticated, user, router]);

    const fetchPackages = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

            const response = await fetch(`${apiUrl}/packages`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setPackages(data);
            }
        } catch (error) {
            console.error('Error fetching packages:', error);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingPackage(null);
        setFormData({
            name: '',
            description: '',
            price_cents: 0,
            credit_count: 0,
            duration_days: 30,
            type: 'one_time'
        });
        setShowModal(true);
    };

    const openEditModal = (pkg: Package) => {
        setEditingPackage(pkg);
        setFormData({
            name: pkg.name,
            description: pkg.description || '',
            price_cents: pkg.price_cents,
            credit_count: pkg.credit_count,
            duration_days: pkg.duration_days || 30,
            type: pkg.type
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingPackage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

            const url = editingPackage
                ? `${apiUrl}/packages/${editingPackage.id}`
                : `${apiUrl}/packages`;

            const method = editingPackage ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchPackages();
                closeModal();
            } else {
                alert('Failed to save package');
            }
        } catch (error) {
            console.error('Error saving package:', error);
            alert('Failed to save package');
        }
    };

    const deletePackage = async (id: string) => {
        if (!confirm('Are you sure you want to deactivate this package?')) return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

            const response = await fetch(`${apiUrl}/packages/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                fetchPackages();
            }
        } catch (error) {
            console.error('Error deleting package:', error);
        }
    };

    if (!isAuthenticated || !user?.roles?.includes('admin')) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-4">
                            Package <span className="text-gradient">Management</span>
                        </h1>
                        <p className="text-gray-400">Manage class packages and subscriptions</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="px-6 py-3 bg-gradient-to-r from-teal-6 to-teal-6 hover:from-teal-700 hover:to-teal-700 text-white font-bold rounded-lg transition-all"
                    >
                        + Create Package
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-4"></div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packages.map((pkg) => (
                            <div key={pkg.id} className="glass rounded-xl p-6 relative group">
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEditModal(pkg)}
                                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deletePackage(pkg.id)}
                                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                                    >
                                        Delete
                                    </button>
                                </div>

                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${pkg.type === 'subscription'
                                            ? 'bg-purple-500/20 text-purple-400'
                                            : 'bg-teal-500/20 text-teal-4'
                                        }`}>
                                        {pkg.type === 'subscription' ? 'Subscription' : 'One-time'}
                                    </span>
                                </div>

                                <p className="text-gray-400 text-sm mb-6 h-12 line-clamp-2">
                                    {pkg.description}
                                </p>

                                <div className="space-y-2 border-t border-white/10 pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Price:</span>
                                        <span className="text-white font-semibold">${(pkg.price_cents / 100).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Credits:</span>
                                        <span className="text-white font-semibold">{pkg.credit_count}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Duration:</span>
                                        <span className="text-white font-semibold">{pkg.duration_days} days</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-2xl max-w-lg w-full p-8">
                        <h2 className="text-2xl font-bold mb-6">
                            {editingPackage ? 'Edit Package' : 'Create Package'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Price (Cents)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.price_cents}
                                        onChange={(e) => setFormData({ ...formData, price_cents: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">${(formData.price_cents / 100).toFixed(2)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Credits</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.credit_count}
                                        onChange={(e) => setFormData({ ...formData, credit_count: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Duration (Days)</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.duration_days}
                                        onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                    >
                                        <option value="one_time">One-time</option>
                                        <option value="subscription">Subscription</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-8">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-teal-6 to-teal-6 hover:from-teal-700 hover:to-teal-700 text-white font-bold rounded-lg transition-all"
                                >
                                    {editingPackage ? 'Update Package' : 'Create Package'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
