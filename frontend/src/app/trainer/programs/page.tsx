'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import Skeleton from '@/components/ui/Skeleton';

interface Program {
    id: string;
    name: string;
    description: string;
    total_weeks: number;
    is_public: boolean;
    template_count: number;
    trainer_name: string;
}

export default function TrainerProgramsPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const clientId = searchParams ? searchParams.get('client') : null;
    
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (isAuthenticated && !user?.roles?.includes('trainer') && !user?.roles?.includes('admin')) {
            router.push('/');
            return;
        }

        if (isAuthenticated) {
            fetchPrograms();
        } else if (!isAuthenticated) {
            router.push('/login?redirect=/trainer/programs');
        }
    }, [isAuthenticated, authLoading, user, router]);

    const fetchPrograms = async () => {
        try {
            const response = await apiClient.getPrograms();
            if (response.data) {
                setPrograms(response.data);
            } else if (response.error) {
                setError(response.error);
            }
        } catch (err) {
            console.error('Error fetching programs:', err);
            setError('Failed to load programs');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black page-container">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <Link href="/trainer" className="text-turquoise-surf hover:text-pacific-cyan mb-4 inline-block">
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Workout <span className="text-gradient">Programs</span>
                        </h1>
                        <p className="text-gray-400 text-lg">Create and manage multi-week routines for your clients.</p>
                    </div>
                    <div>
                        <Link href="/trainer/programs/new" className="btn-primary">
                            + Create New Program
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8">
                        {error}
                    </div>
                )}

                {/* Programs Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-card h-64 animate-pulse">
                                <Skeleton className="h-8 w-3/4 mb-4" />
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-5/6 mb-8" />
                                <div className="flex justify-between mt-auto">
                                    <Skeleton className="h-10 w-1/3" />
                                    <Skeleton className="h-10 w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : programs.length === 0 ? (
                    <div className="glass-card py-20 text-center border-dashed">
                        <div className="text-5xl mb-6">🗓️</div>
                        <h3 className="text-2xl font-bold mb-2">No programs yet</h3>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            Programs allow you to group multiple workout templates into a scheduled routine (e.g., a 4-week strength block).
                        </p>
                        <Link href="/trainer/programs/new" className="btn-primary">
                            Create Your First Program
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {programs.map((program) => (
                            <div key={program.id} className="glass-card group hover:border-turquoise-surf/30 transition-all flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-white group-hover:text-turquoise-surf transition-colors">
                                        {program.name}
                                    </h3>
                                    <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                        {program.total_weeks} Weeks
                                    </span>
                                </div>
                                
                                <p className="text-sm text-gray-400 mb-6 line-clamp-3 flex-1">
                                    {program.description || 'No description provided.'}
                                </p>

                                <div className="flex items-center gap-4 mb-6 text-xs text-gray-500 font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <span className="text-turquoise-surf">📋</span> {program.template_count} Workouts
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="text-turquoise-surf">👤</span> {program.trainer_name}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Link 
                                        href={`/trainer/programs/${program.id}`}
                                        className="btn-secondary text-center py-2 text-sm"
                                    >
                                        View Details
                                    </Link>
                                    <Link 
                                        href={`/trainer/programs/${program.id}/assign${clientId ? `?client=${clientId}` : ''}`}
                                        className="btn-primary text-center py-2 text-sm"
                                    >
                                        Assign Client
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
