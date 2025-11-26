'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

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

export default function AssignWorkoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
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

    // Step 3: Recipient Selection
    const [recipientMode, setRecipientMode] = useState<'class' | 'clients'>('class');
    const [classes, setClasses] = useState<Class[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedClients, setSelectedClients] = useState<string[]>([]);

    // Step 4: Notes
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (!user || !user.roles.includes('trainer')) {
            router.push('/');
        }
    }, [user, router]);

    // Handle URL parameters for pre-filling
    useEffect(() => {
        const dateParam = searchParams.get('date');
        const classIdParam = searchParams.get('class_id');

        if (dateParam) {
            setSessionDate(dateParam);
        }

        if (classIdParam) {
            setRecipientMode('class');
            setSelectedClass(classIdParam);
            // If we have both date and class, we can potentially skip to step 2
            // But let's keep it at step 1 to let them verify/add time
        }
    }, [searchParams]);

    // Fetch templates
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workout-templates`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setTemplates(data);
                }
            } catch (error) {
                console.error('Error fetching templates:', error);
            }
        };

        if (user) {
            fetchTemplates();
        }
    }, [user]);

    // Fetch classes when date is selected
    useEffect(() => {
        const fetchClasses = async () => {
            if (!sessionDate) return;

            try {
                const date = new Date(sessionDate);
                const dayOfWeek = date.getDay();

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/assignments/classes?day_of_week=${dayOfWeek}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setClasses(data);
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
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments/clients`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setClients(data);
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
        if (step === 2 && workoutMode === 'template' && !selectedTemplate) {
            setError('Please select a template');
            return;
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
            }

            if (recipientMode === 'class') {
                payload.class_id = selectedClass;
            } else {
                payload.participant_ids = selectedClients;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments/assign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to assign workout');
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

    if (!user || !user.roles.includes('trainer')) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold mb-2">Assign Workout</h1>
                    <p className="text-gray-600 mb-6">Step {step} of 4</p>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            {['Date', 'Workout', 'Recipients', 'Review'].map((label, index) => (
                                <span
                                    key={label}
                                    className={`text-sm ${step > index ? 'text-blue-600 font-semibold' : 'text-gray-400'
                                        }`}
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(step / 4) * 100}%` }}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Date & Time */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Session Date *
                                </label>
                                <input
                                    type="date"
                                    value={sessionDate}
                                    onChange={(e) => setSessionDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Time (Optional)
                                </label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Workout Selection */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Choose Workout Type
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="workoutMode"
                                            value="template"
                                            checked={workoutMode === 'template'}
                                            onChange={() => setWorkoutMode('template')}
                                            className="mr-3"
                                        />
                                        <div>
                                            <div className="font-medium">Use Template</div>
                                            <div className="text-sm text-gray-600">Select from your saved workout templates</div>
                                        </div>
                                    </label>
                                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 opacity-50">
                                        <input
                                            type="radio"
                                            name="workoutMode"
                                            value="custom"
                                            disabled
                                            className="mr-3"
                                        />
                                        <div>
                                            <div className="font-medium">Create Custom</div>
                                            <div className="text-sm text-gray-600">Build a custom workout (Coming soon)</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {workoutMode === 'template' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Template *
                                    </label>
                                    <select
                                        value={selectedTemplate}
                                        onChange={(e) => setSelectedTemplate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">-- Select a template --</option>
                                        {templates.map((template) => (
                                            <option key={template.id} value={template.id}>
                                                {template.name} ({template.exercise_count} exercises)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Recipient Selection */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Assign To
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="recipientMode"
                                            value="class"
                                            checked={recipientMode === 'class'}
                                            onChange={() => setRecipientMode('class')}
                                            className="mr-3"
                                        />
                                        <div>
                                            <div className="font-medium">Assign to Class</div>
                                            <div className="text-sm text-gray-600">All participants in the class</div>
                                        </div>
                                    </label>
                                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="recipientMode"
                                            value="clients"
                                            checked={recipientMode === 'clients'}
                                            onChange={() => setRecipientMode('clients')}
                                            className="mr-3"
                                        />
                                        <div>
                                            <div className="font-medium">Assign to Individual Clients</div>
                                            <div className="text-sm text-gray-600">Select specific clients</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {recipientMode === 'class' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Class *
                                    </label>
                                    {classes.length === 0 ? (
                                        <p className="text-gray-500 text-sm">No classes scheduled for this day</p>
                                    ) : (
                                        <select
                                            value={selectedClass}
                                            onChange={(e) => setSelectedClass(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">-- Select a class --</option>
                                            {classes.map((cls) => (
                                                <option key={cls.id} value={cls.id}>
                                                    {cls.name} - {cls.start_time}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            )}

                            {recipientMode === 'clients' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Clients * ({selectedClients.length} selected)
                                    </label>
                                    <div className="border border-gray-300 rounded-md max-h-64 overflow-y-auto">
                                        {clients.map((client) => (
                                            <label
                                                key={client.id}
                                                className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedClients.includes(client.id)}
                                                    onChange={() => toggleClient(client.id)}
                                                    className="mr-3"
                                                />
                                                <span>{client.full_name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 4: Review & Notes */}
                    {step === 4 && (
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-md space-y-2">
                                <h3 className="font-semibold text-lg mb-3">Review Assignment</h3>
                                <div>
                                    <span className="font-medium">Date:</span> {new Date(sessionDate).toLocaleDateString()}
                                </div>
                                {startTime && (
                                    <div>
                                        <span className="font-medium">Time:</span> {startTime}
                                    </div>
                                )}
                                <div>
                                    <span className="font-medium">Workout:</span>{' '}
                                    {workoutMode === 'template'
                                        ? templates.find(t => t.id === selectedTemplate)?.name
                                        : 'Custom Workout'}
                                </div>
                                <div>
                                    <span className="font-medium">Assigned to:</span>{' '}
                                    {recipientMode === 'class'
                                        ? classes.find(c => c.id === selectedClass)?.name
                                        : `${selectedClients.length} client(s)`}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Back
                        </button>

                        {step < 4 ? (
                            <button
                                onClick={handleNext}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
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
