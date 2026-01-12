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
    const [equipmentFilter, setEquipmentFilter] = useState<string>('all');
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

        // Filter by Equipment (if selected)
        const matchesEquipment = equipmentFilter === 'all' || 
            (ex.equipment_required?.toLowerCase().includes(equipmentFilter.toLowerCase()) || 
             ex.name.toLowerCase().includes(equipmentFilter.toLowerCase()));

        // Filter by Body Part (if muscle not selected, but body part is)
        // If muscle is selected, body part is implicit. If not, check body part of the muscle group.     
        let matchesBodyPart = true;
        if (!selectedMuscle && selectedBodyPart !== 'all') {
            const muscle = muscles.find(m => m.id === ex.primary_muscle_group);
            matchesBodyPart = muscle?.body_part_id === selectedBodyPart;
        }

        const matchesSearch = !searchTerm ||
            ex.name.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesMuscle && matchesPattern && matchesEquipment && matchesBodyPart && matchesSearch;
    });

    const getMuscleExerciseCount = (muscleId: string) => {
        return exercises.filter(ex => ex.primary_muscle_group === muscleId).length;
    };

    const shouldShowExerciseList = selectedMuscle || selectedPattern !== 'all' || equipmentFilter !== 'all' || searchTerm;

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

                        {/* Row 2: Movement Patterns & Equipment */}
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
                            {['Push', 'Pull'].map((pattern) => (
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
                            
                            <div className="w-px h-8 bg-white/10 mx-2 self-center hidden sm:block"></div>

                            <button
                                onClick={() => setEquipmentFilter(equipmentFilter === 'TRX' ? 'all' : 'TRX')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all border ${equipmentFilter === 'TRX'
                                    ? 'bg-cerulean/30 text-cerulean border-cerulean shadow-[0_0_15px_rgba(0,123,255,0.2)]'
                                    : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10'
                                    }`}
                            >
                                TRX Only
                            </button>
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
                                const getMuscleEmoji = (name: string) => {
                                    const n = name.toLowerCase();
                                    if (n.includes('chest')) return '👕';
                                    if (n.includes('back')) return '🛶';
                                    if (n.includes('arm') || n.includes('bicep') || n.includes('tricep')) return '💪';
                                    if (n.includes('leg') || n.includes('quad') || n.includes('hamstring') || n.includes('glute')) return '🦵';
                                    if (n.includes('core') || n.includes('abs')) return '🎯';
                                    if (n.includes('shoulder')) return '🛡️';
                                    return '🏋️';
                                };

                                return (
                                    <button
                                        key={muscle.id}
                                        onClick={() => setSelectedMuscle(muscle.id)}
                                        className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-turquoise-surf/50 rounded-2xl p-6 transition-all duration-300 text-left overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <span className="text-4xl">{getMuscleEmoji(muscle.name)}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-turquoise-surf transition-colors mb-1">
                                            {muscle.name}
                                        </h3>
                                        <p className="text-gray-400 text-sm">
                                            {count} Exercises
                                        </p>
                                        <div className="mt-4 flex items-center text-xs text-turquoise-surf font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                                            View Exercises →
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 2. Exercise List (Shown when filtering) */}
                {shouldShowExerciseList && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                {selectedMuscle ? muscles.find(m => m.id === selectedMuscle)?.name : 'Filtered Results'}
                                <span className="text-sm font-normal text-gray-500 bg-white/5 px-2 py-1 rounded-md">
                                    {filteredExercises.length} found
                                </span>
                            </h2>
                            <button
                                onClick={() => {
                                    setSelectedMuscle(null);
                                    setSelectedPattern('all');
                                    setEquipmentFilter('all');
                                    setSearchTerm('');
                                }}
                                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                            >
                                ✕ Clear All
                            </button>
                        </div>

                        {filteredExercises.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredExercises.map((ex) => (
                                    <Link
                                        key={ex.id}
                                        href={`/exercises/${ex.id}`}
                                        className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-turquoise-surf/30 rounded-2xl p-6 transition-all duration-300"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${ex.difficulty_level?.toLowerCase() === 'advanced' ? 'bg-red-500/20 text-red-400' :
                                                    ex.difficulty_level?.toLowerCase() === 'intermediate' ? 'bg-orange-500/20 text-orange-400' :
                                                        'bg-green-500/20 text-green-400'
                                                }`}>
                                                {ex.difficulty_level || 'Beginner'}
                                            </span>
                                            {ex.equipment_required?.toLowerCase().includes('trx') && (
                                                <span className="bg-cerulean/20 text-cerulean px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-cerulean/20">
                                                    TRX
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-turquoise-surf transition-colors">
                                            {ex.name}
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <span className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded">
                                                {ex.equipment_required || 'No Equipment'}
                                            </span>
                                            {ex.movement_pattern && (
                                                <span className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded">
                                                    {ex.movement_pattern}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                <span className="text-5xl mb-4 block">🔍</span>
                                <h3 className="text-xl font-bold text-white mb-2">No matching exercises</h3>
                                <p className="text-gray-400">Try adjusting your filters or search term</p>
                                <button
                                    onClick={() => {
                                        setSelectedMuscle(null);
                                        setSelectedPattern('all');
                                        setEquipmentFilter('all');
                                        setSearchTerm('');
                                    }}
                                    className="mt-6 text-turquoise-surf hover:underline font-bold"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
