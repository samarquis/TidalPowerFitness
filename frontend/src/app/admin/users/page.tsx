'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';


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
    const { user, isAuthenticated, refreshUser } = useAuth();
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
            const response = await apiClient.getAllUsers();

            if (response.data) {
                setUsers(response.data.users);
                setFilteredUsers(response.data.users);
            } else {
                console.error('Error fetching users:', response.error);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserRole = async (userId: string, role: string) => {
        try {
            const user = users.find(u => u.id === userId);

            if (!user) return;

            const hasRole = user.roles.includes(role);
            let response;

            if (hasRole) {
                response = await apiClient.removeUserRole(userId, role);
            } else {
                response = await apiClient.addUserRole(userId, role);
            }

            if (response.data) {
                fetchUsers(); // Refresh the list
            } else {
                console.error('Error toggling role:', response.error);
            }
        } catch (error) {
            console.error('Error toggling role:', error);
        }
    };

    const toggleUserActivation = async (userId: string, currentStatus: boolean) => {
        try {
            const response = await apiClient.toggleUserActivation(userId, !currentStatus);

            if (response.data) {
                fetchUsers(); // Refresh the list
            } else {
                console.error('Error toggling activation:', response.error);
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
            const response = await apiClient.resetUserPassword(selectedUserForReset.id, newPassword);

            if (response.data) {
                setResetMessage({ type: 'success', text: 'Password reset successfully' });
                setNewPassword('');
                setTimeout(() => {
                    setShowResetModal(false);
                    setResetMessage(null);
                }, 2000);
            } else {
                setResetMessage({ type: 'error', text: response.error || 'Failed to reset password' });
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setResetMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setResetLoading(false);
        }
    };

    const handleViewAsUser = async (userToImpersonate: User) => {
        if (!confirm(`Are you sure you want to log in as ${userToImpersonate.first_name} ${userToImpersonate.last_name}?`)) {
            return;
        }

        try {
            const { data, error } = await apiClient.impersonateUser(userToImpersonate.id);

            if (data && data.token) {
                // Token is now set in HttpOnly cookie by backend
                // Refresh user state to reflect the new identity
                await refreshUser();
                router.push('/dashboard');
            } else {
                console.error('Impersonation failed:', error);
                alert(`Failed to impersonate user: ${error}`);
            }
        } catch (error) {
            console.error('Impersonation error:', error);
            alert('An error occurred while trying to impersonate user');
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'trainer': return 'bg-pacific-cyan/20 text-turquoise-surf border-pacific-cyan/30';
            default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        }
    };

    if (!isAuthenticated || !user?.roles?.includes('admin')) {
        return null;
    }

    return (
        <div className="min-h-screen bg-black page-container">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/admin" className="text-turquoise-surf hover:text-pacific-cyan mb-6 inline-flex items-center gap-2 font-bold uppercase tracking-wider text-xs transition-colors">
                        ← Back to Admin
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        User <span className="text-gradient">Management</span>
                    </h1>
                    <p className="text-xl text-gray-400">Manage user accounts, roles, and permissions</p>
                </div>

                {/* Filters */}
                <div className="glass-card mb-12">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">
                                    🔍
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-turquoise-surf transition-all"
                                />
                            </div>
                        </div>

                        {/* Role filter */}
                        <div className="flex flex-wrap gap-2">
                            {(['all', 'client', 'trainer', 'admin'] as const).map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setFilter(role)}
                                    className={`flex-1 sm:flex-none px-6 py-2 rounded-xl font-bold text-sm transition-all ${filter === role
                                        ? 'bg-gradient-to-r from-cerulean to-pacific-cyan text-white shadow-lg shadow-cerulean/20'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
                                        }`}
                                >
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Users Display */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
                        <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-xs">Loading users...</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block glass-card overflow-hidden mb-12 p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-white/5 border-b border-white/10 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                        <tr>
                                            <th className="px-6 py-5 text-left">User</th>
                                            <th className="px-6 py-5 text-left">Role</th>
                                            <th className="px-6 py-5 text-left">Status</th>
                                            <th className="px-6 py-5 text-left">Joined</th>
                                            <th className="px-6 py-5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredUsers.map((u) => (
                                            <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pacific-cyan to-cerulean flex items-center justify-center text-white font-bold shrink-0 shadow-lg">
                                                            {u.first_name[0]}{u.last_name[0]}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-bold text-white group-hover:text-turquoise-surf transition-colors">{u.first_name} {u.last_name}</div>
                                                            <div className="text-xs text-gray-500 truncate">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-wrap gap-2">
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
                                                                    className="w-3.5 h-3.5 rounded border-gray-600 bg-gray-700 text-pacific-cyan focus:ring-pacific-cyan focus:ring-offset-gray-900"
                                                                />
                                                                <span className="text-[10px] font-bold uppercase tracking-tighter">{role}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                                        }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${u.is_active ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-gray-400'}`}></span>
                                                        {u.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-sm font-medium text-gray-400">
                                                    {new Date(u.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => toggleUserActivation(u.id, u.is_active)}
                                                            className={`p-2.5 rounded-xl transition-all ${u.is_active
                                                                ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white'
                                                                : 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white'
                                                                }`}
                                                            title={u.is_active ? 'Deactivate' : 'Activate'}
                                                        >
                                                            {u.is_active ? '🚫' : '✅'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleResetPasswordClick(u)}
                                                            className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all"
                                                            title="Reset Password"
                                                        >
                                                            🔑
                                                        </button>
                                                        {u.roles.includes('trainer') && (
                                                            <Link
                                                                href={`/admin/trainers?edit=${u.id}`}
                                                                className="p-2.5 rounded-xl bg-turquoise-surf/10 text-turquoise-surf border border-turquoise-surf/20 hover:bg-turquoise-surf hover:text-white transition-all"
                                                                title="Edit Trainer Profile"
                                                            >
                                                                📝
                                                            </Link>
                                                        )}
                                                        {isScottMarquis && (
                                                            <button
                                                                onClick={() => handleViewAsUser(u)}
                                                                className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500 hover:text-white transition-all"
                                                                title="View as User"
                                                            >
                                                                👤
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-6 mb-12">
                            {filteredUsers.map((u) => (
                                <div key={u.id} className="glass-card group">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pacific-cyan to-cerulean flex items-center justify-center text-white font-bold shrink-0 shadow-xl border border-white/10">
                                                {u.first_name[0]}{u.last_name[0]}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-lg text-white group-hover:text-turquoise-surf transition-colors truncate">{u.first_name} {u.last_name}</div>
                                                <div className="text-xs text-gray-500 truncate">{u.email}</div>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                            }`}>
                                            {u.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Manage Roles</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {(['client', 'trainer', 'admin'] as const).map((role) => (
                                                    <label
                                                        key={role}
                                                        className={`flex items-center justify-center gap-2 px-2 py-2.5 rounded-xl border cursor-pointer transition-all ${u.roles.includes(role)
                                                            ? getRoleBadgeColor(role)
                                                            : 'bg-white/5 text-gray-500 border-white/10'
                                                            }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={u.roles.includes(role)}
                                                            onChange={() => toggleUserRole(u.id, role)}
                                                            className="hidden"
                                                        />
                                                        <span className="text-[10px] font-bold uppercase tracking-tighter">{role}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                            <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                                Joined {new Date(u.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => toggleUserActivation(u.id, u.is_active)}
                                                    className={`p-2.5 rounded-xl transition-all ${u.is_active
                                                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                        : 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                        }`}
                                                >
                                                    {u.is_active ? '🚫' : '✅'}
                                                </button>
                                                <button
                                                    onClick={() => handleResetPasswordClick(u)}
                                                    className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                                >
                                                    🔑
                                                </button>
                                                {u.roles.includes('trainer') && (
                                                    <Link
                                                        href={`/admin/trainers?edit=${u.id}`}
                                                        className="p-2.5 rounded-xl bg-turquoise-surf/10 text-turquoise-surf border border-turquoise-surf/20"
                                                    >
                                                        📝
                                                    </Link>
                                                )}
                                                {isScottMarquis && (
                                                    <button
                                                        onClick={() => handleViewAsUser(u)}
                                                        className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                                    >
                                                        👤
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredUsers.length === 0 && (
                            <div className="glass-card py-20 text-center text-gray-500 border-dashed mb-12">
                                No users found matching your criteria.
                            </div>
                        )}
                    </>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="glass-card">
                        <div className="text-2xl sm:text-4xl font-bold text-turquoise-surf">{users.length}</div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">Total Users</div>
                    </div>
                    <div className="glass-card">
                        <div className="text-2xl sm:text-4xl font-bold text-blue-400">{users.filter(u => u.roles.includes('client')).length}</div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">Clients</div>
                    </div>
                    <div className="glass-card">
                        <div className="text-2xl sm:text-4xl font-bold text-turquoise-surf">{users.filter(u => u.roles.includes('trainer')).length}</div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">Trainers</div>
                    </div>
                    <div className="glass-card">
                        <div className="text-2xl sm:text-4xl font-bold text-red-400">{users.filter(u => u.roles.includes('admin')).length}</div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">Admins</div>
                    </div>
                </div>
            </div>

            {/* Password Reset Modal */}
            {showResetModal && selectedUserForReset && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-white/10">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-2xl font-bold text-white">Reset Password</h3>
                            <button onClick={() => setShowResetModal(false)} className="text-gray-400 hover:text-white text-2xl transition-colors">×</button>
                        </div>

                        <p className="text-gray-300 mb-6">
                            Enter a new password for <span className="font-bold text-white underline decoration-turquoise-surf underline-offset-4">{selectedUserForReset.first_name} {selectedUserForReset.last_name}</span>.
                        </p>

                        <form onSubmit={handleResetPasswordSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-400 text-sm font-bold mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-turquoise-surf transition-all"
                                    placeholder="Enter new password"
                                    minLength={6}
                                    required
                                />
                            </div>

                            {resetMessage && (
                                <div className={`p-4 rounded-lg text-sm font-semibold animate-in fade-in slide-in-from-top-2 ${resetMessage.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/20'}`}>
                                    {resetMessage.text}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowResetModal(false)}
                                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg border border-white/10 transition-colors order-2 sm:order-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={resetLoading}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white font-bold rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-cerulean/20 order-1 sm:order-2"
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