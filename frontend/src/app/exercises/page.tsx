'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface BodyPart {
    id: string;
    name: string;
}

interface BodyFocusArea {
    id: string;
    name: string;
    body_part_id?: string;
}

interface Exercise {
    id: string;
    name: string;
    difficulty_level?: string;
    equipment_required?: string;
    primary_muscle_group?: string;
    muscle_group_name?: string;
}

export default function ExerciseLibraryPage() {
    const [bodyParts, setBodyParts] = useState<BodyPart[]>([]);
    const [muscles, setMuscles] = useState<BodyFocusArea[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBodyPart, setSelectedBodyPart] = useState<string>('all');
    const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

            const [bodyPartsRes, musclesRes, exercisesRes] = await Promise.all([
                fetch(`${apiUrl}/exercises/body-parts`),
                fetch(`${apiUrl}/exercises/body-focus-areas`),
                fetch(`${apiUrl}/exercises`)
            ]);

            if (bodyPartsRes.ok) setBodyParts(await bodyPartsRes.json());
            if (musclesRes.ok) setMuscles(await musclesRes.json());
            if (exercisesRes.ok) setExercises(await exercisesRes.json());
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredMuscles = selectedBodyPart === 'all'
        ? muscles
        : muscles.filter(m => m.body_part_id === selectedBodyPart);

    const filteredExercises = exercises.filter(ex => {
        const matchesMuscle = !selectedMuscle || ex.primary_muscle_group === selectedMuscle;
        const matchesSearch = !searchTerm ||
            ex.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesMuscle && matchesSearch;
    });

    const getMuscleExerciseCount = (muscleId: string) => {
        return exercises.filter(ex => ex.primary_muscle_group === muscleId).length;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-bold mb-4">
                        Exercise <span className="text-gradient">Library</span>
                    </h1>
                    <p className="text-gray-400 text-lg mb-8">
                        Browse exercises by muscle group
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search exercises..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-6 py-4 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-turquoise-surf"
                        />
                    </div>
                </div>

                {/* Body Part Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <button
                        onClick={() => {
                            setSelectedBodyPart('all');
                            setSelectedMuscle(null);
                        }}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${selectedBodyPart === 'all'
                            ? 'bg-gradient-to-r from-cerulean to-pacific-cyan text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                    >
                        All Body Parts
                    </button>
                    {bodyParts.map((part) => (
                        <button
                            key={part.id}
                            onClick={() => {
                                setSelectedBodyPart(part.id);
                                setSelectedMuscle(null);
                            }}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${selectedBodyPart === part.id
                                ? 'bg-gradient-to-r from-cerulean to-pacific-cyan text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                }`}
                        >
                            {part.name}
                        </button>
                    ))}
                </div>

                {/* Muscle Group Grid */}
                {!selectedMuscle && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Select a Muscle Group</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredMuscles.map((muscle) => {
                                const count = getMuscleExerciseCount(muscle.id);
                                return (
                                    <button
                                        key={muscle.id}
                                        onClick={() => setSelectedMuscle(muscle.id)}
                                        className="glass rounded-xl p-6 hover:border-turquoise-surf transition-all group"
                                    >
                                        <div className="text-center">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pacific-cyan to-dark-teal rounded-full flex items-center justify-center text-3xl">
                                                💪
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-turquoise-surf transition-colors">
                                                {muscle.name}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                {count} exercise{count !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Exercise List */}
                {selectedMuscle && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">
                                {muscles.find(m => m.id === selectedMuscle)?.name} Exercises
                            </h2>
                            <button
                                onClick={() => setSelectedMuscle(null)}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                            >
                                ← Back to Muscle Groups
                            </button>
                        </div>

                        {filteredExercises.length === 0 ? (
                            <div className="glass rounded-xl p-12 text-center">
                                <p className="text-gray-400">No exercises found for this muscle group.</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredExercises.map((exercise) => (
                                    <Link
                                        key={exercise.id}
                                        href={`/exercises/${exercise.id}`}
                                        className="glass rounded-xl p-6 hover:border-teal-4 transition-all group"
                                    >
                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-turquoise-surf transition-colors">
                                            {exercise.name}
                                        </h3>
                                        <div className="space-y-2">
                                            {exercise.difficulty_level && (
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${exercise.difficulty_level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                                                        exercise.difficulty_level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-red-500/20 text-red-400'
                                                        }`}>
                                                        {exercise.difficulty_level}
                                                    </span>
                                                </div>
                                            )}
                                            {exercise.equipment_required && (
                                                <p className="text-sm text-gray-400">
                                                    Equipment: {exercise.equipment_required}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
