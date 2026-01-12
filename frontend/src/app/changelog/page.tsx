'use client';

import { useState, useEffect } from 'react';
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

export default function ChangelogPage() {
    const [changelogs, setChangelogs] = useState<ChangelogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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
        fetchChangelogs();
    }, []);

    const getCategoryStyles = (category: string) => {
        switch (category) {
            case 'feature': return 'bg-dark-teal/50 text-turquoise-surf border-dark-teal';
            case 'fix': return 'bg-red-900/50 text-red-200 border-red-700';
            case 'improvement': return 'bg-blue-900/50 text-blue-200 border-blue-700';
            case 'security': return 'bg-purple-900/50 text-purple-200 border-purple-700';
            default: return 'bg-gray-800 text-gray-300 border-gray-700';
        }
    };

    if (isLoading) return <div className="min-h-screen bg-black p-8 text-white flex items-center justify-center">Loading updates...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-4 sm:p-8 pt-24">
            <div className="max-w-4xl mx-auto">
                <header className="flex flex-col items-center text-center gap-4 mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
                        What's New
                    </h1>
                    <p className="text-gray-400 max-w-lg">
                        Track the evolution of Tidal Power Fitness. We ship updates regularly to improve your training experience.
                    </p>
                </header>

                {error && (
                    <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-4 rounded-xl mb-8 text-center">
                        {error}
                    </div>
                )}

                <div className="relative">
                    {/* Vertical line for timeline */}
                    <div className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-pacific-cyan/50 via-gray-800 to-transparent sm:left-1/2 sm:-ml-[1px]" />

                    {changelogs.length === 0 ? (
                        <div className="text-center py-20 bg-gray-900/20 rounded-3xl border border-dashed border-white/10 relative z-10 backdrop-blur-sm">
                            <p className="text-gray-500">No public updates logged yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {changelogs.map((entry, index) => (
                                <div key={entry.id} className="relative flex flex-col sm:flex-row items-start animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
                                    {/* Timeline dot */}
                                    <div className="absolute left-[6px] top-1.5 w-3 h-3 rounded-full bg-pacific-cyan ring-4 ring-black z-10 sm:left-1/2 sm:-ml-1.5 shadow-[0_0_15px_rgba(6,182,212,0.6)]" />

                                    {/* Date & Meta (Left/Right alternating on desktop) */}
                                    <div className={`w-full sm:w-[45%] flex flex-col ${index % 2 === 0 ? 'sm:items-end sm:text-right' : 'sm:order-last sm:items-start sm:text-left'} pl-10 sm:pl-0`}>
                                        <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-1">
                                            <span className="text-xl font-bold font-mono text-turquoise-surf">v{entry.version}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getCategoryStyles(entry.category)}`}>
                                                {entry.category}
                                            </span>
                                        </div>
                                        <time className="text-xs text-gray-500 font-medium mb-3">
                                            {entry.published_at
                                                ? new Date(entry.published_at).toLocaleDateString(undefined, { 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                  })
                                                : 'Unpublished'}
                                        </time>
                                    </div>

                                    {/* Spacer */}
                                    <div className="hidden sm:block w-[10%]" />

                                    {/* Content Card */}
                                    <div className={`w-full sm:w-[45%] pl-10 sm:pl-0 group`}>
                                        <div className="bg-gray-900/40 hover:bg-gray-900/60 transition-colors border border-white/5 p-6 rounded-3xl backdrop-blur-sm">
                                            <h3 className="text-xl font-bold leading-tight mb-4 text-white group-hover:text-pacific-cyan transition-colors">{entry.title}</h3>
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
                    <Link href="/" className="btn-secondary">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
