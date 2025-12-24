'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
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

export default function EditTemplatePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

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
        if (authLoading) return;
        if (!user) {
            router.push(`/login?redirect=/workouts/templates/${id}/edit`);
            return;
        }

        const fetchInitialData = async () => {
            try {
                const [templateRes, exercisesRes, workoutTypesRes, bodyFocusAreasRes] = await Promise.all([
                    apiClient.getWorkoutTemplate(id),
                    apiClient.getExercises(),
                    apiClient.getWorkoutTypes(),
                    apiClient.getBodyFocusAreas()
                ]);

                if (templateRes.data) {
                    setFormData({
                        name: templateRes.data.name,
                        description: templateRes.data.description || '',
                        workout_type_id: templateRes.data.workout_type_id || '',
                        estimated_duration_minutes: templateRes.data.estimated_duration_minutes || 60,
                        difficulty_level: templateRes.data.difficulty_level || 'Intermediate',
                        is_public: templateRes.data.is_public || false,
                    });
                    setSelectedExercises(templateRes.data.exercises || []);
                } else {
                    setError("Failed to load template data.");
                }

                setExercises(exercisesRes.data || []);
                setWorkoutTypes(workoutTypesRes.data || []);
                setBodyFocusAreas(bodyFocusAreasRes.data || []);

            } catch (err) {
                setError("An error occurred while loading data.");
                console.error(err);
            }
        };
        
        fetchInitialData();

    }, [id, user, authLoading, router]);

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
                exercises: selectedExercises
            };

            const response = await apiClient.updateWorkoutTemplate(id, body);

            if (response.error) {
                throw new Error(response.error);
            }

            router.push(`/workouts/templates/${id}`);
        } catch (error) {
            console.error('Error updating template:', error);
            setError(error instanceof Error ? error.message : 'Failed to update template.');
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
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-4">
                    <Link href={`/workouts/templates/${id}`} className="text-turquoise-surf hover:text-pacific-cyan inline-flex items-center gap-2">
                        ← Back to Template
                    </Link>
                </div>

                <h1 className="text-4xl font-bold mb-8">
                    Edit <span className="text-gradient">Workout Template</span>
                </h1>

                {error && (
                    <div className="glass rounded-xl p-4 mb-6 border border-red-400/20 bg-red-400/10">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="glass rounded-xl p-6">
                        <h2 className="text-2xl font-bold mb-4">Template Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white"
                                    rows={3}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Workout Type</label>
                                <select
                                    value={formData.workout_type_id}
                                    onChange={(e) => setFormData({ ...formData, workout_type_id: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white"
                                >
                                    <option value="">Select workout type</option>
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
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Difficulty</label>
                                    <select
                                        value={formData.difficulty_level}
                                        onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white"
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-xl p-6">
                        <h2 className="text-2xl font-bold mb-4">Exercises</h2>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                             <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Filter by Body Part</label>
                                <select
                                    value={bodyPartFilter}
                                    onChange={(e) => setBodyPartFilter(e.target.value)}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white"
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
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white"
                                />
                            </div>
                        </div>

                        {searchTerm && filteredExercises.length > 0 && (
                            <div className="max-h-64 overflow-y-auto space-y-2">
                                {filteredExercises.slice(0, 10).map((exercise) => (
                                    <button
                                        key={exercise.id}
                                        type="button"
                                        onClick={() => addExercise(exercise)}
                                        className="w-full text-left px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg"
                                    >
                                        {exercise.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {selectedExercises.length > 0 && (
                        <div className="glass rounded-xl p-6">
                             <h2 className="text-2xl font-bold mb-4">Selected Exercises ({selectedExercises.length})</h2>
                            <div className="space-y-3">
                                {selectedExercises.map((ex, index) => (
                                     <div
                                        key={ex.exercise_id}
                                        draggable
                                        onDragStart={() => handleDragStart(index)}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDrop={(e) => handleDrop(e, index)}
                                        className="bg-white/5 rounded-lg p-4 cursor-move"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold">{ex.exercise_name}</h3>
                                            <button
                                                type="button"
                                                onClick={() => removeExercise(ex.exercise_id)}
                                                className="text-red-400 hover:text-red-300 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div>
                                                <label className="text-xs text-gray-400">Sets</label>
                                                <input
                                                    type="number"
                                                    value={ex.suggested_sets || ''}
                                                    onChange={(e) => updateExercise(ex.exercise_id, 'suggested_sets', parseInt(e.target.value))}
                                                    className="w-full p-2 bg-black/50 border border-white/10 rounded text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-400">Reps</label>
                                                <input
                                                    type="number"
                                                    value={ex.suggested_reps || ''}
                                                    onChange={(e) => updateExercise(ex.exercise_id, 'suggested_reps', parseInt(e.target.value))}
                                                    className="w-full p-2 bg-black/50 border border-white/10 rounded text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-400">Weight (lbs)</label>
                                                <input
                                                    type="number"
                                                    value={ex.suggested_weight_lbs || ''}
                                                    onChange={(e) => updateExercise(ex.exercise_id, 'suggested_weight_lbs', parseInt(e.target.value))}
                                                    className="w-full p-2 bg-black/50 border border-white/10 rounded text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-400">Rest (sec)</label>
                                                <input
                                                    type="number"
                                                    value={ex.suggested_rest_seconds || ''}
                                                    onChange={(e) => updateExercise(ex.exercise_id, 'suggested_rest_seconds', parseInt(e.target.value))}
                                                    className="w-full p-2 bg-black/50 border border-white/10 rounded text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving || !formData.name || selectedExercises.length === 0}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-cerulean to-pacific-cyan rounded-lg disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
