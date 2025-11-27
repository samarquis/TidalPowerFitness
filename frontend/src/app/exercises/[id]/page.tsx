'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Exercise {
    id: string;
    name: string;
    description?: string;
    workout_type_name?: string;
    muscle_group_name?: string;
    equipment_required?: string;
    difficulty_level?: string;
    video_url?: string;
    instructions?: string;
    is_active: boolean;
}

export default function ExerciseDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params?.id) {
            fetchExercise();
        }
    }, [params]);

    const fetchExercise = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

            const response = await fetch(`${apiUrl}/exercises/${params.id}`);

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
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
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
                                {exercise.muscle_group_name}
                            </span>
                        )}
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

                {/* Video Section */}
                {embedUrl && (
                    <div className="glass rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-4">Video Demonstration</h2>
                        <div className="aspect-video rounded-lg overflow-hidden bg-black">
                            <iframe
                                src={embedUrl}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}

                {/* Instructions Section */}
                {exercise.instructions && (
                    <div className="glass rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-4">Instructions</h2>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {exercise.instructions}
                            </p>
                        </div>
                    </div>
                )}

                {/* Equipment & Details */}
                <div className="glass rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-4">Details</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 mb-2">Equipment Required</h3>
                            <p className="text-white text-lg">
                                {exercise.equipment_required || 'None'}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 mb-2">Primary Muscle</h3>
                            <p className="text-white text-lg">
                                {exercise.muscle_group_name || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 mb-2">Difficulty</h3>
                            <p className="text-white text-lg">
                                {exercise.difficulty_level || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 mb-2">Workout Type</h3>
                            <p className="text-white text-lg">
                                {exercise.workout_type_name || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
