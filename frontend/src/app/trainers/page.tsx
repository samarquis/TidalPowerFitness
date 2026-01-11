'use client';

import { useEffect, useState, useMemo } from 'react';
import { apiClient } from '@/lib/api';
import { FilterBar, TrainerCard } from '@/components/ui';

interface Trainer {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    bio: string;
    specialties: string[];
    certifications: string[];
    years_experience: number;
    profile_image_url?: string;
    is_accepting_clients: boolean;
}

export default function TrainersPage() {
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeSort, setActiveSort] = useState('experience');

    useEffect(() => {
        const fetchTrainers = async () => {
            const response = await apiClient.getTrainers();
            if (response.data) {
                // Handle both { trainers: [...] } object and direct [...] array formats
                const trainersData = response.data.trainers || response.data;
                if (Array.isArray(trainersData)) {
                    setTrainers(trainersData);
                } else {
                    console.error('API returned non-array data:', response.data);
                    setTrainers([]);
                }
            }
            setLoading(false);
        };

        fetchTrainers();
    }, []);

    // Extract unique specialties from all trainers
    const allSpecialties = useMemo(() => {
        const specialtiesSet = new Set<string>();
        trainers.forEach(trainer => {
            trainer.specialties?.forEach(specialty => specialtiesSet.add(specialty));
        });
        return Array.from(specialtiesSet).sort();
    }, [trainers]);

    // Filter and sort trainers
    const filteredAndSortedTrainers = useMemo(() => {
        let result = [...trainers];

        // Apply filter
        if (activeFilter !== 'all') {
            result = result.filter(trainer =>
                trainer.specialties?.includes(activeFilter)
            );
        }

        // Apply sort
        switch (activeSort) {
            case 'experience':
                result.sort((a, b) => b.years_experience - a.years_experience);
                break;
            case 'name':
                result.sort((a, b) =>
                    `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
                );
                break;
            case 'availability':
                result.sort((a, b) => {
                    if (a.is_accepting_clients === b.is_accepting_clients) return 0;
                    return a.is_accepting_clients ? -1 : 1;
                });
                break;
        }

        return result;
    }, [trainers, activeFilter, activeSort]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pacific-cyan mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading our amazing trainers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">
                        Meet Our <span className="text-gradient">Elite Trainers</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Certified professionals dedicated to helping you achieve your fitness goals
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center gap-8 mt-8 text-sm">
                        <div>
                            <div className="text-2xl font-bold text-gradient">{trainers.length}</div>
                            <div className="text-gray-400">Expert Trainers</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gradient">
                                {trainers.filter(t => t.is_accepting_clients).length}
                            </div>
                            <div className="text-gray-400">Available Now</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gradient">{allSpecialties.length}</div>
                            <div className="text-gray-400">Specialties</div>
                        </div>
                    </div>
                </div>

                {/* Filter Bar */}
                <FilterBar
                    specialties={allSpecialties}
                    onFilterChange={setActiveFilter}
                    onSortChange={setActiveSort}
                    activeFilter={activeFilter}
                    activeSort={activeSort}
                />

                {/* Results count */}
                <div className="mb-6 text-gray-400 text-sm">
                    Showing {filteredAndSortedTrainers.length} of {trainers.length} trainers
                    {activeFilter !== 'all' && ` in ${activeFilter}`}
                </div>

                {/* Trainers Grid */}
                {filteredAndSortedTrainers.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-pacific-cyan/20 to-turquoise-surf/20 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-400 text-xl mb-2">No trainers found</p>
                        <p className="text-gray-500">Try adjusting your filters or check back soon!</p>
                        <button
                            onClick={() => setActiveFilter('all')}
                            className="mt-6 px-6 py-2 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white font-semibold rounded-lg transition-all"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredAndSortedTrainers.map((trainer) => (
                            <TrainerCard key={trainer.id} trainer={trainer} />
                        ))}
                    </div>
                )}

                {/* CTA Section */}
                <div className="mt-20 text-center glass rounded-2xl p-12">
                    <h2 className="text-3xl font-bold mb-4">
                        Can't Decide? <span className="text-gradient">We Can Help!</span>
                    </h2>
                    <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                        Not sure which trainer is right for you? Schedule a free consultation and we'll match you with the perfect trainer for your goals.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contact"
                            className="inline-block px-8 py-4 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white font-bold rounded-lg text-lg transition-all transform hover:scale-105"
                        >
                            Schedule Free Consultation
                        </a>
                        <a
                            href="tel:+1234567890"
                            className="inline-block px-8 py-4 glass hover:bg-white/10 text-white font-bold rounded-lg text-lg transition-all border border-white/20"
                        >
                            Call Us Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
