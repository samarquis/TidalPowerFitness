'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

interface Exercise {
    id: string;
    name: string;
    description?: string;
    muscle_group?: string;
    muscle_group_name?: string;
    primary_muscle_group?: string;
    difficulty_level?: string;
    equipment_required?: string;
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

interface WorkoutType {
    id: string;
    name: string;
}

interface BodyFocusArea {
    id: string;
    name: string;
}

export default function NewTemplatePage() {
    const { user, loading: authLoading, token } = useAuth();
    const router = useRouter();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([]);
    const [bodyFocusAreas, setBodyFocusAreas] = useState<BodyFocusArea[]>([]);
    const [selectedExercises, setSelectedExercises] = useState<TemplateExercise[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [bodyPartFilter, setBodyPartFilter] = useState<string>('all');
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        workout_type_id: '',
        estimated_duration_minutes: 60,
        difficulty_level: 'Intermediate',
        is_public: false
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Wait for auth to finish loading
        if (authLoading) return;

        // Redirect to login if not authenticated
        if (!user) {
            router.push('/login?redirect=/workouts/templates/new');
            return;
        }
        fetchExercises();
        fetchWorkoutTypes();
        fetchBodyFocusAreas();
    }, [user, authLoading, router]);

    const fetchExercises = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/exercises`, {
                credentials: 'include'
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

    const fetchWorkoutTypes = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/exercises/workout-types`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setWorkoutTypes(data);
            }
        } catch (error) {
            console.error('Error fetching workout types:', error);
        }
    };

    const fetchBodyFocusAreas = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/exercises/body-focus-areas`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setBodyFocusAreas(data);
            }
        } catch (error) {
            console.error('Error fetching body focus areas:', error);
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
        const filtered = selectedExercises.filter(e => e.exercise_id !== exerciseId);
        // Reorder remaining exercises
        const reordered = filtered.map((e, index) => ({ ...e, order_in_template: index + 1 }));
        setSelectedExercises(reordered);
    };

    const updateExercise = (exerciseId: string, field: keyof TemplateExercise, value: any) => {
        setSelectedExercises(selectedExercises.map(e =>
            e.exercise_id === exerciseId ? { ...e, [field]: value } : e
        ));
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) return;

        const newExercises = [...selectedExercises];
        const [draggedItem] = newExercises.splice(draggedIndex, 1);
        newExercises.splice(dropIndex, 0, draggedItem);

        // Update order_in_template for all exercises
        const reordered = newExercises.map((ex, index) => ({
            ...ex,
            order_in_template: index + 1
        }));

        setSelectedExercises(reordered);
        setDraggedIndex(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setSaving(true);
        setError(null);

        try {
            const body = {
                ...formData,
                trainer_id: user?.id,
                exercises: selectedExercises
            };

            const response = await apiClient.createWorkoutTemplate(body);

            if (response.error) {
                throw new Error(response.error);
            }

            router.push('/workouts/templates');
        } catch (error) {
            console.error('Error creating template:', error);
            setError(error instanceof Error ? error.message : 'Failed to create template. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const filteredExercises = exercises.filter(ex => {
        const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
        const notSelected = !selectedExercises.find(se => se.exercise_id === ex.id);
        const matchesBodyPart = bodyPartFilter === 'all' || ex.primary_muscle_group === bodyPartFilter;
        return matchesSearch && notSelected && matchesBodyPart;
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Navigation */}
                <div className="mb-4">
                    <Link href="/workouts/templates" className="text-teal-400 hover:text-teal-300 inline-flex items-center gap-2">
                        ← Back to Templates
                    </Link>
                </div>

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

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Workout Type</label>
                                <select
                                    value={formData.workout_type_id}
                                    onChange={(e) => setFormData({ ...formData, workout_type_id: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                >
                                    <option value="">Select workout type (optional)</option>
                                    {workoutTypes.map((type) => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
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

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Filter by Body Part</label>
                                <select
                                    value={bodyPartFilter}
                                    onChange={(e) => setBodyPartFilter(e.target.value)}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                >
                                    <option value="all">All Body Parts</option>
                                    {bodyFocusAreas.map((area) => (
                                        <option key={area.id} value={area.id}>{area.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Search Exercises</label>
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-4"
                                />
                            </div>
                        </div>

                        {(searchTerm || bodyPartFilter !== 'all') && filteredExercises.length > 0 && (
                            <div className="max-h-64 overflow-y-auto space-y-2">
                                {filteredExercises.slice(0, 20).map((exercise) => (
                                    <button
                                        key={exercise.id}
                                        type="button"
                                        onClick={() => addExercise(exercise)}
                                        className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="font-semibold">{exercise.name}</div>
                                                <div className="text-sm text-gray-400 mt-1">
                                                    {exercise.muscle_group_name || exercise.muscle_group}
                                                    {exercise.equipment_required && ` • ${exercise.equipment_required}`}
                                                </div>
                                            </div>
                                            {exercise.difficulty_level && (
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${exercise.difficulty_level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                                                    exercise.difficulty_level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {exercise.difficulty_level}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                        {(searchTerm || bodyPartFilter !== 'all') && filteredExercises.length === 0 && (
                            <p className="text-gray-400 text-center py-4">No exercises found</p>
                        )}
                    </div>

                    {/* Selected Exercises */}
                    {selectedExercises.length > 0 && (
                        <div className="glass rounded-xl p-6">
                            <h2 className="text-2xl font-bold mb-4">Selected Exercises ({selectedExercises.length})</h2>
                            <p className="text-sm text-gray-400 mb-4">💡 Drag exercises to reorder them</p>
                            <div className="space-y-3">
                                {selectedExercises.map((ex, index) => (
                                    <div
                                        key={ex.exercise_id}
                                        draggable
                                        onDragStart={() => handleDragStart(index)}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDrop={(e) => handleDrop(e, index)}
                                        className={`bg-white/5 rounded-lg p-4 cursor-move transition-all ${draggedIndex === index ? 'opacity-50 scale-95' : 'hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="text-2xl cursor-grab active:cursor-grabbing">⋮⋮</div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="text-gray-400 text-sm">#{index + 1}</span>
                                                        <h3 className="font-bold">{ex.exercise_name}</h3>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExercise(ex.exercise_id)}
                                                        className="text-red-400 hover:text-red-300 text-sm font-semibold"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 ml-8">
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Sets</label>
                                                <input
                                                    type="number"
                                                    value={ex.suggested_sets || ''}
                                                    onChange={(e) => updateExercise(ex.exercise_id, 'suggested_sets', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-teal-4"
                                                    min="1"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Reps</label>
                                                <input
                                                    type="number"
                                                    value={ex.suggested_reps || ''}
                                                    onChange={(e) => updateExercise(ex.exercise_id, 'suggested_reps', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-teal-4"
                                                    min="1"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Weight (lbs)</label>
                                                <input
                                                    type="number"
                                                    value={ex.suggested_weight_lbs || ''}
                                                    onChange={(e) => updateExercise(ex.exercise_id, 'suggested_weight_lbs', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-teal-4"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Rest (sec)</label>
                                                <input
                                                    type="number"
                                                    value={ex.suggested_rest_seconds || ''}
                                                    onChange={(e) => updateExercise(ex.exercise_id, 'suggested_rest_seconds', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-teal-4"
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
