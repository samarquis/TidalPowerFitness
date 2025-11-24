'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role: 'client' | 'trainer' | 'admin';
    is_active: boolean;
    created_at: string;
}

export default function UserManagementPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'client' | 'trainer' | 'admin'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Check if user is admin
        if (isAuthenticated && user?.role !== 'admin') {
            router.push('/');
            return;
        }

        if (isAuthenticated) {
            fetchUsers();
        }
    }, [isAuthenticated, user, router]);

    useEffect(() => {
        let filtered = users;

        // Filter by role
        if (filter !== 'all') {
            filtered = filtered.filter(u => u.role === filter);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(u =>
                u.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredUsers(filtered);
    }, [users, filter, searchTerm]);

    const fetchUsers = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('token');

            const response = await fetch(`${apiUrl}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data.users);
                setFilteredUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId: string, newRole: 'client' | 'trainer' | 'admin') => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('token');

            const response = await fetch(`${apiUrl}/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });

            if (response.ok) {
                fetchUsers(); // Refresh the list
            }
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const toggleUserActivation = async (userId: string, currentStatus: boolean) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('token');

            const response = await fetch(`${apiUrl}/users/${userId}/activate`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ is_active: !currentStatus })
            });

            if (response.ok) {
                fetchUsers(); // Refresh the list
            }
        } catch (error) {
            console.error('Error toggling activation:', error);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-500/20 text-red-400';
            case 'trainer': return 'bg-teal-500/20 text-teal-400';
            default: return 'bg-blue-500/20 text-blue-400';
        }
    };

    if (!isAuthenticated || user?.role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        User <span className="text-gradient">Management</span>
                    </h1>
                    <p className="text-gray-400">Manage user accounts, roles, and permissions</p>
                </div>

                {/* Filters */}
                <div className="glass rounded-xl p-6 mb-8">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-4"
                            />
                        </div>

                        {/* Role filter */}
                        <div className="flex gap-2">
                            {(['all', 'client', 'trainer', 'admin'] as const).map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setFilter(role)}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === role
                                            ? 'bg-gradient-to-r from-teal-6 to-teal-6 text-white'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Users table */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-4"></div>
                        <p className="mt-4 text-gray-400">Loading users...</p>
                    </div>
                ) : (
                    <div className="glass rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Joined</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-white">
                                                    {u.first_name} {u.last_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => updateUserRole(u.id, e.target.value as any)}
                                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(u.role)} bg-opacity-20 border-0 cursor-pointer`}
                                                >
                                                    <option value="client">Client</option>
                                                    <option value="trainer">Trainer</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${u.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                                    }`}>
                                                    {u.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleUserActivation(u.id, u.is_active)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${u.is_active
                                                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                        }`}
                                                >
                                                    {u.is_active ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredUsers.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                No users found matching your criteria.
                            </div>
                        )}
                    </div>
                )}

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-6 mt-8">
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl font-bold text-teal-4">{users.length}</div>
                        <div className="text-gray-400 mt-1">Total Users</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl font-bold text-blue-400">{users.filter(u => u.role === 'client').length}</div>
                        <div className="text-gray-400 mt-1">Clients</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl font-bold text-teal-400">{users.filter(u => u.role === 'trainer').length}</div>
                        <div className="text-gray-400 mt-1">Trainers</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl font-bold text-red-400">{users.filter(u => u.role === 'admin').length}</div>
                        <div className="text-gray-400 mt-1">Admins</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
