'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

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
}

interface WorkoutType {
    id: string;
    name: string;
}

interface BodyFocusArea {
    id: string;
    name: string;
}

export default function ExerciseLibraryPage() {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([]);
    const [bodyFocusAreas, setBodyFocusAreas] = useState<BodyFocusArea[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWorkoutType, setSelectedWorkoutType] = useState('');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
            return;
        }
        fetchData();
    }, [isAuthenticated]);

    const fetchData = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

            // Fetch exercises
            const exercisesRes = await fetch(`${API_URL}/exercises`);
            const exercisesData = await exercisesRes.json();
            setExercises(exercisesData);

            // Fetch workout types
            const typesRes = await fetch(`${API_URL}/exercises/workout-types`);
            const typesData = await typesRes.json();
            setWorkoutTypes(typesData);

            // Fetch body focus areas
            const areasRes = await fetch(`${API_URL}/exercises/body-focus-areas`);
            const areasData = await areasRes.json();
            setBodyFocusAreas(areasData);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const filteredExercises = exercises.filter(exercise => {
        const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (exercise.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
        const matchesType = !selectedWorkoutType || exercise.workout_type_name === selectedWorkoutType;
        const matchesMuscle = !selectedMuscleGroup || exercise.muscle_group_name === selectedMuscleGroup;
        const matchesDifficulty = !selectedDifficulty || exercise.difficulty_level === selectedDifficulty;

        return matchesSearch && matchesType && matchesMuscle && matchesDifficulty;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading exercises...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Exercise Library</h1>
                    <p className="text-blue-200">Browse and search {exercises.length} exercises</p>
                </div>

                {/* Filters */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-blue-200 mb-2">Search</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search exercises..."
                                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Workout Type */}
                        <div>
                            <label className="block text-sm font-medium text-blue-200 mb-2">Workout Type</label>
                            <select
                                value={selectedWorkoutType}
                                onChange={(e) => setSelectedWorkoutType(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Types</option>
                                {workoutTypes.map(type => (
                                    <option key={type.id} value={type.name}>{type.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Muscle Group */}
                        <div>
                            <label className="block text-sm font-medium text-blue-200 mb-2">Muscle Group</label>
                            <select
                                value={selectedMuscleGroup}
                                onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Muscles</option>
                                {bodyFocusAreas.map(area => (
                                    <option key={area.id} value={area.name}>{area.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Difficulty */}
                        <div>
                            <label className="block text-sm font-medium text-blue-200 mb-2">Difficulty</label>
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Levels</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {(searchTerm || selectedWorkoutType || selectedMuscleGroup || selectedDifficulty) && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedWorkoutType('');
                                setSelectedMuscleGroup('');
                                setSelectedDifficulty('');
                            }}
                            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Results Count */}
                <div className="mb-4 text-blue-200">
                    Showing {filteredExercises.length} of {exercises.length} exercises
                </div>

                {/* Exercise Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredExercises.map(exercise => (
                        <div
                            key={exercise.id}
                            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:scale-105 cursor-pointer"
                        >
                            <h3 className="text-xl font-bold text-white mb-2">{exercise.name}</h3>

                            <div className="flex flex-wrap gap-2 mb-3">
                                {exercise.workout_type_name && (
                                    <span className="px-3 py-1 bg-blue-500/30 rounded-full text-xs text-blue-200">
                                        {exercise.workout_type_name}
                                    </span>
                                )}
                                {exercise.muscle_group_name && (
                                    <span className="px-3 py-1 bg-purple-500/30 rounded-full text-xs text-purple-200">
                                        {exercise.muscle_group_name}
                                    </span>
                                )}
                                {exercise.difficulty_level && (
                                    <span className={`px-3 py-1 rounded-full text-xs ${exercise.difficulty_level === 'Beginner' ? 'bg-green-500/30 text-green-200' :
                                            exercise.difficulty_level === 'Intermediate' ? 'bg-yellow-500/30 text-yellow-200' :
                                                'bg-red-500/30 text-red-200'
                                        }`}>
                                        {exercise.difficulty_level}
                                    </span>
                                )}
                            </div>

                            {exercise.description && (
                                <p className="text-blue-100 text-sm mb-3 line-clamp-2">{exercise.description}</p>
                            )}

                            {exercise.equipment_required && (
                                <div className="text-blue-200 text-sm mb-2">
                                    <span className="font-semibold">Equipment:</span> {exercise.equipment_required}
                                </div>
                            )}

                            {exercise.video_url && (
                                <a
                                    href={exercise.video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-2 text-blue-400 hover:text-blue-300 text-sm underline"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Watch Video
                                </a>
                            )}
                        </div>
                    ))}
                </div>

                {filteredExercises.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-blue-200 text-lg">No exercises found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
