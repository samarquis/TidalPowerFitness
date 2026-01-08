'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

export const dynamic = 'force-dynamic';

interface Client {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
}

interface Class {
    id: string;
    name: string;
    day_of_week: number;
    days_of_week: number[];
    start_time: string;
}

interface WorkoutTemplate {
    id: string;
    name: string;
    description: string;
    workout_type_name: string;
    exercise_count: number;
}

interface AvailableExercise {
    id: string;
    name: string;
    description?: string;
    workout_type_name?: string;
    muscle_group_name?: string; // Corrected from primary_muscle_group_name
    movement_pattern?: string; // e.g. Push, Pull, Legs
}

interface SelectedExercise {
    unique_id: string; // internal ID for UI list handling
    exercise_id: string;
    name: string;
    workout_type_name?: string;
    muscle_group_name?: string;
    
    // User Inputs
    planned_sets: number;
    planned_reps: number;
    planned_weight_lbs: number;
    rest_seconds: number;
    notes: string;
    is_warmup: boolean;
    is_cooldown: boolean;
}

function AssignWorkoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isAuthenticated } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    // Step 1: Date & Time
    const [sessionDate, setSessionDate] = useState('');
    const [startTime, setStartTime] = useState('');

    // Step 2: Workout Selection
    const [workoutMode, setWorkoutMode] = useState<'template' | 'custom'>('template');
    const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
    const [templatesLoading, setTemplatesLoading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    
    // Custom Workout State
    const [availableExercises, setAvailableExercises] = useState<AvailableExercise[]>([]);
    const [selectedCustomExercises, setSelectedCustomExercises] = useState<SelectedExercise[]>([]);
    const [bodyPartsList, setBodyPartsList] = useState<any[]>([]);
    const [musclesList, setMusclesList] = useState<any[]>([]);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBodyPart, setFilterBodyPart] = useState('');
    const [filterMovement, setFilterMovement] = useState('');

    // Step 3: Recipient Selection
    const [recipientMode, setRecipientMode] = useState<'class' | 'clients'>('class');
    const [classes, setClasses] = useState<Class[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedClients, setSelectedClients] = useState<string[]>([]);

    // Step 4: Notes
    const [notes, setNotes] = useState('');
    const [saveAsTemplate, setSaveAsTemplate] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState('');

    useEffect(() => {
        const isTrainerOrAdmin = user?.roles.includes('trainer') || user?.roles.includes('admin');
        if (!user || !isTrainerOrAdmin) {
            router.push('/');
        }
    }, [user, router]);

    // Handle URL parameters for pre-filling
    useEffect(() => {
        if (!searchParams) return;
        const dateParam = searchParams.get('date');
        const classIdParam = searchParams.get('class_id');

        if (dateParam) {
            setSessionDate(dateParam);
        }

        if (classIdParam) {
            setRecipientMode('class');
            setSelectedClass(classIdParam);
        }
    }, [searchParams]);

    // Fetch templates and available exercises
    useEffect(() => {
        const fetchTemplatesAndExercises = async () => {
            try {
                const [templatesRes, exercisesRes, bodyPartsRes, musclesRes] = await Promise.all([
                    apiClient.getWorkoutTemplates(),
                    apiClient.getExercises(),
                    fetch('/api/exercises/body-parts').then(res => res.json()),
                    fetch('/api/exercises/body-focus-areas').then(res => res.json())
                ]);

                if (templatesRes.data) setTemplates(templatesRes.data);
                if (exercisesRes.data) setAvailableExercises(exercisesRes.data);
                if (Array.isArray(bodyPartsRes)) setBodyPartsList(bodyPartsRes);
                if (Array.isArray(musclesRes)) setMusclesList(musclesRes);
            } catch (error) {
                console.error('Error fetching metadata:', error);
            }
        };

        if (user) {
            fetchTemplatesAndExercises();
        }
    }, [user]);

    // Fetch classes when date is selected
    useEffect(() => {
        const fetchClasses = async () => {
            if (!sessionDate) return;

            try {
                const date = new Date(sessionDate);
                const dayOfWeek = date.getDay();

                const response = await apiClient.getClassesByDay(dayOfWeek);
                if (response.data) {
                    setClasses(response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                console.error('Error fetching classes:', error);
            }
        };

        fetchClasses();
    }, [sessionDate]);

    // Fetch clients
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await apiClient.getMyClients();
                if (response.data) {
                    setClients(response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                console.error('Error fetching clients:', error);
            }
        };

        if (user) {
            fetchClients();
        }
    }, [user]);

    // --- Helper Functions for Custom Workout Builder ---

    const getFilteredExercises = () => {
        return availableExercises.filter(ex => {
            const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Filter by Body Part Hierarchy
            let matchesBodyPart = true;
            if (filterBodyPart) {
                // Check if the exercise's muscle group belongs to this body part
                const muscle = musclesList.find(m => m.name === ex.muscle_group_name);
                const bodyPart = bodyPartsList.find(bp => bp.id === muscle?.body_part_id);
                
                // Direct match on muscle group name (fallback) OR match on Body Part ID/Name
                matchesBodyPart = (ex.muscle_group_name === filterBodyPart) || 
                                 (bodyPart?.id === filterBodyPart) || 
                                 (bodyPart?.name === filterBodyPart);
            }

            const matchesMovement = filterMovement ? ex.movement_pattern === filterMovement : true;
            
            return matchesSearch && matchesBodyPart && matchesMovement;
        });
    };

    const addExercise = (exercise: AvailableExercise) => {
        const newExercise: SelectedExercise = {
            unique_id: Math.random().toString(36).substr(2, 9),
            exercise_id: exercise.id,
            name: exercise.name,
            workout_type_name: exercise.workout_type_name,
            muscle_group_name: exercise.muscle_group_name,
            planned_sets: 3,
            planned_reps: 10,
            planned_weight_lbs: 0,
            rest_seconds: 60,
            notes: '',
            is_warmup: false,
            is_cooldown: false
        };
        setSelectedCustomExercises([...selectedCustomExercises, newExercise]);
    };

    const removeExercise = (uniqueId: string) => {
        setSelectedCustomExercises(prev => prev.filter(ex => ex.unique_id !== uniqueId));
    };

    const updateExercise = (uniqueId: string, updates: Partial<SelectedExercise>) => {
        setSelectedCustomExercises(prev => prev.map(ex => 
            ex.unique_id === uniqueId ? { ...ex, ...updates } : ex
        ));
    };

    const moveExercise = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === selectedCustomExercises.length - 1) return;

        const newArr = [...selectedCustomExercises];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newArr[index], newArr[targetIndex]] = [newArr[targetIndex], newArr[index]];
        setSelectedCustomExercises(newArr);
    };

    // --- Navigation & Submission ---

    const handleNext = () => {
        if (step === 1 && !sessionDate) {
            setError('Please select a date');
            return;
        }
        if (step === 2) {
            if (workoutMode === 'template' && !selectedTemplate) {
                setError('Please select a template');
                return;
            }
            if (workoutMode === 'custom' && selectedCustomExercises.length === 0) {
                setError('Please select at least one exercise for your custom workout');
                return;
            }
        }
        if (step === 3) {
            if (recipientMode === 'class' && !selectedClass) {
                setError('Please select a class');
                return;
            }
            if (recipientMode === 'clients' && selectedClients.length === 0) {
                setError('Please select at least one client');
                return;
            }
        }

        setError('');
        setStep(step + 1);
    };

    const handleBack = () => {
        setError('');
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        if (!isAuthenticated) return;

        setTemplatesLoading(true);
        setError('');

        try {
            let finalTemplateId = selectedTemplate;

            // 1. Create Template if requested
            if (workoutMode === 'custom' && saveAsTemplate) {
                if (!newTemplateName.trim()) {
                    throw new Error('Please provide a name for the new template');
                }

                const templatePayload = {
                    trainer_id: user?.id,
                    name: newTemplateName,
                    description: notes || 'Created from custom session assignment',
                    is_public: false, // Private by default
                    exercises: selectedCustomExercises.map((ex, index) => ({
                        exercise_id: ex.exercise_id,
                        order_in_template: index + 1,
                        suggested_sets: ex.planned_sets,
                        suggested_reps: ex.planned_reps,
                        suggested_weight_lbs: ex.planned_weight_lbs,
                        suggested_rest_seconds: ex.rest_seconds,
                        notes: ex.notes
                    }))
                };

                const templateRes = await apiClient.createWorkoutTemplate(templatePayload);
                if (templateRes.error) throw new Error(templateRes.error);
                if (templateRes.data) {
                    finalTemplateId = templateRes.data.id;
                }
            }

            const payload: any = {
                trainer_id: user?.id,
                session_date: sessionDate,
                start_time: startTime || null,
                notes: notes || null
            };

            if (workoutMode === 'template' || (workoutMode === 'custom' && saveAsTemplate)) {
                payload.template_id = finalTemplateId;
            }

            // Always include exercises if it was custom mode (even if we just made a template),
            // to preserve specific tweaks made for this session that might differ slightly
            // or just to be safe. If we made a template, we pass BOTH template_id and exercises.
            if (workoutMode === 'custom') {
                 payload.exercises = selectedCustomExercises.map((ex, index) => ({
                    exercise_id: ex.exercise_id,
                    order_in_session: index + 1,
                    planned_sets: ex.planned_sets,
                    planned_reps: ex.planned_reps,
                    planned_weight_lbs: ex.planned_weight_lbs,
                    rest_seconds: ex.rest_seconds,
                    notes: ex.notes,
                    is_warmup: ex.is_warmup,
                    is_cooldown: ex.is_cooldown
                }));
            }

            if (recipientMode === 'class') {
                payload.class_id = selectedClass;
            } else {
                payload.participant_ids = selectedClients;
            }

            const response = await apiClient.createWorkoutSession(payload);

            if (response.error) {
                throw new Error(response.error || 'Failed to assign workout');
            }

            // Success Redirect
            if (recipientMode === 'class' && selectedClass) {
                 router.push('/admin/classes'); 
            } else {
                router.push('/admin/calendar');
            }
            
        } catch (error: any) {
            setError(error.message);
        } finally {
            setTemplatesLoading(false);
        }
    };

    const toggleClient = (clientId: string) => {
        setSelectedClients(prev =>
            prev.includes(clientId)
                ? prev.filter(id => id !== clientId)
                : [...prev, clientId]
        );
    };

    const isTrainerOrAdmin = user?.roles.includes('trainer') || user?.roles.includes('admin');

    if (!user || !isTrainerOrAdmin) {
        return null;
    }

    // Extract unique values for filters
    const bodyParts = Array.from(new Set(availableExercises.map(e => e.muscle_group_name).filter(Boolean))) as string[];
    // const movements = Array.from(new Set(availableExercises.map(e => e.movement_pattern_name).filter(Boolean))) as string[];

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 page-container">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <Link href="/trainer" className="text-turquoise-surf hover:text-pacific-cyan mb-4 inline-block font-medium">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Assign <span className="text-gradient">Workout</span>
                    </h1>
                    <p className="text-xl text-gray-400">
                        Create a structured session for a class or client
                    </p>
                </div>

                <div className="glass rounded-2xl p-8 shadow-2xl border border-white/5">
                                        {isSuccess ? (
                        <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500/50">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h2 className="text-4xl font-bold mb-4">Mission Accomplished</h2>
                            <p className="text-xl text-gray-400 mb-10 max-w-md mx-auto">
                                The workout has been successfully assigned and is now live on the client dashboards.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/trainer" className="btn-primary">
                                    Return to Dashboard
                                </Link>
                                <button onClick={() => window.location.reload()} className="btn-secondary">
                                    Assign Another
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                        {/* Progress Bar */}
                    <div className="mb-10">
                        <div className="flex justify-between mb-3 px-2">
                            {['Date & Time', 'Session Builder', 'Recipients', 'Review'].map((label, index) => (
                                <span
                                    key={label}
                                    className={`text-sm font-bold uppercase tracking-wider ${step > index + 0.5 ? 'text-turquoise-surf' : 'text-gray-600'
                                        }`}
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-turquoise-surf to-pacific-cyan h-2 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${((step - 1) / 3) * 100}%` }}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl flex items-center gap-3">
                            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {error}
                        </div>
                    )}

                    {/* Step 1: Date & Time */}
                    {step === 1 && (
                        <div className="max-w-xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                                    Session Date *
                                </label>
                                <input
                                    type="date"
                                    value={sessionDate}
                                    onChange={(e) => setSessionDate(e.target.value)}
                                    className="input-field text-lg py-4"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                                    Start Time (Optional)
                                </label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="input-field text-lg py-4"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Workout Builder */}
                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            
                            {/* Mode Selection */}
                            <div className="flex gap-4 p-1 bg-white/5 rounded-xl w-fit mx-auto border border-white/10">
                                <button
                                    onClick={() => setWorkoutMode('template')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                                        workoutMode === 'template' 
                                            ? 'bg-pacific-cyan text-white shadow-lg shadow-pacific-cyan/20' 
                                            : 'text-gray-400 hover:text-foreground'
                                    }`}
                                >
                                    Use Template
                                </button>
                                <button
                                    onClick={() => setWorkoutMode('custom')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                                        workoutMode === 'custom' 
                                            ? 'bg-pacific-cyan text-white shadow-lg shadow-pacific-cyan/20' 
                                            : 'text-gray-400 hover:text-foreground'
                                    }`}
                                >
                                    Custom Builder
                                </button>
                            </div>

                            {workoutMode === 'template' ? (
                                <div className="max-w-2xl mx-auto space-y-4">
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        Select Template *
                                    </label>
                                    {templates.length === 0 ? (
                                        <div className="p-8 text-center bg-yellow-500/5 border border-yellow-500/20 rounded-xl text-foreground">
                                            <p className="text-yellow-600 dark:text-yellow-200/80 mb-4">No templates found.</p>
                                            <Link href="/workouts/templates/new" className="text-pacific-cyan font-bold hover:underline">
                                                Create your first template
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="grid gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                            {templates.map((template) => (
                                                <div
                                                    key={template.id}
                                                    onClick={() => setSelectedTemplate(template.id)}
                                                    className={`p-5 rounded-xl border transition-all cursor-pointer group ${
                                                        selectedTemplate === template.id
                                                            ? 'bg-pacific-cyan/10 border-pacific-cyan shadow-lg shadow-pacific-cyan/5'
                                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className={`font-bold text-lg ${selectedTemplate === template.id ? 'text-pacific-cyan' : 'text-foreground'}`}>
                                                            {template.name}
                                                        </h4>
                                                        {selectedTemplate === template.id && (
                                                            <div className="bg-pacific-cyan text-white rounded-full p-1">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{template.description || 'No description'}</p>
                                                    <div className="flex gap-3">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 px-2 py-1 rounded text-gray-400 border border-white/10">
                                                            {template.workout_type_name}
                                                        </span>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 px-2 py-1 rounded text-gray-400 border border-white/10">
                                                            {template.exercise_count} Exercises
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* CUSTOM BUILDER UI */
                                <div className="grid lg:grid-cols-2 gap-8 h-[700px]">
                                    {/* Left: Exercise Library */}
                                    <div className="flex flex-col h-full bg-black/5 dark:bg-black/20 rounded-xl border border-white/10 overflow-hidden">
                                        <div className="p-4 border-b border-white/10 space-y-3 bg-white/5">
                                            <h3 className="font-bold text-foreground flex items-center gap-2">
                                                <svg className="w-5 h-5 text-pacific-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                                Library
                                            </h3>
                                            
                                            {/* Search */}
                                            <div className="relative">
                                                <svg className="absolute left-3 top-3 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                                <input 
                                                    type="text"
                                                    placeholder="Search exercises..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="input-field py-2 pl-9 text-sm"
                                                />
                                            </div>

                                            {/* Filters */}
                                            <div className="flex gap-2">
                                                <select 
                                                    value={filterMovement}
                                                    onChange={(e) => setFilterMovement(e.target.value)}
                                                    className="input-field py-1.5 px-2 text-xs flex-1 text-foreground bg-background"
                                                >
                                                    <option value="" className="bg-card text-foreground">All Movements</option>
                                                    <option value="Push" className="bg-card text-foreground">Push</option>
                                                    <option value="Pull" className="bg-card text-foreground">Pull</option>
                                                </select>
                                                <select 
                                                    value={filterBodyPart}
                                                    onChange={(e) => setFilterBodyPart(e.target.value)}
                                                    className="input-field py-1.5 px-2 text-xs flex-1 text-foreground bg-background"
                                                >
                                                    <option value="" className="bg-card text-foreground">All Body Parts</option>
                                                    {bodyPartsList.map(bp => <option key={bp.id} value={bp.id} className="bg-card text-foreground">{bp.name}</option>)}
                                                    {/* Fallback for legacy muscle groups not mapped to body parts */}
                                                    {availableExercises
                                                        .map(e => e.muscle_group_name)
                                                        .filter(name => name && !musclesList.some(m => m.name === name))
                                                        .filter((v, i, a) => a.indexOf(v) === i)
                                                        .map(name => <option key={name} value={name!} className="bg-card text-foreground italic">{name}</option>)
                                                    }
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1">
                                            {getFilteredExercises().map(ex => {
                                                const count = selectedCustomExercises.filter(se => se.exercise_id === ex.id).length;
                                                return (
                                                    <div key={ex.id} className={`group flex items-center justify-between p-3 rounded-lg transition-all border ${count > 0 ? 'bg-pacific-cyan/10 border-pacific-cyan/30' : 'hover:bg-white/10 border-transparent hover:border-white/10'}`}>
                                                        <div className="min-w-0">
                                                            <div className="font-medium text-foreground text-sm truncate">{ex.name}</div>
                                                            <div className="text-[10px] text-gray-500 uppercase tracking-wide truncate">
                                                                {ex.muscle_group_name} • {ex.workout_type_name}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {count > 0 && (
                                                                <span className="text-[10px] font-bold bg-pacific-cyan text-white px-1.5 py-0.5 rounded-full animate-in zoom-in duration-300">
                                                                    {count}
                                                                </span>
                                                            )}
                                                            <button 
                                                                onClick={() => addExercise(ex)}
                                                                className={`p-1.5 rounded-md transition-all ${count > 0 ? 'bg-pacific-cyan text-white' : 'bg-pacific-cyan/10 text-pacific-cyan hover:bg-pacific-cyan hover:text-white'}`}
                                                                title="Add to session"
                                                            >
                                                                {count > 0 ? (
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                                ) : (
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {getFilteredExercises().length === 0 && (
                                                <div className="text-center py-10 text-gray-500 text-sm">No exercises found.</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Session Plan */}
                                    <div className="flex flex-col h-full bg-black/5 dark:bg-black/20 rounded-xl border border-white/10 overflow-hidden">
                                        <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                                            <h3 className="font-bold text-foreground flex items-center gap-2">
                                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                                Session Plan <span className="text-gray-500 text-sm font-normal">({selectedCustomExercises.length})</span>
                                            </h3>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                                            {selectedCustomExercises.length === 0 ? (
                                                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                                    <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                                    <p>No exercises added yet.</p>
                                                    <p className="text-xs mt-2">Add exercises from the library on the left.</p>
                                                </div>
                                            ) : (
                                                selectedCustomExercises.map((ex, idx) => (
                                                    <div key={ex.unique_id} className="bg-white/5 border border-white/10 rounded-xl p-4 group">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 text-xs text-gray-500 dark:text-gray-400 font-mono">
                                                                    {idx + 1}
                                                                </span>
                                                                <h4 className="font-bold text-foreground">{ex.name}</h4>
                                                            </div>
                                                            <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => moveExercise(idx, 'up')} disabled={idx === 0} className="p-1 hover:text-foreground disabled:opacity-30"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></button>
                                                                <button onClick={() => moveExercise(idx, 'down')} disabled={idx === selectedCustomExercises.length - 1} className="p-1 hover:text-foreground disabled:opacity-30"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
                                                                <button onClick={() => removeExercise(ex.unique_id)} className="p-1 text-red-500 hover:text-red-400 ml-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                                            </div>
                                                        </div>

                                                        {/* Inputs Grid */}
                                                        <div className="grid grid-cols-4 gap-3 mb-3">
                                                            <div>
                                                                <label className="text-[10px] uppercase text-gray-500 font-bold">Sets</label>
                                                                <input type="number" min="1" value={ex.planned_sets} onChange={(e) => updateExercise(ex.unique_id, { planned_sets: parseInt(e.target.value) || 0 })} className="input-field py-1 text-sm" />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] uppercase text-gray-500 font-bold">Reps</label>
                                                                <input type="number" min="1" value={ex.planned_reps} onChange={(e) => updateExercise(ex.unique_id, { planned_reps: parseInt(e.target.value) || 0 })} className="input-field py-1 text-sm" />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] uppercase text-gray-500 font-bold">Lbs</label>
                                                                <input type="number" min="0" value={ex.planned_weight_lbs} onChange={(e) => updateExercise(ex.unique_id, { planned_weight_lbs: parseFloat(e.target.value) || 0 })} className="input-field py-1 text-sm" />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] uppercase text-gray-500 font-bold">Rest (s)</label>
                                                                <input type="number" min="0" value={ex.rest_seconds} onChange={(e) => updateExercise(ex.unique_id, { rest_seconds: parseInt(e.target.value) || 0 })} className="input-field py-1 text-sm" />
                                                            </div>
                                                        </div>

                                                        {/* Toggles & Notes */}
                                                        <div className="flex items-center gap-4">
                                                            <label className="flex items-center gap-2 cursor-pointer">
                                                                <input type="checkbox" checked={ex.is_warmup} onChange={(e) => updateExercise(ex.unique_id, { is_warmup: e.target.checked })} className="rounded bg-white/10 border-white/20 text-orange-500 focus:ring-0" />
                                                                <span className={`text-xs font-bold uppercase ${ex.is_warmup ? 'text-orange-500' : 'text-gray-500'}`}>Warmup</span>
                                                            </label>
                                                            <label className="flex items-center gap-2 cursor-pointer">
                                                                <input type="checkbox" checked={ex.is_cooldown} onChange={(e) => updateExercise(ex.unique_id, { is_cooldown: e.target.checked })} className="rounded bg-white/10 border-white/20 text-blue-500 focus:ring-0" />
                                                                <span className={`text-xs font-bold uppercase ${ex.is_cooldown ? 'text-blue-500' : 'text-gray-500'}`}>Cooldown</span>
                                                            </label>
                                                            <input 
                                                                type="text" 
                                                                placeholder="Notes..." 
                                                                value={ex.notes} 
                                                                onChange={(e) => updateExercise(ex.unique_id, { notes: e.target.value })}
                                                                className="flex-1 bg-transparent border-b border-white/10 text-xs text-foreground focus:border-pacific-cyan outline-none py-1 ml-2"
                                                            />
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Recipient Selection */}
                    {step === 3 && (
                        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex gap-4 p-1 bg-white/5 rounded-xl w-fit mx-auto border border-white/10">
                                <label className={`flex items-center gap-3 px-6 py-3 rounded-lg cursor-pointer transition-all ${recipientMode === 'class' ? 'bg-pacific-cyan/10 border border-pacific-cyan shadow-lg shadow-pacific-cyan/5' : 'hover:bg-white/5 border border-transparent'}`}>
                                    <input type="radio" name="recipientMode" value="class" checked={recipientMode === 'class'} onChange={() => setRecipientMode('class')} className="hidden" />
                                    <div className="text-2xl">🏫</div>
                                    <div>
                                        <div className={`font-bold ${recipientMode === 'class' ? 'text-pacific-cyan' : 'text-foreground'}`}>Class</div>
                                        <div className="text-xs text-gray-500">Assign to all attendees</div>
                                    </div>
                                </label>
                                <label className={`flex items-center gap-3 px-6 py-3 rounded-lg cursor-pointer transition-all ${recipientMode === 'clients' ? 'bg-pacific-cyan/10 border border-pacific-cyan shadow-lg shadow-pacific-cyan/5' : 'hover:bg-white/5 border border-transparent'}`}>
                                    <input type="radio" name="recipientMode" value="clients" checked={recipientMode === 'clients'} onChange={() => setRecipientMode('clients')} className="hidden" />
                                    <div className="text-2xl">👤</div>
                                    <div>
                                        <div className={`font-bold ${recipientMode === 'clients' ? 'text-pacific-cyan' : 'text-foreground'}`}>Individual</div>
                                        <div className="text-xs text-gray-500">Select specific clients</div>
                                    </div>
                                </label>
                            </div>

                            {recipientMode === 'class' && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        Select Class *
                                    </label>
                                    {classes.length === 0 ? (
                                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-700 dark:text-yellow-200/80 text-sm flex gap-3 items-center">
                                            <span className="text-xl">⚠️</span>
                                            No classes found for {new Date(sessionDate).toLocaleDateString()}.
                                        </div>
                                    ) : (
                                        <select
                                            value={selectedClass}
                                            onChange={(e) => setSelectedClass(e.target.value)}
                                            className="input-field"
                                        >
                                            <option value="" className="bg-background">-- Select a class --</option>
                                            {classes.map((cls) => (
                                                <option key={cls.id} value={cls.id} className="bg-background">
                                                    {cls.name} - {cls.start_time}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            )}

                            {recipientMode === 'clients' && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        Select Clients * ({selectedClients.length})
                                    </label>
                                    <div className="bg-white/5 border border-white/10 rounded-xl max-h-80 overflow-y-auto custom-scrollbar p-2">
                                        {clients.map((client) => (
                                            <label
                                                key={client.id}
                                                className="flex items-center p-3 hover:bg-white/5 cursor-pointer rounded-lg transition-all"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedClients.includes(client.id)}
                                                    onChange={() => toggleClient(client.id)}
                                                    className="mr-4 w-5 h-5 text-pacific-cyan rounded border-white/20 bg-white/5 focus:ring-offset-0 focus:ring-pacific-cyan"
                                                />
                                                <span className="text-foreground font-medium">{client.full_name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 4: Review & Notes */}
                    {step === 4 && (
                        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="glass-card p-8 rounded-2xl space-y-6">
                                <h3 className="font-bold text-xl mb-6 text-turquoise-surf uppercase tracking-widest border-b border-white/10 pb-4">
                                    Summary
                                </h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Date & Time</p>
                                        <p className="text-foreground font-medium text-lg">{new Date(sessionDate).toLocaleDateString()} {startTime && `@ ${startTime}`}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Assigned To</p>
                                        <p className="text-foreground font-medium text-lg">
                                            {recipientMode === 'class'
                                                ? classes.find(c => c.id === selectedClass)?.name || 'Unknown Class'
                                                : `${selectedClients.length} Individual Client(s)`}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Workout</p>
                                        <div className="text-foreground font-medium">
                                            {workoutMode === 'template' ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-pacific-cyan">Template:</span> 
                                                    {templates.find(t => t.id === selectedTemplate)?.name}
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="mb-2 text-pacific-cyan">Custom Session ({selectedCustomExercises.length} Exercises)</div>
                                                    <div className="text-sm text-gray-500 space-y-1 pl-4 border-l-2 border-white/10">
                                                        {selectedCustomExercises.map((ex, i) => (
                                                            <div key={ex.unique_id} className="flex justify-between">
                                                                <span>{i+1}. {ex.name}</span>
                                                                <span className="font-mono text-xs">{ex.planned_sets}x{ex.planned_reps} @ {ex.planned_weight_lbs}lb</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Save as Template Option (Custom Only) */}
                            {workoutMode === 'custom' && (
                                <div className="glass-card p-6 rounded-2xl border border-dashed border-white/20 bg-white/5">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={saveAsTemplate}
                                            onChange={(e) => setSaveAsTemplate(e.target.checked)}
                                            className="w-5 h-5 rounded border-white/20 bg-black/20 text-pacific-cyan focus:ring-offset-0 focus:ring-pacific-cyan"
                                        />
                                        <span className="font-bold text-foreground">Save this workout as a reusable Template?</span>
                                    </label>

                                    {saveAsTemplate && (
                                        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                                                Template Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={newTemplateName}
                                                onChange={(e) => setNewTemplateName(e.target.value)}
                                                className="input-field"
                                                placeholder="e.g. Full Body Strength A"
                                            />
                                            <p className="text-xs text-gray-500 mt-2">This will be saved to your templates library for future use.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={4}
                                    className="input-field"
                                    placeholder="Add specific instructions for this session..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-12 pt-6 border-t border-white/10">
                        <button
                            onClick={handleBack}
                            disabled={step === 1}
                            className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            Back
                        </button>

                        {step < 4 ? (
                            <button
                                onClick={handleNext}
                                className="btn-primary"
                            >
                                Next
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="btn-primary min-w-[200px]"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Assigning...
                                    </>
                                ) : (
                                    <>
                                        Confirm Assignment
                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function AssignWorkoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <AssignWorkoutContent />
        </Suspense>
    );
}
