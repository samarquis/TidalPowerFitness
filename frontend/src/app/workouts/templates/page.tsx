'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

interface WorkoutTemplate {
    id: string;
    trainer_id: string;
    name: string;
    description?: string;
    workout_type_name?: string;
    estimated_duration_minutes?: number;
    difficulty_level?: string;
    is_public: boolean;
    exercise_count?: number;
}

const DIFFICULTY_COLORS = {
    'Beginner': 'bg-green-500/20 text-green-400',
    'Intermediate': 'bg-yellow-500/20 text-yellow-400',
    'Advanced': 'bg-red-500/20 text-red-400'
};

export default function WorkoutTemplatesPage() {
    const { user, isAuthenticated, loading: authLoading, token } = useAuth();
    const router = useRouter();
    const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
    const [showAll, setShowAll] = useState(true); // Default to showing all

    useEffect(() => {
        if (authLoading) return;

        if (isAuthenticated && !user?.roles?.includes('trainer') && !user?.roles?.includes('admin')) {
            router.push('/');
            return;
        }

        if (isAuthenticated) {
            fetchTemplates();
        } else {
            router.push('/login?redirect=/workouts/templates');
        }
    }, [isAuthenticated, authLoading, user, router, showAll]); // Re-fetch when showAll changes

    const fetchTemplates = async () => {
        try {
            // If showAll is true, we ask for public ones too (default).
            // If false, we explicitly pass false.
            const response = await apiClient.getWorkoutTemplates(showAll);
            if (response.data) {
                const data = response.data;
                setTemplates(Array.isArray(data) ? data : (data.templates || []));
            } else if (response.error) {
                console.error('API Error fetching templates:', response.error);
                setTemplates([]);
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
            setTemplates([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this template?')) return;

        try {
            const response = await apiClient.deleteWorkoutTemplate(id);

            if (response.error) {
                throw new Error(response.error);
            }

            await fetchTemplates();
        } catch (error) {
            console.error('Error deleting template:', error);
            alert('Failed to delete template: ' + error);
        }
    };

    // Filter templates
    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDifficulty = difficultyFilter === 'all' || template.difficulty_level === difficultyFilter;
        return matchesSearch && matchesDifficulty;
    });

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16 flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-4"></div>
            </div>
        );
    }

    if (!isAuthenticated || (!user?.roles?.includes('trainer') && !user?.roles?.includes('admin'))) {
        return null;
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/" className="text-teal-400 hover:text-teal-300 mb-4 inline-block">
                        &larr; Back to Dashboard
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Workout <span className="text-gradient">Templates</span>
                    </h1>
                    <p className="text-xl text-gray-300">
                        Create and manage your workout templates
                    </p>
                </div>

                {/* Actions */}
                <div className="mb-8 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
                    <Link
                        href="/workouts/templates/new"
                        className="px-6 py-3 bg-gradient-to-r from-teal-6 to-teal-6 hover:from-teal-700 hover:to-teal-700 text-white font-bold rounded-lg transition-all transform hover:scale-105"
                    >
                        + Create Template
                    </Link>

                    <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto items-center">
                        <label className="flex items-center gap-2 text-white cursor-pointer bg-white/5 px-4 py-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                            <input
                                type="checkbox"
                                checked={showAll}
                                onChange={(e) => setShowAll(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-600 text-teal-600 focus:ring-teal-500"
                            />
                            <span>Show Shared/Admin Templates</span>
                        </label>

                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-4"
                        />
                        <select
                            value={difficultyFilter}
                            onChange={(e) => setDifficultyFilter(e.target.value)}
                            className="px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-turquoise-surf"
                        >
                            <option value="all">All Levels</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                </div>

                {/* Templates Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
                        <p className="mt-4 text-gray-400">Loading templates...</p>
                    </div>
                ) : filteredTemplates.length === 0 ? (
                    <div className="text-center py-20 glass rounded-2xl">
                        <p className="text-xl text-gray-400 mb-4">No templates found</p>
                        <Link
                            href="/workouts/templates/new"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white font-bold rounded-lg transition-all"
                        >
                            Create Your First Template
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTemplates.map((template) => {
                            const isOwner = template.trainer_id === user?.id;
                            const isShared = !isOwner;

                            return (
                                <div key={template.id} className={`glass rounded-xl p-6 hover:bg-white/10 transition-all relative ${isShared ? 'border-l-4 border-l-blue-500' : ''}`}>
                                    {isShared && (
                                        <div className="absolute top-4 right-4 bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/30">
                                            Unknown (Shared)
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-4 pr-16">
                                        <h3 className="text-xl font-bold text-white">{template.name}</h3>
                                    </div>

                                    <div className="flex gap-2 mb-4">
                                        {template.difficulty_level && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${DIFFICULTY_COLORS[template.difficulty_level as keyof typeof DIFFICULTY_COLORS] || 'bg-gray-500/20 text-gray-400'}`}>
                                                {template.difficulty_level}
                                            </span>
                                        )}
                                        {isShared && (
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-900/40 text-blue-300 border border-blue-800">
                                                Shared
                                            </span>
                                        )}
                                    </div>

                                    {template.description && (
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                            {template.description}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-400">
                                        {template.estimated_duration_minutes && (
                                            <span>⏱️ {template.estimated_duration_minutes} min</span>
                                        )}
                                        {template.exercise_count !== undefined && (
                                            <span>💪 {template.exercise_count} exercises</span>
                                        )}
                                        {template.workout_type_name && (
                                            <span>🏋️ {template.workout_type_name}</span>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            href={`/workouts/templates/${template.id}`}
                                            className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg text-sm font-semibold text-center transition-all"
                                        >
                                            View
                                        </Link>
                                        {isOwner && (
                                            <button
                                                onClick={() => handleDelete(template.id)}
                                                className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm font-semibold transition-all"
                                            >
                                                Delete
                                            </button>
                                        )}
                                        {!isOwner && (
                                            <button
                                                onClick={() => apiClient.copyWorkoutTemplate(template.id).then(() => { fetchTemplates(); alert('Template copied!') })}
                                                className="px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-sm font-semibold transition-all"
                                                title="Copy to my templates"
                                            >
                                                Copy
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
