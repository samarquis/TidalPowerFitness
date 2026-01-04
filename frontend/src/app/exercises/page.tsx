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
    movement_pattern?: string;
}

export default function ExerciseLibraryPage() {
    const [bodyParts, setBodyParts] = useState<BodyPart[]>([]);
    const [muscles, setMuscles] = useState<BodyFocusArea[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBodyPart, setSelectedBodyPart] = useState<string>('all');
    const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
    const [selectedPattern, setSelectedPattern] = useState<string>('all');
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

    // Primary filtering logic
    const filteredExercises = exercises.filter(ex => {
        // Filter by Muscle (if selected)
        const matchesMuscle = !selectedMuscle || ex.primary_muscle_group === selectedMuscle;
        
        // Filter by Pattern (if selected)
        const matchesPattern = selectedPattern === 'all' || ex.movement_pattern === selectedPattern;
        
        // Filter by Body Part (if muscle not selected, but body part is)
        // If muscle is selected, body part is implicit. If not, check body part of the muscle group.
        let matchesBodyPart = true;
        if (!selectedMuscle && selectedBodyPart !== 'all') {
            const muscle = muscles.find(m => m.id === ex.primary_muscle_group);
            matchesBodyPart = muscle?.body_part_id === selectedBodyPart;
        }

        const matchesSearch = !searchTerm ||
            ex.name.toLowerCase().includes(searchTerm.toLowerCase());
            
        return matchesMuscle && matchesPattern && matchesBodyPart && matchesSearch;
    });

    const getMuscleExerciseCount = (muscleId: string) => {
        return exercises.filter(ex => ex.primary_muscle_group === muscleId).length;
    };

    const shouldShowExerciseList = selectedMuscle || selectedPattern !== 'all' || searchTerm;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16 page-container">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-5xl font-bold mb-4">
                        Exercise <span className="text-gradient">Library</span>
                    </h1>
                    <p className="text-gray-400 text-lg mb-8">
                        Browse exercises by muscle group or movement pattern
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative">
                            <svg className="absolute left-4 top-4 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input
                                type="text"
                                placeholder="Search exercises..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-turquoise-surf transition-colors"
                            />
                        </div>
                    </div>

                    {/* Global Filters */}
                    <div className="flex flex-col gap-4 items-center">
                        {/* Row 1: Body Parts */}
                        <div className="flex flex-wrap justify-center gap-2">
                            <button
                                onClick={() => {
                                    setSelectedBodyPart('all');
                                    setSelectedMuscle(null);
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all border ${selectedBodyPart === 'all'
                                    ? 'bg-pacific-cyan/20 text-pacific-cyan border-pacific-cyan'
                                    : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10'
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
                                    className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all border ${selectedBodyPart === part.id
                                        ? 'bg-pacific-cyan/20 text-pacific-cyan border-pacific-cyan'
                                        : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10'
                                        }`}
                                >
                                    {part.name}
                                </button>
                            ))}
                        </div>

                        {/* Row 2: Movement Patterns */}
                        <div className="flex flex-wrap justify-center gap-2">
                            <button
                                onClick={() => setSelectedPattern('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all border ${selectedPattern === 'all'
                                    ? 'bg-turquoise-surf/20 text-turquoise-surf border-turquoise-surf'
                                    : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10'
                                    }`}
                            >
                                All Movements
                            </button>
                            {['Push', 'Pull', 'Legs'].map((pattern) => (
                                <button
                                    key={pattern}
                                    onClick={() => setSelectedPattern(pattern)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all border ${selectedPattern === pattern
                                        ? 'bg-turquoise-surf/20 text-turquoise-surf border-turquoise-surf'
                                        : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10'
                                        }`}
                                >
                                    {pattern}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                
                {/* 1. Muscle Group Grid (Only show if NO specific filtering active besides body part) */}
                {!shouldShowExerciseList && (
                    <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-2">Select a Muscle Group</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredMuscles.map((muscle) => {
                                const count = getMuscleExerciseCount(muscle.id);
                                return (
                                    <button
                                        key={muscle.id}
                                        onClick={() => setSelectedMuscle(muscle.id)}
                                        className="glass rounded-xl p-6 hover:border-turquoise-surf transition-all group text-left"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 mb-4 bg-gradient-to-br from-pacific-cyan/20 to-dark-teal/20 rounded-full flex items-center justify-center text-3xl border border-white/10 group-hover:scale-110 transition-transform">
                                                💪
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-turquoise-surf transition-colors">
                                                {muscle.name}
                                            </h3>
                                            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                                {count} exercises
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 2. Exercise List (Show if muscle selected, OR pattern selected, OR searching) */}
                {shouldShowExerciseList && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                            <h2 className="text-2xl font-bold">
                                {selectedMuscle 
                                    ? `${muscles.find(m => m.id === selectedMuscle)?.name} Exercises`
                                    : `Exercises (${filteredExercises.length})`}
                            </h2>
                            
                            {(selectedMuscle || selectedPattern !== 'all' || searchTerm) && (
                                <button
                                    onClick={() => {
                                        setSelectedMuscle(null);
                                        setSelectedPattern('all');
                                        setSearchTerm('');
                                    }}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-sm font-semibold flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    Clear Filters
                                </button>
                            )}
                        </div>

                        {filteredExercises.length === 0 ? (
                            <div className="glass rounded-xl p-12 text-center border border-dashed border-gray-700">
                                <div className="text-4xl mb-4 opacity-30">🔍</div>
                                <p className="text-gray-400 text-lg">No exercises found matching your filters.</p>
                                <button 
                                    onClick={() => {
                                        setSelectedMuscle(null);
                                        setSelectedPattern('all');
                                        setSearchTerm('');
                                        setSelectedBodyPart('all');
                                    }}
                                    className="mt-4 text-turquoise-surf hover:underline font-bold uppercase tracking-wider text-sm"
                                >
                                    Reset All
                                </button>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredExercises.map((exercise) => (
                                    <Link
                                        key={exercise.id}
                                        href={`/exercises/${exercise.id}`}
                                        className="glass rounded-xl p-6 hover:border-turquoise-surf transition-all group flex flex-col h-full"
                                    >
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-turquoise-surf transition-colors line-clamp-1">
                                                {exercise.name}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                                {exercise.difficulty_level && (
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${exercise.difficulty_level === 'Beginner' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                        exercise.difficulty_level === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                            'bg-red-500/10 text-red-400 border-red-500/20'
                                                        }`}>
                                                        {exercise.difficulty_level}
                                                    </span>
                                                )}
                                                {exercise.movement_pattern && (
                                                    <span className="px-2 py-0.5 bg-turquoise-surf/10 text-turquoise-surf rounded text-[10px] font-bold uppercase tracking-widest border border-turquoise-surf/20">
                                                        {exercise.movement_pattern}
                                                    </span>
                                                )}
                                                {exercise.muscle_group_name && (
                                                     <span className="px-2 py-0.5 bg-white/5 text-gray-400 rounded text-[10px] font-bold uppercase tracking-widest border border-white/10">
                                                        {exercise.muscle_group_name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {exercise.equipment_required && (
                                            <div className="pt-4 border-t border-white/5 mt-auto">
                                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                                    Required: <span className="text-gray-300">{exercise.equipment_required}</span>
                                                </p>
                                            </div>
                                        )}
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