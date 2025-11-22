'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import Link from 'next/link';

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

    useEffect(() => {
        const fetchTrainers = async () => {
            const response = await apiClient.getTrainers();
            if (response.data) {
                setTrainers(response.data.trainers || []);
            }
            setLoading(false);
        };

        fetchTrainers();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4">
                        Meet Our <span className="text-gradient">Elite Trainers</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Certified professionals dedicated to helping you achieve your fitness goals
                    </p>
                </div>

                {/* Trainers Grid */}
                {trainers.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-xl">No trainers available at the moment.</p>
                        <p className="text-gray-500 mt-2">Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {trainers.map((trainer) => (
                            <div
                                key={trainer.id}
                                className="glass rounded-2xl overflow-hidden hover:bg-white/10 transition-all transform hover:scale-105"
                            >
                                {/* Trainer Image */}
                                <div className="h-64 bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                                    {trainer.profile_image_url ? (
                                        <img
                                            src={trainer.profile_image_url}
                                            alt={`${trainer.first_name} ${trainer.last_name}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-white text-6xl font-bold">
                                            {trainer.first_name?.[0]}{trainer.last_name?.[0]}
                                        </div>
                                    )}
                                </div>

                                {/* Trainer Info */}
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold mb-2">
                                        {trainer.first_name} {trainer.last_name}
                                    </h3>
                                    <p className="text-gray-400 mb-4 line-clamp-3">{trainer.bio}</p>

                                    {/* Specialties */}
                                    {trainer.specialties && trainer.specialties.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-gray-500 mb-2">Specialties</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {trainer.specialties.map((specialty, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-cyan-600/20 text-cyan-400 rounded-full text-sm"
                                                    >
                                                        {specialty}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Experience */}
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                        <span>{trainer.years_experience} years experience</span>
                                        {trainer.is_accepting_clients && (
                                            <span className="text-green-400">● Accepting clients</span>
                                        )}
                                    </div>

                                    {/* CTA */}
                                    <Link
                                        href="/contact"
                                        className="block w-full text-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all"
                                    >
                                        Book Session
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
