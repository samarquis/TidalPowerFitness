'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import Link from 'next/link';

interface ChangelogEntry {
    id: string;
    version: string;
    tracking_number?: string;
    title: string;
    content: string;
    category: 'feature' | 'fix' | 'improvement' | 'security' | 'chore';
    is_published: boolean;
    published_at: string | null;
    created_at: string;
}

export default function AdminChangelogPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [changelogs, setChangelogs] = useState<ChangelogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        version: '',
        tracking_number: '',
        title: '',
        content: '',
        category: 'feature',
        is_published: true
    });

    useEffect(() => {
        if (!loading && (!user || !user.roles?.includes('admin'))) {
            router.push('/');
        }
    }, [user, loading, router]);

    const fetchChangelogs = async () => {
        setIsLoading(true);
        const response = await apiClient.getChangelogs();
        if (response.data) {
            setChangelogs(response.data.changelogs);
        } else {
            setError(response.error || 'Failed to fetch changelogs');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchChangelogs();
        };
        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const response = await apiClient.createChangelog(formData);
        if (response.data) {
            setShowForm(false);
            setFormData({ version: '', tracking_number: '', title: '', content: '', category: 'feature', is_published: true });
            fetchChangelogs();
        } else {
            setError(response.error || 'Failed to create changelog');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this entry?')) return;

        const response = await apiClient.deleteChangelog(id);
        if (response.data) {
            fetchChangelogs();
        } else {
            setError(response.error || 'Failed to delete entry');
        }
    };

    const getCategoryStyles = (category: string) => {
        switch (category) {
            case 'feature': return 'bg-dark-teal/50 text-turquoise-surf border-dark-teal';
            case 'fix': return 'bg-red-900/50 text-red-200 border-red-700';
            case 'improvement': return 'bg-blue-900/50 text-blue-200 border-blue-700';
            case 'security': return 'bg-purple-900/50 text-purple-200 border-purple-700';
            default: return 'bg-gray-800 text-gray-300 border-gray-700';
        }
    };

    if (loading || isLoading) return <div className="min-h-screen bg-black p-8 text-white">Loading...</div>;
    if (!user || !user.roles?.includes('admin')) return null;

    return (
        <div className="min-h-screen bg-black text-white p-4 sm:p-8 pt-24">
            <div className="max-w-4xl mx-auto">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                            System Changelog
                        </h1>
                        <p className="text-gray-400 mt-2">Track application updates and infrastructure improvements.</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-5 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all flex items-center gap-2"
                    >
                        {showForm ? 'Cancel' : 'Add New Update'}
                    </button>
                </header>

                {error && (
                    <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-4 rounded-xl mb-8 flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                {showForm && (
                    <section className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h2 className="text-xl font-bold mb-6">Create New Release Note</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Version</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 1.2.0"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
                                        value={formData.version}
                                        onChange={e => setFormData({ ...formData, version: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tracking #</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. ISSUE-123"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
                                        value={formData.tracking_number}
                                        onChange={e => setFormData({ ...formData, tracking_number: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                                    <select
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                                    >
                                        <option value="feature">Feature</option>
                                        <option value="fix">Bug Fix</option>
                                        <option value="improvement">Improvement</option>
                                        <option value="security">Security</option>
                                        <option value="chore">Internal / Chore</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label>
                                <input
                                    type="text"
                                    placeholder="Enter a descriptive title"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Content (Supports Markdown-lite)</label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe the changes..."
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="published"
                                    className="w-4 h-4 rounded border-white/10 bg-black"
                                    checked={formData.is_published}
                                    onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                                />
                                <label htmlFor="published" className="text-sm text-gray-300">Publish immediately</label>
                            </div>
                            <button type="submit" className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white font-bold rounded-xl transition-all">
                                Save Release Note
                            </button>
                        </form>
                    </section>
                )}

                <div className="relative">
                    {/* Vertical line for timeline */}
                    <div className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-pacific-cyan/50 via-gray-800 to-transparent sm:left-1/2 sm:-ml-[1px]" />

                    {changelogs.length === 0 ? (
                        <div className="text-center py-20 bg-gray-900/20 rounded-3xl border border-dashed border-white/10">
                            <p className="text-gray-500">No updates logged yet. Start by adding your first release note!</p>
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {changelogs.map((entry, index) => (
                                <div key={entry.id} className="relative flex flex-col sm:flex-row items-start">
                                    {/* Timeline dot */}
                                    <div className="absolute left-[6px] top-1.5 w-3 h-3 rounded-full bg-pacific-cyan ring-4 ring-black z-10 sm:left-1/2 sm:-ml-1.5" />

                                    <div className={`w-full sm:w-[45%] flex flex-col ${index % 2 === 0 ? 'sm:items-end sm:text-right' : 'sm:order-last sm:items-start sm:text-left'} pl-10 sm:pl-0`}>
                                        <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-1">
                                            <span className="text-xl font-bold font-mono text-turquoise-surf">v{entry.version}</span>
                                            {entry.tracking_number && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-white/10 text-white border border-white/10">
                                                    #{entry.tracking_number}
                                                </span>
                                            )}
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getCategoryStyles(entry.category)}`}>
                                                {entry.category}
                                            </span>
                                            {!entry.is_published && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border bg-gray-900 text-gray-500 border-gray-800">
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                        <time className="text-xs text-gray-500 font-medium mb-3">
                                            {entry.published_at
                                                ? new Date(entry.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                                                : 'Unpublished'}
                                        </time>
                                    </div>

                                    <div className="hidden sm:block w-[10%]" />

                                    <div className={`w-full sm:w-[45%] pl-10 sm:pl-0 group`}>
                                        <div className="bg-gray-900/40 hover:bg-gray-900/60 transition-colors border border-white/5 p-6 rounded-3xl">
                                            <div className="flex justify-between items-start gap-4 mb-4">
                                                <h3 className="text-xl font-bold leading-tight">{entry.title}</h3>
                                                <button
                                                    onClick={() => handleDelete(entry.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-600 hover:text-red-400 transition-all"
                                                    title="Delete entry"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                            <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                                                {entry.content}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-20 pt-10 border-t border-white/5 flex justify-center">
                    <Link href="/admin" className="text-turquoise-surf hover:text-pacific-cyan text-sm font-semibold transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Admin Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
