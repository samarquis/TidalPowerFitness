'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface TemplateExercise {
    exercise_name: string;
    order_in_template: number;
    suggested_sets?: number;
    suggested_reps?: number;
    suggested_weight_lbs?: number;
    suggested_rest_seconds?: number;
    notes?: string;
}

interface WorkoutTemplate {
    id: string;
    trainer_id: string;
    name: string;
    description?: string;
    workout_type_name?: string;
    estimated_duration_minutes?: number;
    difficulty_level?: string;
    is_public: boolean;
    exercises: TemplateExercise[];
}

export default function TemplateDetailsPage() {
    const { user, token } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [template, setTemplate] = useState<WorkoutTemplate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params?.id) {
            fetchTemplate(params.id as string);
        }
    }, [params]);

    const fetchTemplate = async (id: string) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/workout-templates/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setTemplate(data);
        } catch (error) {
            console.error('Error fetching template:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this template?')) return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/workout-templates/${params.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete template');
            }

            router.push('/workouts/templates');
        } catch (error) {
            console.error('Error deleting template:', error);
            alert('Failed to delete template');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-4"></div>
                    <p className="mt-4 text-gray-400">Loading template...</p>
                </div>
            </div>
        );
    }

    if (!template) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-400 mb-4">Template not found</p>
                    <Link
                        href="/workouts/templates"
                        className="inline-block px-6 py-3 bg-gradient-to-r from-teal-6 to-teal-6 hover:from-teal-700 hover:to-teal-700 text-white font-bold rounded-lg"
                    >
                        Back to Templates
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/workouts/templates" className="text-teal-4 hover:text-teal-3 mb-4 inline-block">
                        ← Back to Templates
                    </Link>
                    <h1 className="text-4xl font-bold mb-4">{template.name}</h1>
                    {template.description && (
                        <p className="text-xl text-gray-300">{template.description}</p>
                    )}
                </div>

                {/* Template Info */}
                <div className="glass rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Template Info</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {template.difficulty_level && (
                            <div>
                                <div className="text-sm text-gray-400 mb-1">Difficulty</div>
                                <div className="font-semibold">{template.difficulty_level}</div>
                            </div>
                        )}
                        {template.estimated_duration_minutes && (
                            <div>
                                <div className="text-sm text-gray-400 mb-1">Duration</div>
                                <div className="font-semibold">{template.estimated_duration_minutes} minutes</div>
                            </div>
                        )}
                        <div>
                            <div className="text-sm text-gray-400 mb-1">Exercises</div>
                            <div className="font-semibold">{template.exercises?.length || 0} exercises</div>
                        </div>
                    </div>
                </div>

                {/* Exercises */}
                {template.exercises && template.exercises.length > 0 && (
                    <div className="glass rounded-xl p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-4">Exercises</h2>
                        <div className="space-y-4">
                            {template.exercises.map((exercise, index) => (
                                <div key={index} className="bg-white/5 rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <span className="text-gray-400 text-sm">#{exercise.order_in_template}</span>
                                            <h3 className="text-lg font-bold">{exercise.exercise_name}</h3>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                        {exercise.suggested_sets && (
                                            <div>
                                                <span className="text-gray-400">Sets:</span>{' '}
                                                <span className="font-semibold">{exercise.suggested_sets}</span>
                                            </div>
                                        )}
                                        {exercise.suggested_reps && (
                                            <div>
                                                <span className="text-gray-400">Reps:</span>{' '}
                                                <span className="font-semibold">{exercise.suggested_reps}</span>
                                            </div>
                                        )}
                                        {exercise.suggested_weight_lbs && (
                                            <div>
                                                <span className="text-gray-400">Weight:</span>{' '}
                                                <span className="font-semibold">{exercise.suggested_weight_lbs} lbs</span>
                                            </div>
                                        )}
                                        {exercise.suggested_rest_seconds && (
                                            <div>
                                                <span className="text-gray-400">Rest:</span>{' '}
                                                <span className="font-semibold">{exercise.suggested_rest_seconds}s</span>
                                            </div>
                                        )}
                                    </div>

                                    {exercise.notes && (
                                        <p className="mt-2 text-sm text-gray-400">{exercise.notes}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                    <Link
                        href={`/workouts/active?template=${template.id}`}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-6 to-teal-6 hover:from-teal-700 hover:to-teal-700 text-white font-bold rounded-lg text-lg transition-all text-center"
                    >
                        Start Workout
                    </Link>
                    {user?.id === template.trainer_id && (
                        <button
                            onClick={handleDelete}
                            className="px-6 py-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 font-bold rounded-lg transition-all"
                        >
                            Delete
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
