'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

interface ProgramTemplate {
    template_id: string;
    template_name: string;
    week_number: number;
    day_number: number;
}

interface Program {
    id: string;
    name: string;
    description: string;
    total_weeks: number;
    trainer_name: string;
    templates: ProgramTemplate[];
}

export default function ProgramDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [program, setProgram] = useState<Program | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated || (!user?.roles?.includes('trainer') && !user?.roles?.includes('admin'))) {
            router.push('/trainer');
            return;
        }
        fetchProgram();
    }, [isAuthenticated, authLoading, id]);

    const fetchProgram = async () => {
        try {
            const response = await apiClient.getProgram(id);
            if (response.data) {
                setProgram(response.data);
            } else {
                setError(response.error || 'Failed to load program');
            }
        } catch (err) {
            console.error('Error fetching program:', err);
            setError('Failed to load program');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
            </div>
        );
    }

    if (!program) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Program not found</h2>
                    <Link href="/trainer/programs" className="btn-primary">Back to Programs</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black page-container">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <Link href="/trainer/programs" className="text-turquoise-surf hover:text-pacific-cyan mb-4 inline-block">
                            ← Back to Programs
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            {program.name}
                        </h1>
                        <div className="flex items-center gap-4 text-gray-400">
                            <span className="bg-white/5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                                {program.total_weeks} Week Routine
                            </span>
                            <span>Created by {program.trainer_name}</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Link href={`/trainer/programs/${id}/assign`} className="btn-primary">
                            Assign to Client
                        </Link>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Description */}
                    <div className="lg:col-span-1">
                        <div className="glass-card sticky top-24">
                            <h2 className="text-xl font-bold mb-4">About this Program</h2>
                            <p className="text-gray-400 leading-relaxed">
                                {program.description || 'No description provided.'}
                            </p>
                        </div>
                    </div>

                    {/* Right: Schedule */}
                    <div className="lg:col-span-2 space-y-12">
                        {Array.from({ length: program.total_weeks }).map((_, wIndex) => {
                            const week = wIndex + 1;
                            const weekTemplates = program.templates.filter(t => t.week_number === week);
                            
                            return (
                                <div key={week} className="glass-card">
                                    <h3 className="text-2xl font-bold text-turquoise-surf mb-8 border-b border-white/5 pb-4">Week {week}</h3>
                                    
                                    <div className="space-y-6">
                                        {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                                            const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dayNum - 1];
                                            const dayTemplates = weekTemplates.filter(t => t.day_number === dayNum);

                                            return (
                                                <div key={dayNum} className="flex gap-6 group">
                                                    <div className="w-24 shrink-0">
                                                        <p className="text-xs font-bold text-gray-500 uppercase mt-1">{dayName}</p>
                                                    </div>
                                                    <div className="flex-1">
                                                        {dayTemplates.length > 0 ? (
                                                            <div className="space-y-3">
                                                                {dayTemplates.map((t, i) => (
                                                                    <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-turquoise-surf/30 transition-all">
                                                                        <div className="flex justify-between items-center">
                                                                            <h4 className="font-bold text-white">{t.template_name}</h4>
                                                                            <Link 
                                                                                href={`/workouts/templates/${t.template_id}`}
                                                                                className="text-[10px] font-bold text-turquoise-surf uppercase hover:underline"
                                                                            >
                                                                                View Template
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="h-px bg-white/5 w-full mt-3"></div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
