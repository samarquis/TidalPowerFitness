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
    roles: string[];
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
    const isScottMarquis = user?.email === 'samarquis4@gmail.com';

    // Password Reset Modal State
    const [showResetModal, setShowResetModal] = useState(false);
    const [selectedUserForReset, setSelectedUserForReset] = useState<User | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetMessage, setResetMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        // Check if user is admin
        if (isAuthenticated && !user?.roles?.includes('admin')) {
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
            filtered = filtered.filter(u => u.roles.includes(filter));
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
            const token = localStorage.getItem('auth_token');

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

    const toggleUserRole = async (userId: string, role: string) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('auth_token');
            const user = users.find(u => u.id === userId);

            if (!user) return;

            const hasRole = user.roles.includes(role);

            if (hasRole) {
                // Remove role
                const response = await fetch(`${apiUrl}/users/${userId}/roles/${role}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    fetchUsers(); // Refresh the list
                }
            } else {
                // Add role
                const response = await fetch(`${apiUrl}/users/${userId}/roles`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ role })
                });

                if (response.ok) {
                    fetchUsers(); // Refresh the list
                }
            }
        } catch (error) {
            console.error('Error toggling role:', error);
        }
    };

    const toggleUserActivation = async (userId: string, currentStatus: boolean) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('auth_token');

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

    const handleResetPasswordClick = (user: User) => {
        setSelectedUserForReset(user);
        setNewPassword('');
        setResetMessage(null);
        setShowResetModal(true);
    };

    const handleResetPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserForReset || !newPassword) return;

        setResetLoading(true);
        setResetMessage(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('auth_token');

            const response = await fetch(`${apiUrl}/users/${selectedUserForReset.id}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ password: newPassword })
            });

            if (response.ok) {
                setResetMessage({ type: 'success', text: 'Password reset successfully' });
                setNewPassword('');
                setTimeout(() => {
                    setShowResetModal(false);
                    setResetMessage(null);
                }, 2000);
            } else {
                const data = await response.json();
                setResetMessage({ type: 'error', text: data.error || 'Failed to reset password' });
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setResetMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setResetLoading(false);
        }
    };

    const handleViewAsUser = (userToImpersonate: User) => {
        console.log(`Viewing as user: ${userToImpersonate.first_name} ${userToImpersonate.last_name} (${userToImpersonate.email})`);
        // TODO: Implement backend API call and context update for impersonation
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'trainer': return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
            default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        }
    };

    if (!isAuthenticated || !user?.roles?.includes('admin')) {
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
                                                <div className="flex gap-2">
                                                    {(['client', 'trainer', 'admin'] as const).map((role) => (
                                                        <label
                                                            key={role}
                                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${u.roles.includes(role)
                                                                ? getRoleBadgeColor(role)
                                                                : 'bg-white/5 text-gray-500 border-white/10 hover:bg-white/10'
                                                                }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={u.roles.includes(role)}
                                                                onChange={() => toggleUserRole(u.id, role)}
                                                                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-teal-500 focus:ring-teal-500 focus:ring-offset-gray-900"
                                                            />
                                                            <span className="text-sm font-semibold capitalize">{role}</span>
                                                        </label>
                                                    ))}
                                                </div>
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
                                                <button
                                                    onClick={() => handleResetPasswordClick(u)}
                                                    className="ml-2 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all"
                                                >
                                                    Reset Pwd
                                                </button>
                                                {isScottMarquis && (
                                                    <button
                                                        onClick={() => handleViewAsUser(u)}
                                                        className="ml-2 px-4 py-2 rounded-lg text-sm font-semibold bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all"
                                                    >
                                                        View as User
                                                    </button>
                                                )}
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
                        <div className="text-3xl font-bold text-blue-400">{users.filter(u => u.roles.includes('client')).length}</div>
                        <div className="text-gray-400 mt-1">Clients</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl font-bold text-teal-400">{users.filter(u => u.roles.includes('trainer')).length}</div>
                        <div className="text-gray-400 mt-1">Trainers</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl font-bold text-red-400">{users.filter(u => u.roles.includes('admin')).length}</div>
                        <div className="text-gray-400 mt-1">Admins</div>
                    </div>
                </div>
            </div>

            {/* Password Reset Modal */}
            {showResetModal && selectedUserForReset && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-2xl font-bold text-white">Reset Password</h3>
                            <button onClick={() => setShowResetModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
                        </div>

                        <p className="text-gray-300 mb-6">
                            Enter a new password for <span className="font-bold text-white">{selectedUserForReset.first_name} {selectedUserForReset.last_name}</span>.
                        </p>

                        <form onSubmit={handleResetPasswordSubmit}>
                            <div className="mb-6">
                                <label className="block text-gray-400 text-sm font-bold mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                    placeholder="Enter new password"
                                    minLength={6}
                                    required
                                />
                            </div>

                            {resetMessage && (
                                <div className={`p-3 rounded-lg mb-4 text-sm ${resetMessage.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {resetMessage.text}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowResetModal(false)}
                                    className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={resetLoading}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-6 to-teal-6 hover:from-teal-700 hover:to-teal-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {resetLoading ? 'Saving...' : 'Save Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
