'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import Skeleton from '@/components/ui/Skeleton';

interface Program {
    id: string;
    name: string;
    description: string;
    total_weeks: number;
    template_count: number;
    trainer_name: string;
}

export default function ProgramsListingPage() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPublicPrograms();
    }, []);

    const fetchPublicPrograms = async () => {
        try {
            const response = await apiClient.getPublicPrograms();
            if (response.data) {
                setPrograms(response.data);
            }
        } catch (error) {
            console.error('Error fetching public programs:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black page-container">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Training <span className="text-gradient">Programs</span>
                    </h1>
                    <p className="text-gray-400 text-lg">Structured multi-week routines designed by our expert coaches.</p>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-card h-64 animate-pulse">
                                <Skeleton className="h-8 w-3/4 mb-4" />
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        ))}
                    </div>
                ) : programs.length === 0 ? (
                    <div className="text-center py-20 glass-card border-dashed">
                        <p className="text-gray-500">No public programs available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {programs.map((program) => (
                            <div key={program.id} className="glass-card hover:border-turquoise-surf/30 transition-all flex flex-col group">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-turquoise-surf transition-colors mb-2">{program.name}</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                                            {program.total_weeks} Weeks
                                        </span>
                                        <span className="text-[10px] font-bold text-turquoise-surf uppercase tracking-widest bg-turquoise-surf/10 px-2 py-1 rounded">
                                            {program.template_count} Workouts
                                        </span>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-sm mb-8 line-clamp-3 flex-1">
                                    {program.description || 'No description provided.'}
                                </p>

                                <div className="border-t border-white/5 pt-6 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cerulean to-pacific-cyan flex items-center justify-center text-[10px] font-bold text-white">
                                            {program.trainer_name[0]}
                                        </div>
                                        <span className="text-xs text-gray-500 font-medium">Coach {program.trainer_name}</span>
                                    </div>
                                    <Link 
                                        href={`/programs/${program.id}`}
                                        className="text-sm font-bold text-turquoise-surf hover:underline"
                                    >
                                        Learn More →
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
