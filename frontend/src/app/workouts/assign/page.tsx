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

function AssignWorkoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, token } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Step 1: Date & Time
    const [sessionDate, setSessionDate] = useState('');
    const [startTime, setStartTime] = useState('');

    // Step 2: Workout Selection
    const [workoutMode, setWorkoutMode] = useState<'template' | 'custom'>('template');
    const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [availableExercises, setAvailableExercises] = useState<any[]>([]);
    const [selectedCustomExercises, setSelectedCustomExercises] = useState<string[]>([]);


    // Step 3: Recipient Selection
    const [recipientMode, setRecipientMode] = useState<'class' | 'clients'>('class');
    const [classes, setClasses] = useState<Class[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedClients, setSelectedClients] = useState<string[]>([]);

    // Step 4: Notes
    const [notes, setNotes] = useState('');

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
                const [templatesRes, exercisesRes] = await Promise.all([
                    apiClient.getWorkoutTemplates(),
                    apiClient.getExercises()
                ]);

                if (templatesRes.data) setTemplates(templatesRes.data);
                if (exercisesRes.data) setAvailableExercises(exercisesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
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
                console.error('Error fetching clients:', error);
            }
        };

        if (user) {
            fetchClients();
        }
    }, [user]);


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
        if (!token) return;

        setLoading(true);
        setError('');

        try {
            const payload: any = {
                trainer_id: user?.id,
                session_date: sessionDate,
                start_time: startTime || null,
                notes: notes || null
            };

            if (workoutMode === 'template') {
                payload.template_id = selectedTemplate;
            } else {
                payload.exercises = selectedCustomExercises.map((id, index) => ({
                    exercise_id: id,
                    order_in_session: index + 1
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


            // Success! Redirect to calendar or sessions page
            router.push('/admin/calendar');
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
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

    return (
        <div className="min-h-screen pt-24 pb-16 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <Link href="/trainer" className="text-turquoise-surf hover:text-pacific-cyan mb-4 inline-block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Assign <span className="text-gradient">Workout</span>
                    </h1>
                    <p className="text-xl text-gray-300">
                        Create a workout session for a class or individual
                    </p>
                </div>
                <div className="glass rounded-2xl p-8 shadow-xl">
                    <p className="text-gray-400 mb-8">Step {step} of 4</p>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-3">
                            {['Date', 'Workout', 'Recipients', 'Review'].map((label, index) => (
                                <span
                                    key={label}
                                    className={`text-sm font-semibold ${step > index ? 'text-turquoise-surf' : 'text-gray-500'
                                        }`}
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-turquoise-surf to-pacific-cyan h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(step / 4) * 100}%` }}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Date & Time */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Session Date *
                                </label>
                                <input
                                    type="date"
                                    value={sessionDate}
                                    onChange={(e) => setSessionDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pacific-cyan focus:border-transparent transition-all"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Start Time (Optional)
                                </label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pacific-cyan focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Workout Selection */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    Choose Workout Type
                                </label>
                                <div className="space-y-3">
                                    <label className="flex items-center p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 hover:border-pacific-cyan/50 transition-all">
                                        <input
                                            type="radio"
                                            name="workoutMode"
                                            value="template"
                                            checked={workoutMode === 'template'}
                                            onChange={() => setWorkoutMode('template')}
                                            className="mr-4 w-4 h-4 text-pacific-cyan"
                                        />
                                        <div>
                                            <div className="font-semibold text-white">Use Template</div>
                                            <div className="text-sm text-gray-400">Select from your saved workout templates</div>
                                        </div>
                                    </label>
                                    <label className="flex items-center p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 hover:border-pacific-cyan/50 transition-all">
                                        <input
                                            type="radio"
                                            name="workoutMode"
                                            value="custom"
                                            checked={workoutMode === 'custom'}
                                            onChange={() => setWorkoutMode('custom')}
                                            className="mr-4 w-4 h-4 text-pacific-cyan"
                                        />
                                        <div>
                                            <div className="font-semibold text-white">Create Custom</div>
                                            <div className="text-sm text-gray-400">Build a custom workout for this session</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {workoutMode === 'template' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Select Template *
                                    </label>
                                    {templates.length === 0 ? (
                                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-200/80 text-sm">
                                            No templates found. <Link href="/workouts/templates/new" className="text-pacific-cyan underline">Create one first</Link> or use Custom mode.
                                        </div>
                                    ) : (
                                        <div className="grid gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                            {templates.map((template) => (
                                                <div
                                                    key={template.id}
                                                    onClick={() => setSelectedTemplate(template.id)}
                                                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                                        selectedTemplate === template.id
                                                            ? 'bg-pacific-cyan/20 border-pacific-cyan'
                                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="font-bold text-white">{template.name}</h4>
                                                        {selectedTemplate === template.id && (
                                                            <div className="bg-pacific-cyan text-black rounded-full p-0.5">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-400 line-clamp-1">{template.description || 'No description'}</p>
                                                    <div className="flex gap-3 mt-2">
                                                        <span className="text-[10px] uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded text-gray-400">
                                                            {template.workout_type_name}
                                                        </span>
                                                        <span className="text-[10px] uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded text-gray-400">
                                                            {template.exercise_count} Exercises
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {workoutMode === 'custom' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Select Exercises * ({selectedCustomExercises.length} selected)
                                    </label>
                                    <div className="bg-white/5 border border-white/10 rounded-lg max-h-64 overflow-y-auto custom-scrollbar">
                                        {availableExercises.map((exercise) => (
                                            <label
                                                key={exercise.id}
                                                className="flex items-center p-4 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0 transition-all"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCustomExercises.includes(exercise.id)}
                                                    onChange={() => {
                                                        setSelectedCustomExercises(prev =>
                                                            prev.includes(exercise.id)
                                                                ? prev.filter(id => id !== exercise.id)
                                                                : [...prev, exercise.id]
                                                        );
                                                    }}
                                                    className="mr-4 w-4 h-4 text-teal-500 rounded border-white/20 bg-white/5"
                                                />
                                                <div>
                                                    <span className="text-white font-medium">{exercise.name}</span>
                                                    <p className="text-xs text-gray-500">{exercise.workout_type_name} • {exercise.primary_muscle_group_name}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 italic">
                                        Note: For deep customization (sets, reps, etc.), create a Workout Template first.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}


                    {/* Step 3: Recipient Selection */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    Assign To
                                </label>
                                <div className="space-y-3">
                                    <label className="flex items-center p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 hover:border-pacific-cyan/50 transition-all">
                                        <input
                                            type="radio"
                                            name="recipientMode"
                                            value="class"
                                            checked={recipientMode === 'class'}
                                            onChange={() => setRecipientMode('class')}
                                            className="mr-4 w-4 h-4 text-pacific-cyan"
                                        />
                                        <div>
                                            <div className="font-semibold text-white">Assign to Class</div>
                                            <div className="text-sm text-gray-400">All participants in the class</div>
                                        </div>
                                    </label>
                                    <label className="flex items-center p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 hover:border-pacific-cyan/50 transition-all">
                                        <input
                                            type="radio"
                                            name="recipientMode"
                                            value="clients"
                                            checked={recipientMode === 'clients'}
                                            onChange={() => setRecipientMode('clients')}
                                            className="mr-4 w-4 h-4 text-pacific-cyan"
                                        />
                                        <div>
                                            <div className="font-semibold text-white">Assign to Individual Clients</div>
                                            <div className="text-sm text-gray-400">Select specific clients</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {recipientMode === 'class' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Select Class *
                                    </label>
                                    {classes.length === 0 ? (
                                        <p className="text-gray-400 text-sm p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                            No classes scheduled for this day
                                        </p>
                                    ) : (
                                        <select
                                            value={selectedClass}
                                            onChange={(e) => setSelectedClass(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pacific-cyan focus:border-transparent transition-all"
                                        >
                                            <option value="" className="bg-gray-900">-- Select a class --</option>
                                            {classes.map((cls) => (
                                                <option key={cls.id} value={cls.id} className="bg-gray-900">
                                                    {cls.name} - {cls.start_time}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            )}

                            {recipientMode === 'clients' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Select Clients * ({selectedClients.length} selected)
                                    </label>
                                    <div className="bg-white/5 border border-white/10 rounded-lg max-h-64 overflow-y-auto">
                                        {clients.map((client) => (
                                            <label
                                                key={client.id}
                                                className="flex items-center p-4 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0 transition-all"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedClients.includes(client.id)}
                                                    onChange={() => toggleClient(client.id)}
                                                    className="mr-4 w-4 h-4 text-pacific-cyan"
                                                />
                                                <span className="text-white">{client.full_name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 4: Review & Notes */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4">
                                <h3 className="font-bold text-xl mb-4 text-turquoise-surf">Review Assignment</h3>
                                <div className="flex justify-between border-b border-white/10 pb-3">
                                    <span className="text-gray-400">Date:</span>
                                    <span className="text-white font-semibold">{new Date(sessionDate).toLocaleDateString()}</span>
                                </div>
                                {startTime && (
                                    <div className="flex justify-between border-b border-white/10 pb-3">
                                        <span className="text-gray-400">Time:</span>
                                        <span className="text-white font-semibold">{startTime}</span>
                                    </div>
                                )}
                                <div className="flex justify-between border-b border-white/10 pb-3">
                                    <span className="text-gray-400">Workout:</span>
                                    <span className="text-white font-semibold">
                                        {workoutMode === 'template'
                                            ? templates.find(t => t.id === selectedTemplate)?.name
                                            : `Custom Workout (${selectedCustomExercises.length} exercises)`}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Assigned to:</span>
                                    <span className="text-white font-semibold">
                                        {recipientMode === 'class'
                                            ? classes.find(c => c.id === selectedClass)?.name
                                            : `${selectedClients.length} client(s)`}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pacific-cyan focus:border-transparent transition-all"
                                    placeholder="Add any notes or instructions for this workout..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <button
                            onClick={handleBack}
                            disabled={step === 1}
                            className="px-8 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all"
                        >
                            Back
                        </button>

                        {step < 4 ? (
                            <button
                                onClick={handleNext}
                                className="px-8 py-3 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white font-semibold rounded-lg transition-all transform hover:scale-105"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg disabled:opacity-50 transition-all transform hover:scale-105"
                            >
                                {loading ? 'Assigning...' : 'Assign Workout'}
                            </button>
                        )}
                    </div>
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
