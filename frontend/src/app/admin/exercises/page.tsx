'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { CTAButton } from '@/components/ui';

interface Exercise {
    id: string;
    name: string;
    description?: string;
    workout_type_id?: string;
    workout_type_name?: string;
    primary_muscle_group?: string;
    muscle_group_name?: string;
    movement_pattern?: string;
    equipment_required?: string;
    difficulty_level?: string;
    video_url?: string;
    instructions?: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

interface WorkoutType {
    id: string;
    name: string;
    description?: string;
}

interface BodyFocusArea {
    id: string;
    name: string;
    description?: string;
    body_part_id?: string;
}

interface BodyPart {
    id: string;
    name: string;
    description?: string;
}

const PATTERNS = ['Push', 'Pull', 'Static', 'None'];

interface ExerciseFormData {
    name: string;
    description: string;
    workout_type_id: string;
    body_part_id: string;
    primary_muscle_group: string;
    movement_pattern: string;
    equipment_required: string;
    difficulty_level: string;
    video_url: string;
    instructions: string;
}

const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function AdminExercisesPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
    const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([]);
    const [bodyParts, setBodyParts] = useState<BodyPart[]>([]);
    const [bodyFocusAreas, setBodyFocusAreas] = useState<BodyFocusArea[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [workoutTypeFilter, setWorkoutTypeFilter] = useState<string>('all');
    const [bodyPartFilter, setBodyPartFilter] = useState<string>('all');
    const [muscleGroupFilter, setMuscleGroupFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const [formData, setFormData] = useState<ExerciseFormData>({
        name: '',
        description: '',
        workout_type_id: '',
        body_part_id: '',
        primary_muscle_group: '',
        movement_pattern: '',
        equipment_required: '',
        difficulty_level: '',
        video_url: '',
        instructions: ''
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ExerciseFormData, string>>>({});

    useEffect(() => {
        if (isAuthenticated && !user?.roles?.includes('admin') && !user?.roles?.includes('trainer')) {
            router.push('/');
            return;
        }

        if (isAuthenticated) {
            fetchExercises();
            fetchWorkoutTypes();
            fetchBodyParts();
            fetchBodyFocusAreas();
        }
    }, [isAuthenticated, user, router]);

    useEffect(() => {
        let filtered = exercises;

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(e =>
                statusFilter === 'active' ? e.is_active : !e.is_active
            );
        }

        // Filter by workout type
        if (workoutTypeFilter !== 'all') {
            filtered = filtered.filter(e => e.workout_type_id === workoutTypeFilter);
        }

        // Filter by body part
        if (bodyPartFilter !== 'all') {
            // Find muscles in this body part
            const musclesInPart = bodyFocusAreas.filter(m => m.body_part_id === bodyPartFilter).map(m => m.id);
            filtered = filtered.filter(e => e.primary_muscle_group && musclesInPart.includes(e.primary_muscle_group));
        }

        // Filter by muscle group
        if (muscleGroupFilter !== 'all') {
            filtered = filtered.filter(e => e.primary_muscle_group === muscleGroupFilter);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(e =>
                e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredExercises(filtered);
    }, [exercises, statusFilter, workoutTypeFilter, bodyPartFilter, muscleGroupFilter, searchTerm]);

    const fetchExercises = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

            const response = await fetch(`${apiUrl}/exercises`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setExercises(data);
                setFilteredExercises(data);
            }
        } catch (error) {
            console.error('Error fetching exercises:', error);
        } finally {
            setLoading(false);
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

    const fetchBodyParts = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

            const response = await fetch(`${apiUrl}/exercises/body-parts`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setBodyParts(data);
            }
        } catch (error) {
            console.error('Error fetching body parts:', error);
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

    const openCreateModal = () => {
        setEditingExercise(null);
        setFormData({
            name: '',
            description: '',
            workout_type_id: '',
            body_part_id: '',
            primary_muscle_group: '',
            movement_pattern: '',
            equipment_required: '',
            difficulty_level: '',
            video_url: '',
            instructions: ''
        });
        setErrors({});
        setCurrentStep(1);
        setShowModal(true);
    };

    const openEditModal = (exercise: Exercise) => {
        setEditingExercise(exercise);
        setFormData({
            name: exercise.name,
            description: exercise.description || '',
            workout_type_id: exercise.workout_type_id || '',
            body_part_id: bodyFocusAreas.find(b => b.id === exercise.primary_muscle_group)?.body_part_id || '',
            primary_muscle_group: exercise.primary_muscle_group || '',
            movement_pattern: exercise.movement_pattern || '',
            equipment_required: exercise.equipment_required || '',
            difficulty_level: exercise.difficulty_level || '',
            video_url: exercise.video_url || '',
            instructions: exercise.instructions || ''
        });
        setErrors({});
        setCurrentStep(1);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingExercise(null);
        setCurrentStep(1);
        setErrors({});
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Partial<Record<keyof ExerciseFormData, string>> = {};

        if (step === 1) {
            if (!formData.name.trim()) newErrors.name = 'Exercise name is required';
            if (!formData.difficulty_level) newErrors.difficulty_level = 'Difficulty level is required';
        } else if (step === 2) {
            if (!formData.workout_type_id) newErrors.workout_type_id = 'Workout type is required';
            if (!formData.body_part_id) newErrors.body_part_id = 'Body part is required';
            if (!formData.primary_muscle_group) newErrors.primary_muscle_group = 'Primary muscle group is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        if (!validateStep(2)) return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

            const url = editingExercise
                ? `${apiUrl}/exercises/${editingExercise.id}`
                : `${apiUrl}/exercises`;

            const method = editingExercise ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchExercises();
                closeModal();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to save exercise');
            }
        } catch (error) {
            console.error('Error saving exercise:', error);
            alert('Failed to save exercise');
        }
    };

    const toggleExerciseStatus = async (exerciseId: string, currentStatus: boolean) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

            const response = await fetch(`${apiUrl}/exercises/${exerciseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ is_active: !currentStatus })
            });

            if (response.ok) {
                fetchExercises();
            }
        } catch (error) {
            console.error('Error toggling exercise status:', error);
        }
    };

    if (!isAuthenticated || (!user?.roles?.includes('admin') && !user?.roles?.includes('trainer'))) {
        return null;
    }

    const activeExercises = exercises.filter(e => e.is_active);
    const inactiveExercises = exercises.filter(e => !e.is_active);

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Exercise <span className="text-gradient">Management</span>
                        </h1>
                        <p className="text-gray-400">Manage exercise library and classifications</p>
                    </div>
                    <CTAButton
                        onClick={openCreateModal}
                        variant="primary"
                        className="text-black font-bold"
                        icon={<span className="text-xl">+</span>}
                    >
                        Add New Exercise
                    </CTAButton>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl font-bold text-turquoise-surf">{exercises.length}</div>
                        <div className="text-gray-400 mt-1">Total Exercises</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl font-bold text-green-400">{activeExercises.length}</div>
                        <div className="text-gray-400 mt-1">Active</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl font-bold text-gray-400">{inactiveExercises.length}</div>
                        <div className="text-gray-400 mt-1">Inactive</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl font-bold text-blue-400">{workoutTypes.length}</div>
                        <div className="text-gray-400 mt-1">Workout Types</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="glass rounded-xl p-6 mb-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search exercises..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-turquoise-surf"
                        />

                        {/* Status filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-turquoise-surf"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active Only</option>
                            <option value="inactive">Inactive Only</option>
                        </select>

                        {/* Workout type filter */}
                        <select
                            value={workoutTypeFilter}
                            onChange={(e) => setWorkoutTypeFilter(e.target.value)}
                            className="px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-turquoise-surf"
                        >
                            <option value="all">All Workout Types</option>
                            {workoutTypes.map((type) => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>

                        {/* Body Part filter */}
                        <select
                            value={bodyPartFilter}
                            onChange={(e) => setBodyPartFilter(e.target.value)}
                            className="px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-turquoise-surf"
                        >
                        <option value="all">All Body Parts</option>
                        {bodyParts.map((part) => (
                            <option key={part.id} value={part.id}>{part.name}</option>
                        ))}
                    </select>

                    {/* Muscle group filter */}
                    <select
                        value={muscleGroupFilter}
                        onChange={(e) => setMuscleGroupFilter(e.target.value)}
                        className="px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-turquoise-surf"
                    >
                        <option value="all">All Muscle Groups</option>
                        {bodyFocusAreas
                            .filter(area => bodyPartFilter === 'all' || area.body_part_id === bodyPartFilter)
                            .map((area) => (
                                <option key={area.id} value={area.id}>{area.name}</option>
                            ))}
                    </select>
                </div>
            </div>

            {/* Exercises table */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
                    <p className="mt-4 text-gray-400">Loading exercises...</p>
                </div>
            ) : (
                                <>
                                    {/* Mobile Card View */}
                                    <div className="md:hidden space-y-4 mb-8">
                                        {filteredExercises.map((exercise) => (
                                            <div key={exercise.id} className="glass rounded-xl p-6 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-white">{exercise.name}</h3>
                                                        {exercise.description && (
                                                            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{exercise.description}</p>
                                                        )}
                                                    </div>
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${exercise.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                                        }`}>
                                                        {exercise.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <span className="text-gray-500 block text-xs uppercase tracking-wider">Type</span>
                                                        <span className="text-gray-300">{exercise.workout_type_name || '-'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 block text-xs uppercase tracking-wider">Muscle</span>
                                                        <span className="text-gray-300">{exercise.muscle_group_name || '-'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 block text-xs uppercase tracking-wider">Pattern</span>
                                                        <span className="text-gray-300">{exercise.movement_pattern || '-'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 block text-xs uppercase tracking-wider">Difficulty</span>
                                                        <span className={`font-semibold ${exercise.difficulty_level === 'Beginner' ? 'text-green-400' :
                                                            exercise.difficulty_level === 'Intermediate' ? 'text-yellow-400' :
                                                                exercise.difficulty_level === 'Advanced' ? 'text-red-400' : 'text-gray-400'
                                                            }`}>
                                                            {exercise.difficulty_level || '-'}
                                                        </span>
                                                    </div>
                                                </div>
                
                                                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                                                    <CTAButton
                                                        onClick={() => openEditModal(exercise)}
                                                        variant="secondary"
                                                        className="flex-1"
                                                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                                                    >
                                                        Edit
                                                    </CTAButton>
                                                    <CTAButton
                                                        onClick={() => toggleExerciseStatus(exercise.id, exercise.is_active)}
                                                        variant={exercise.is_active ? 'danger' : 'secondary'}
                                                        className="flex-1"
                                                        icon={exercise.is_active ? (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                                        ) : (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                        )}
                                                    >
                                                        {exercise.is_active ? 'Deactivate' : 'Activate'}
                                                    </CTAButton>
                                                </div>
                                            </div>
                                        ))}
                
                                        {filteredExercises.length === 0 && (
                                            <div className="text-center py-12 text-gray-400 glass rounded-xl">
                                                No exercises found matching your criteria.
                                            </div>
                                        )}
                                    </div>
                
                                    <div className="hidden md:block glass rounded-xl overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Exercise Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Workout Type</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Muscle Group</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Pattern</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Difficulty</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {filteredExercises.map((exercise) => (
                                    <tr key={exercise.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{exercise.name}</div>
                                            {exercise.description && (
                                                <div className="text-sm text-gray-400 mt-1 line-clamp-1">{exercise.description}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{exercise.workout_type_name || '-'}</td>
                                        <td className="px-6 py-4 text-gray-400">{exercise.muscle_group_name || '-'}</td>
                                        <td className="px-6 py-4">
                                            {exercise.movement_pattern ? (
                                                <span className="px-2 py-0.5 bg-turquoise-surf/10 text-turquoise-surf rounded text-[10px] font-bold uppercase border border-turquoise-surf/20">
                                                    {exercise.movement_pattern}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${exercise.difficulty_level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                                                exercise.difficulty_level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    exercise.difficulty_level === 'Advanced' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {exercise.difficulty_level || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${exercise.is_active
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {exercise.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <CTAButton
                                                    onClick={() => openEditModal(exercise)}
                                                    variant="secondary"
                                                    size="icon"
                                                    title="Edit Exercise"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </CTAButton>
                                                <CTAButton
                                                    onClick={() => toggleExerciseStatus(exercise.id, exercise.is_active)}
                                                    variant={exercise.is_active ? 'danger' : 'secondary'}
                                                    size="icon"
                                                    title={exercise.is_active ? 'Deactivate' : 'Activate'}
                                                >
                                                    {exercise.is_active ? (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </CTAButton>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                                        {filteredExercises.length === 0 && (
                                            <div className="text-center py-12 text-gray-400">
                                                No exercises found matching your criteria.  
                                            </div>
                                        )}
                                    </div>
                                    </>
                                )}        </div>

            {/* Modal */ }
    {
        showModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                <div className="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-8">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold">
                                {editingExercise ? 'Edit Exercise' : 'Create New Exercise'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* Progress Steps */}
                        <div className="flex justify-between mb-8">
                            {[1, 2, 3, 4].map((step) => (
                                <div key={step} className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= step
                                        ? 'bg-gradient-to-r from-turquoise-surf to-pacific-cyan text-black'
                                        : 'bg-white/10 text-gray-400'
                                        }`}>
                                        {step}
                                    </div>
                                    {step < 4 && (
                                        <div className={`w-16 h-1 mx-2 ${currentStep > step ? 'bg-turquoise-surf' : 'bg-white/10'
                                            }`}></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Step 1: Basic Info */}
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold mb-4">Basic Information</h3>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Exercise Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-turquoise-surf"
                                        placeholder="e.g., Barbell Squat"
                                    />
                                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-turquoise-surf"
                                        rows={4}
                                        placeholder="Describe the exercise..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Difficulty Level *</label>
                                    <select
                                        value={formData.difficulty_level}
                                        onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-turquoise-surf"
                                    >
                                        <option value="">Select difficulty</option>
                                        {DIFFICULTY_LEVELS.map((level) => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                    {errors.difficulty_level && <p className="text-red-400 text-sm mt-1">{errors.difficulty_level}</p>}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Classification */}
                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold mb-4">Classification</h3>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Workout Type *</label>
                                    <select
                                        value={formData.workout_type_id}
                                        onChange={(e) => setFormData({ ...formData, workout_type_id: e.target.value })}
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-turquoise-surf"
                                    >
                                        <option value="">Select workout type</option>
                                        {workoutTypes.map((type) => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                    {errors.workout_type_id && <p className="text-red-400 text-sm mt-1">{errors.workout_type_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Body Part *</label>
                                    <select
                                        value={formData.body_part_id}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                body_part_id: e.target.value,
                                                primary_muscle_group: '' // Reset muscle group when body part changes
                                            });
                                        }}
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-turquoise-surf"
                                    >
                                        <option value="">Select body part</option>
                                        {bodyParts.map((part) => (
                                            <option key={part.id} value={part.id}>{part.name}</option>
                                        ))}
                                    </select>
                                    {errors.body_part_id && <p className="text-red-400 text-sm mt-1">{errors.body_part_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Primary Muscle Group *</label>
                                    <select
                                        value={formData.primary_muscle_group}
                                        onChange={(e) => setFormData({ ...formData, primary_muscle_group: e.target.value })}
                                        disabled={!formData.body_part_id}
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-turquoise-surf disabled:opacity-50"
                                    >
                                        <option value="">Select muscle group</option>
                                        {bodyFocusAreas
                                            .filter(area => area.body_part_id === formData.body_part_id)
                                            .map((area) => (
                                                <option key={area.id} value={area.id}>{area.name}</option>
                                            ))}
                                    </select>
                                    {errors.primary_muscle_group && <p className="text-red-400 text-sm mt-1">{errors.primary_muscle_group}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Movement Pattern</label>
                                    <select
                                        value={formData.movement_pattern}
                                        onChange={(e) => setFormData({ ...formData, movement_pattern: e.target.value })}
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-turquoise-surf"
                                    >
                                        <option value="">Select pattern</option>
                                        {PATTERNS.map((pattern) => (
                                            <option key={pattern} value={pattern}>{pattern}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Equipment Required</label>
                                    <input
                                        type="text"
                                        value={formData.equipment_required}
                                        onChange={(e) => setFormData({ ...formData, equipment_required: e.target.value })}
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-turquoise-surf"
                                        placeholder="e.g., Barbell, Dumbbells, None"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Instructions */}
                        {currentStep === 3 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold mb-4">Instructions & Media</h3>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Instructions</label>
                                    <textarea
                                        value={formData.instructions}
                                        onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-turquoise-surf"
                                        rows={6}
                                        placeholder="Step-by-step instructions for performing the exercise..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Video URL</label>
                                    <input
                                        type="text"
                                        value={formData.video_url}
                                        onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-turquoise-surf"
                                        placeholder="https://youtube.com/..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Optional: Link to a demonstration video</p>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Review */}
                        {currentStep === 4 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold mb-4">Review & Confirm</h3>

                                <div className="glass rounded-lg p-6 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Exercise Name:</span>
                                        <span className="text-white font-semibold">{formData.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Difficulty:</span>
                                        <span className="text-white">{formData.difficulty_level}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Workout Type:</span>
                                        <span className="text-white">{workoutTypes.find(t => t.id === formData.workout_type_id)?.name || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Body Part:</span>
                                        <span className="text-white">{bodyParts.find(p => p.id === formData.body_part_id)?.name || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Muscle Group:</span>
                                        <span className="text-white">{bodyFocusAreas.find(a => a.id === formData.primary_muscle_group)?.name || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Equipment:</span>
                                        <span className="text-white">{formData.equipment_required || 'None'}</span>
                                    </div>
                                    {formData.description && (
                                        <div className="pt-3 border-t border-white/10">
                                            <span className="text-gray-400">Description:</span>
                                            <p className="text-white mt-2">{formData.description}</p>
                                        </div>
                                    )}
                                    {formData.instructions && (
                                        <div className="pt-3 border-t border-white/10">
                                            <span className="text-gray-400">Instructions:</span>
                                            <p className="text-white mt-2 whitespace-pre-wrap">{formData.instructions}</p>
                                        </div>
                                    )}
                                    {formData.video_url && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Video:</span>
                                            <a href={formData.video_url} target="_blank" rel="noopener noreferrer" className="text-turquoise-surf hover:underline">View</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Modal Actions */}
                        <div className="flex justify-between mt-8">
                            <CTAButton
                                onClick={currentStep === 1 ? closeModal : prevStep}
                                variant="secondary"
                            >
                                {currentStep === 1 ? 'Cancel' : 'Back'}
                            </CTAButton>

                            {currentStep < 4 ? (
                                <CTAButton
                                    onClick={nextStep}
                                    variant="primary"
                                    className="text-black font-bold"
                                >
                                    Next
                                </CTAButton>
                            ) : (
                                <CTAButton
                                    onClick={handleSubmit}
                                    variant="primary"
                                    className="text-black font-bold"
                                >
                                    {editingExercise ? 'Update Exercise' : 'Create Exercise'}
                                </CTAButton>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
        </div >
    );
}

