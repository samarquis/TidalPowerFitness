'use client';

import { useState, useEffect, use } from 'react';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import Skeleton from '@/components/ui/Skeleton';

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

export default function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [program, setProgram] = useState<Program | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProgram();
    }, [id]);

    const fetchProgram = async () => {
        try {
            // Note: We'll use the trainer getById endpoint but it works for anyone if program is public
            const response = await apiClient.getProgram(id);
            if (response.data) {
                setProgram(response.data);
            }
        } catch (error) {
            console.error('Error fetching program:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
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
                    <Link href="/programs" className="btn-primary">Back to Programs</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black page-container">
            <div className="max-w-5xl mx-auto">
                <div className="mb-12">
                    <Link href="/programs" className="text-turquoise-surf hover:text-pacific-cyan mb-4 inline-block">
                        ← Back to Programs
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{program.name}</h1>
                    <div className="flex items-center gap-4 text-gray-400">
                        <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-turquoise-surf border border-turquoise-surf/20">
                            {program.total_weeks} Weeks
                        </span>
                        <span className="text-sm font-medium">Designed by Coach {program.trainer_name}</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1">
                        <div className="glass-card sticky top-24">
                            <h2 className="text-xl font-bold mb-4">Description</h2>
                            <p className="text-gray-400 leading-relaxed mb-8">
                                {program.description || 'No description provided.'}
                            </p>
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Ready to start?</h3>
                                <p className="text-xs text-gray-500 mb-6">Ask your trainer to assign this program to your profile to begin tracking progress.</p>
                                <Link href="/contact" className="btn-primary w-full text-center block py-3">Contact Trainer</Link>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-12">
                        {Array.from({ length: program.total_weeks }).map((_, wIndex) => {
                            const week = wIndex + 1;
                            const weekTemplates = program.templates.filter(t => t.week_number === week);
                            
                            return (
                                <div key={week}>
                                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-4">
                                        Week {week}
                                        <div className="h-px bg-white/10 flex-1"></div>
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                                            const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dayNum - 1];
                                            const dayTemplates = weekTemplates.filter(t => t.day_number === dayNum);

                                            return (
                                                <div key={dayNum} className="flex gap-6">
                                                    <div className="w-24 shrink-0">
                                                        <p className="text-[10px] font-bold text-gray-600 uppercase mt-1">{dayName}</p>
                                                    </div>
                                                    <div className="flex-1">
                                                        {dayTemplates.length > 0 ? (
                                                            <div className="space-y-3">
                                                                {dayTemplates.map((t, i) => (
                                                                    <div key={i} className="glass-card p-4 hover:border-turquoise-surf/20 transition-all">
                                                                        <h4 className="font-bold text-white">{t.template_name}</h4>
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
