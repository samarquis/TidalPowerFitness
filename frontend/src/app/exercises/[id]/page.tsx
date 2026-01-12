'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import MuscleMap from '@/components/exercises/MuscleMap';

interface Exercise {
    id: string;
    name: string;
    description?: string;
    workout_type_name?: string;
    muscle_group_name?: string;
    equipment_required?: string;
    difficulty_level?: string;
    video_url?: string;
    image_url?: string;
    instructions?: string;
    is_active: boolean;
    secondary_muscle_groups?: Array<{ id: string; name: string }>;
}

export default function ExerciseDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params?.id) {
            fetchExercise(params.id as string);
        }
    }, [params]);

    const fetchExercise = async (id: string) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

            const response = await fetch(`${apiUrl}/exercises/${id}`);

            if (response.ok) {
                const data = await response.json();
                setExercise(data);
            } else {
                router.push('/exercises');
            }
        } catch (error) {
            console.error('Error fetching exercise:', error);
            router.push('/exercises');
        } finally {
            setLoading(false);
        }
    };

    const getYouTubeEmbedUrl = (url: string) => {
        if (!url) return null;

        // Extract video ID from various YouTube URL formats
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        if (match && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}`;
        }

        return url; // Return as-is if already an embed URL
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-4"></div>
            </div>
        );
    }

    if (!exercise) {
        return null;
    }

    const embedUrl = exercise.video_url ? getYouTubeEmbedUrl(exercise.video_url) : null;

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    href="/exercises"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Exercise Library
                </Link>

                {/* Exercise Header */}
                <div className="glass rounded-2xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {exercise.image_url && (
                            <div className="w-full md:w-1/3 shrink-0">
                                <img 
                                    src={exercise.image_url} 
                                    alt={exercise.name}
                                    className="w-full h-auto rounded-xl shadow-2xl border border-white/5"
                                />
                            </div>
                        )}
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold mb-4">{exercise.name}</h1>

                            <div className="flex flex-wrap gap-3 mb-6">
                                {exercise.difficulty_level && (
                                    <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${exercise.difficulty_level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                                        exercise.difficulty_level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                        }`}>
                                        {exercise.difficulty_level}
                                    </span>
                                )}
                                {exercise.muscle_group_name && (
                                    <span className="px-3 py-1 rounded-lg text-sm font-semibold bg-teal-500/20 text-teal-4">
                                        Primary: {exercise.muscle_group_name}
                                    </span>
                                )}
                                {exercise.secondary_muscle_groups?.map(mg => (
                                    <span key={mg.id} className="px-3 py-1 rounded-lg text-sm font-semibold bg-gray-500/20 text-gray-400 border border-white/5">
                                        Secondary: {mg.name}
                                    </span>
                                ))}
                                {exercise.workout_type_name && (
                                    <span className="px-3 py-1 rounded-lg text-sm font-semibold bg-blue-500/20 text-blue-400">
                                        {exercise.workout_type_name}
                                    </span>
                                )}
                            </div>

                            {exercise.description && (
                                <p className="text-gray-300 text-lg">{exercise.description}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    {/* Video Section */}
                    {embedUrl ? (
                        <div className="glass rounded-[2.5rem] p-8 flex flex-col h-full">
                            <h2 className="text-xl font-black uppercase tracking-tighter italic mb-6">Video <span className="text-turquoise-surf">Demonstration</span></h2>
                            <div className="aspect-video rounded-3xl overflow-hidden bg-black border border-white/5 shadow-2xl flex-1">
                                <iframe
                                    src={embedUrl}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    ) : (
                        <div className="glass rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center bg-white/[0.02]">
                            <div className="text-6xl mb-4 opacity-20">🎥</div>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No video demonstration available</p>
                        </div>
                    )}

                    {/* Anatomical Mapping */}
                    <MuscleMap 
                        primaryMuscle={exercise.muscle_group_name}
                        secondaryMuscles={exercise.secondary_muscle_groups?.map(m => m.name) || []}
                        className="h-full"
                    />
                </div>

                {/* Instructions & Equipment Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 glass rounded-[2.5rem] p-10 border-white/5">
                        <h2 className="text-xl font-black uppercase tracking-tighter italic mb-8">Tactical <span className="text-turquoise-surf">Instructions</span></h2>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-gray-400 whitespace-pre-wrap leading-loose text-sm font-medium">
                                {exercise.instructions || 'No specific instructions provided. Consult your trainer for proper form.'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="glass rounded-[2.5rem] p-8 border-white/5">
                            <h2 className="text-xl font-black uppercase tracking-tighter italic mb-6 text-white">Equipment</h2>
                            <p className="text-white text-lg font-bold uppercase tracking-tight">
                                {exercise.equipment_required || 'Bodyweight'}
                            </p>
                        </div>

                        <div className="glass rounded-[2.5rem] p-8 border-white/5">
                            <h2 className="text-xl font-black uppercase tracking-tighter italic mb-6 text-white">Focus</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Workout Type</p>
                                    <p className="text-white font-bold">{exercise.workout_type_name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Intensity Level</p>
                                    <p className="text-turquoise-surf font-bold">{exercise.difficulty_level || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
