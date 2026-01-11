'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Trainer {
    id: string;
    first_name: string;
    last_name: string;
    bio?: string;
    specialties?: string;
    certifications?: string;
    profile_image_url?: string;
}

export default function TrainerBiosSection() {
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrainers();
    }, []);

    const fetchTrainers = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/trainers`);
            const data = await response.json();
            // Ensure data is an array before using array methods
            if (Array.isArray(data)) {
                setTrainers(data.slice(0, 3)); // Show only first 3 trainers on home page
            } else {
                console.error('API returned non-array data:', data);
                setTrainers([]);
            }
        } catch (error) {
            console.error('Error fetching trainers:', error);
            setTrainers([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-20 bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">
                        Meet Our <span className="text-gradient">Expert Trainers</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Our certified trainers are passionate about helping you achieve your fitness goals.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
                        <p className="mt-4 text-gray-400">Loading trainers...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                            {trainers.map((trainer) => (
                                <div
                                    key={trainer.id}
                                    className="glass rounded-2xl p-6 hover:bg-white/10 transition-all transform hover:scale-105"
                                >
                                    {/* Profile Image */}
                                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-pacific-cyan to-turquoise-surf flex items-center justify-center text-4xl font-bold text-white">
                                        {trainer.profile_image_url ? (
                                            <img
                                                src={trainer.profile_image_url}
                                                alt={`${trainer.first_name} ${trainer.last_name}`}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            `${trainer.first_name[0]}${trainer.last_name[0]}`
                                        )}
                                    </div>

                                    {/* Name */}
                                    <h3 className="text-2xl font-bold text-center mb-2">
                                        {trainer.first_name} {trainer.last_name}
                                    </h3>

                                    {/* Specialties */}
                                    {trainer.specialties && (
                                        <p className="text-turquoise-surf text-center text-sm mb-3">
                                            {trainer.specialties}
                                        </p>
                                    )}

                                    {/* Bio excerpt */}
                                    {trainer.bio && (
                                        <p className="text-gray-400 text-sm text-center line-clamp-3">
                                            {trainer.bio}
                                        </p>
                                    )}

                                    {/* Certifications */}
                                    {trainer.certifications && (
                                        <div className="mt-4 pt-4 border-t border-gray-700">
                                            <p className="text-xs text-gray-500 text-center">
                                                {trainer.certifications}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="text-center">
                            <Link
                                href="/trainers"
                                className="inline-block px-8 py-4 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white font-bold rounded-lg text-lg transition-all transform hover:scale-105"
                            >
                                Meet All Our Trainers
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
