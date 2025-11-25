'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Exercise {
    id: string;
    name: string;
    description?: string;
    muscle_group?: string;
}

interface TemplateExercise {
    exercise_id: string;
    exercise_name?: string;
    order_in_template: number;
    suggested_sets?: number;
    suggested_reps?: number;
    suggested_weight_lbs?: number;
    suggested_rest_seconds?: number;
    notes?: string;
}

export default function NewTemplatePage() {
    const { user, token } = useAuth();
    const router = useRouter();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [selectedExercises, setSelectedExercises] = useState<TemplateExercise[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        estimated_duration_minutes: 60,
        difficulty_level: 'Intermediate',
        is_public: false
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!user || !token) {
            router.push('/login');
            return;
        }
        fetchExercises();
    }, [user, token, router]);

    const fetchExercises = async () => {
        // Double-check token exists before making API call
        if (!token) {
            setError('Authentication required');
            return;
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/exercises`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch exercises: ${response.status}`);
            }

            const data = await response.json();
            setExercises(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching exercises:', error);
            setError('Failed to load exercises. Please try again later.');
        }
    };

    const addExercise = (exercise: Exercise) => {
        if (selectedExercises.find(e => e.exercise_id === exercise.id)) return;

        setSelectedExercises([...selectedExercises, {
            exercise_id: exercise.id,
            exercise_name: exercise.name,
            order_in_template: selectedExercises.length + 1,
            suggested_sets: 3,
            suggested_reps: 10,
            suggested_rest_seconds: 60
        }]);
        setSearchTerm('');
    };

    const removeExercise = (exerciseId: string) => {
        setSelectedExercises(selectedExercises.filter(e => e.exercise_id !== exerciseId));
    };

    const updateExercise = (exerciseId: string, field: keyof TemplateExercise, value: any) => {
        setSelectedExercises(selectedExercises.map(e =>
            e.exercise_id === exerciseId ? { ...e, [field]: value } : e
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setError('Authentication required. Please log in again.');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/workout-templates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    trainer_id: user?.id,
                    exercises: selectedExercises
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to create template: ${response.status}`);
            }

            router.push('/workouts/templates');
        } catch (error) {
            console.error('Error creating template:', error);
            setError(error instanceof Error ? error.message : 'Failed to create template. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const filteredExercises = exercises.filter(ex =>
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedExercises.find(se => se.exercise_id === ex.id)
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold mb-8">
                    Create <span className="text-gradient">Workout Template</span>
                </h1>

                {/* Error Banner */}
                {error && (
                    <div className="glass rounded-xl p-4 mb-6 border border-red-400/20 bg-red-400/10">
                        <div className="flex items-start gap-3">
                            <div className="text-red-400 text-2xl">⚠️</div>
                            <div className="flex-1">
                                <h3 className="font-bold text-red-400 mb-1">Error</h3>
                                <p className="text-gray-300">{error}</p>
                            </div>
                            <button
                                onClick={() => setError(null)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Template Details */}
                    <div className="glass rounded-xl p-6">
                        <h2 className="text-2xl font-bold mb-4">Template Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                    rows={3}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Duration (minutes)</label>
                                    <input
                                        type="number"
                                        value={formData.estimated_duration_minutes}
                                        onChange={(e) => setFormData({ ...formData, estimated_duration_minutes: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Difficulty Level</label>
                                    <select
                                        value={formData.difficulty_level}
                                        onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Exercise Selection */}
                    <div className="glass rounded-xl p-6">
                        <h2 className="text-2xl font-bold mb-4">Add Exercises</h2>
                        <input
                            type="text"
                            placeholder="Search exercises..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-4 mb-4"
                        />

                        {searchTerm && filteredExercises.length > 0 && (
                            <div className="max-h-48 overflow-y-auto space-y-2 mb-4">
                                {filteredExercises.slice(0, 10).map((exercise) => (
                                    <button
                                        key={exercise.id}
                                        type="button"
                                        onClick={() => addExercise(exercise)}
                                        className="w-full text-left px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                                    >
                                        <div className="font-semibold">{exercise.name}</div>
                                        {exercise.muscle_group && (
                                            <div className="text-sm text-gray-400">{exercise.muscle_group}</div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Selected Exercises */}
                    {selectedExercises.length > 0 && (
                        <div className="glass rounded-xl p-6">
                            <h2 className="text-2xl font-bold mb-4">Selected Exercises ({selectedExercises.length})</h2>
                            <div className="space-y-4">
                                {selectedExercises.map((ex, index) => (
                                    <div key={ex.exercise_id} className="bg-white/5 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <span className="text-gray-400 text-sm">#{index + 1}</span>
                                                <h3 className="font-bold">{ex.exercise_name}</h3>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeExercise(ex.exercise_id)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Sets</label>
                                                <input
                                                    type="number"
                                                    value={ex.suggested_sets || ''}
                                                    onChange={(e) => updateExercise(ex.exercise_id, 'suggested_sets', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-white text-sm"
                                                    min="1"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Reps</label>
                                                <input
                                                    type="number"
                                                    value={ex.suggested_reps || ''}
                                                    onChange={(e) => updateExercise(ex.exercise_id, 'suggested_reps', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-white text-sm"
                                                    min="1"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Weight (lbs)</label>
                                                <input
                                                    type="number"
                                                    value={ex.suggested_weight_lbs || ''}
                                                    onChange={(e) => updateExercise(ex.exercise_id, 'suggested_weight_lbs', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-white text-sm"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Rest (sec)</label>
                                                <input
                                                    type="number"
                                                    value={ex.suggested_rest_seconds || ''}
                                                    onChange={(e) => updateExercise(ex.exercise_id, 'suggested_rest_seconds', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-white text-sm"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving || !formData.name || selectedExercises.length === 0}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-6 to-teal-6 hover:from-teal-700 hover:to-teal-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Creating...' : 'Create Template'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
