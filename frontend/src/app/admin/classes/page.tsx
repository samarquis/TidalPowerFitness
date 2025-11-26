'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Class {
    id: string;
    name: string;
    description: string;
    category: string;
    instructor_id?: string;
    instructor_name: string;
    day_of_week: number;
    start_time: string;
    duration_minutes: number;
    max_capacity: number;
    price_cents: number;
    is_active: boolean;
    acuity_appointment_type_id?: string;
}

interface Trainer {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
}

interface ClassFormData {
    name: string;
    description: string;
    category: string;
    instructor_id: string;
    instructor_name: string;
    day_of_week: number;
    start_time: string;
    duration_minutes: number;
    max_capacity: number;
    price_cents: number;
    acuity_appointment_type_id: string;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const CATEGORIES = ['Strength Training', 'Cardio', 'HIIT', 'Yoga', 'Pilates', 'CrossFit', 'Boxing', 'Cycling', 'Barre', 'Circuits', 'Pop Up', 'Power Bounce', 'Other'];

// Helper functions for time conversion
function convertTo12Hour(time24: string): { hour: string, minute: string, period: 'am' | 'pm' } {
    const [hourStr, minuteStr] = time24.split(':');
    let hour = parseInt(hourStr);
    const period: 'am' | 'pm' = hour >= 12 ? 'pm' : 'am';

    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;

    return {
        hour: hour.toString(),
        minute: minuteStr || '00',
        period
    };
}

function convertTo24Hour(hour: string, minute: string, period: 'am' | 'pm'): string {
    let hour24 = parseInt(hour);

    if (period === 'am' && hour24 === 12) hour24 = 0;
    else if (period === 'pm' && hour24 !== 12) hour24 += 12;

    return `${hour24.toString().padStart(2, '0')}:${minute}`;
}

function formatTime12Hour(time24: string): string {
    const { hour, minute, period } = convertTo12Hour(time24);
    return `${hour}:${minute} ${period}`;
}

export default function AdminClassesPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [classes, setClasses] = useState<Class[]>([]);
    const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingClass, setEditingClass] = useState<Class | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [dayFilter, setDayFilter] = useState<number | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const [formData, setFormData] = useState<ClassFormData>({
        name: '',
        description: '',
        category: '',
        instructor_id: '',
        instructor_name: '',
        day_of_week: 1,
        start_time: '09:00',
        duration_minutes: 60,
        max_capacity: 20,
        price_cents: 2000,
        acuity_appointment_type_id: ''
    });

    // Time component state for 12-hour format
    const [timeHour, setTimeHour] = useState('9');
    const [timeMinute, setTimeMinute] = useState('00');
    const [timePeriod, setTimePeriod] = useState<'am' | 'pm'>('am');

    const [errors, setErrors] = useState<Partial<Record<keyof ClassFormData, string>>>({});

    useEffect(() => {
        if (isAuthenticated && !user?.roles?.includes('admin')) {
            router.push('/');
            return;
        }

        if (isAuthenticated) {
            fetchClasses();
            fetchTrainers();
        }
    }, [isAuthenticated, user, router]);

    useEffect(() => {
        let filtered = classes;

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(c =>
                statusFilter === 'active' ? c.is_active : !c.is_active
            );
        }

        // Filter by day
        if (dayFilter !== null) {
            filtered = filtered.filter(c => c.day_of_week === dayFilter);
        }

        // Filter by category
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(c => c.category === categoryFilter);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(c =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.instructor_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredClasses(filtered);
    }, [classes, statusFilter, dayFilter, categoryFilter, searchTerm]);

    const fetchClasses = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('auth_token');

            const response = await fetch(`${apiUrl}/classes`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setClasses(data);
                setFilteredClasses(data);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrainers = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('auth_token');

            const response = await fetch(`${apiUrl}/trainers/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTrainers(data);
            }
        } catch (error) {
            console.error('Error fetching trainers:', error);
        }
    };

    const openCreateModal = () => {
        setEditingClass(null);
        setFormData({
            name: '',
            description: '',
            category: '',
            instructor_id: '',
            instructor_name: '',
            day_of_week: 1,
            start_time: '09:00',
            duration_minutes: 60,
            max_capacity: 20,
            price_cents: 2000,
            acuity_appointment_type_id: ''
        });
        // Initialize time components
        setTimeHour('9');
        setTimeMinute('00');
        setTimePeriod('am');
        setErrors({});
        setCurrentStep(1);
        setShowModal(true);
    };

    const openEditModal = (classItem: Class) => {
        setEditingClass(classItem);
        setFormData({
            name: classItem.name,
            description: classItem.description,
            category: classItem.category,
            instructor_id: classItem.instructor_id || '',
            instructor_name: classItem.instructor_name,
            day_of_week: classItem.day_of_week,
            start_time: classItem.start_time,
            duration_minutes: classItem.duration_minutes,
            max_capacity: classItem.max_capacity,
            price_cents: classItem.price_cents,
            acuity_appointment_type_id: classItem.acuity_appointment_type_id || ''
        });
        // Convert 24-hour time to 12-hour components
        const time12 = convertTo12Hour(classItem.start_time);
        setTimeHour(time12.hour);
        setTimeMinute(time12.minute);
        setTimePeriod(time12.period);
        setErrors({});
        setCurrentStep(1);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingClass(null);
        setCurrentStep(1);
        setErrors({});
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Partial<Record<keyof ClassFormData, string>> = {};

        if (step === 1) {
            if (!formData.name.trim()) newErrors.name = 'Class name is required';
            if (!formData.description.trim()) newErrors.description = 'Description is required';
            if (!formData.category) newErrors.category = 'Category is required';
        } else if (step === 2) {
            if (!formData.start_time) newErrors.start_time = 'Start time is required';
            if (formData.duration_minutes < 15) newErrors.duration_minutes = 'Duration must be at least 15 minutes';
        } else if (step === 3) {
            if (!formData.instructor_id) newErrors.instructor_id = 'Instructor is required';
            if (formData.max_capacity < 1) newErrors.max_capacity = 'Capacity must be at least 1';
            if (formData.price_cents < 0) newErrors.price_cents = 'Price cannot be negative';
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
        if (!validateStep(3)) return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('auth_token');

            const url = editingClass
                ? `${apiUrl}/classes/${editingClass.id}`
                : `${apiUrl}/classes`;

            const method = editingClass ? 'PUT' : 'POST';

            // Convert 12-hour time to 24-hour format before submitting
            const time24 = convertTo24Hour(timeHour, timeMinute, timePeriod);
            const submitData = {
                ...formData,
                start_time: time24
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(submitData)
            });

            if (response.ok) {
                fetchClasses();
                closeModal();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to save class');
            }
        } catch (error) {
            console.error('Error saving class:', error);
            alert('Failed to save class');
        }
    };

    const toggleClassStatus = async (classId: string, currentStatus: boolean) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('auth_token');

            const response = await fetch(`${apiUrl}/classes/${classId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ is_active: !currentStatus })
            });

            if (response.ok) {
                fetchClasses();
            }
        } catch (error) {
            console.error('Error toggling class status:', error);
        }
    };

    const handleTrainerChange = (trainerId: string) => {
        const trainer = trainers.find(t => t.id === trainerId);
        setFormData({
            ...formData,
            instructor_id: trainerId,
            instructor_name: trainer ? trainer.full_name : ''
        });
    };

    if (!isAuthenticated || !user?.roles?.includes('admin')) {
        return null;
    }

    const activeClasses = classes.filter(c => c.is_active);
    const inactiveClasses = classes.filter(c => !c.is_active);
    const categoryCounts = classes.reduce((acc, c) => {
        acc[c.category] = (acc[c.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Class <span className="text-gradient">Management</span>
                        </h1>
                        <p className="text-gray-400">Manage fitness classes, schedules, and instructors</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="px-6 py-3 bg-gradient-to-r from-teal-6 to-teal-6 hover:from-teal-700 hover:to-teal-700 text-white font-bold rounded-lg transition-all transform hover:scale-105"
                    >
                        + Add New Class
                    </button>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl font-bold text-teal-4">{classes.length}</div>
                        <div className="text-gray-400 mt-1">Total Classes</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl font-bold text-green-400">{activeClasses.length}</div>
                        <div className="text-gray-400 mt-1">Active</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl font-bold text-gray-400">{inactiveClasses.length}</div>
                        <div className="text-gray-400 mt-1">Inactive</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl font-bold text-blue-400">{Object.keys(categoryCounts).length}</div>
                        <div className="text-gray-400 mt-1">Categories</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="glass rounded-xl p-6 mb-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search classes or instructors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-4"
                        />

                        {/* Status filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active Only</option>
                            <option value="inactive">Inactive Only</option>
                        </select>

                        {/* Day filter */}
                        <select
                            value={dayFilter === null ? 'all' : dayFilter}
                            onChange={(e) => setDayFilter(e.target.value === 'all' ? null : parseInt(e.target.value))}
                            className="px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                        >
                            <option value="all">All Days</option>
                            {DAYS.map((day, index) => (
                                <option key={index} value={index}>{day}</option>
                            ))}
                        </select>

                        {/* Category filter */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                        >
                            <option value="all">All Categories</option>
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Classes table */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-4"></div>
                        <p className="mt-4 text-gray-400">Loading classes...</p>
                    </div>
                ) : (
                    <div className="glass rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Class Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Category</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Instructor</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Schedule</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Capacity</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Price</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {filteredClasses.map((classItem) => (
                                        <tr key={classItem.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-white">{classItem.name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">{classItem.category}</td>
                                            <td className="px-6 py-4 text-gray-400">{classItem.instructor_name}</td>
                                            <td className="px-6 py-4 text-gray-400">
                                                {DAYS[classItem.day_of_week]} {formatTime12Hour(classItem.start_time)}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">{classItem.max_capacity}</td>
                                            <td className="px-6 py-4 text-gray-400">${(classItem.price_cents / 100).toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${classItem.is_active
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-gray-500/20 text-gray-400'
                                                    }`}>
                                                    {classItem.is_active ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openEditModal(classItem)}
                                                        className="px-3 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg text-sm font-semibold transition-all"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => toggleClassStatus(classItem.id, classItem.is_active)}
                                                        className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${classItem.is_active
                                                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                            }`}
                                                    >
                                                        {classItem.is_active ? 'Unpublish' : 'Publish'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredClasses.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                No classes found matching your criteria.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold">
                                    {editingClass ? 'Edit Class' : 'Create New Class'}
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
                                            ? 'bg-gradient-to-r from-teal-6 to-teal-6 text-white'
                                            : 'bg-white/10 text-gray-400'
                                            }`}>
                                            {step}
                                        </div>
                                        {step < 4 && (
                                            <div className={`w-16 h-1 mx-2 ${currentStep > step ? 'bg-teal-6' : 'bg-white/10'
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
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Class Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                            placeholder="e.g., Power Yoga"
                                        />
                                        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Description *</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                            rows={4}
                                            placeholder="Describe the class..."
                                        />
                                        {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Category *</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                        >
                                            <option value="">Select a category</option>
                                            {CATEGORIES.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Schedule */}
                            {currentStep === 2 && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold mb-4">Schedule</h3>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Day of Week *</label>
                                        <select
                                            value={formData.day_of_week}
                                            onChange={(e) => setFormData({ ...formData, day_of_week: parseInt(e.target.value) })}
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                        >
                                            {DAYS.map((day, index) => (
                                                <option key={index} value={index}>{day}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Start Time *</label>
                                        <div className="flex gap-2">
                                            {/* Hour dropdown */}
                                            <select
                                                value={timeHour}
                                                onChange={(e) => setTimeHour(e.target.value)}
                                                className="flex-1 px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => (
                                                    <option key={h} value={h.toString()}>{h}</option>
                                                ))}
                                            </select>

                                            {/* Minute dropdown */}
                                            <select
                                                value={timeMinute}
                                                onChange={(e) => setTimeMinute(e.target.value)}
                                                className="flex-1 px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                            >
                                                {['00', '15', '30', '45'].map(m => (
                                                    <option key={m} value={m}>{m}</option>
                                                ))}
                                            </select>

                                            {/* AM/PM toggle */}
                                            <div className="flex gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setTimePeriod('am')}
                                                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${timePeriod === 'am'
                                                            ? 'bg-gradient-to-r from-teal-6 to-teal-6 text-white'
                                                            : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                                        }`}
                                                >
                                                    AM
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setTimePeriod('pm')}
                                                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${timePeriod === 'pm'
                                                            ? 'bg-gradient-to-r from-teal-6 to-teal-6 text-white'
                                                            : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                                        }`}
                                                >
                                                    PM
                                                </button>
                                            </div>
                                        </div>
                                        {errors.start_time && <p className="text-red-400 text-sm mt-1">{errors.start_time}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Duration (minutes) *</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={formData.duration_minutes}
                                            onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                            placeholder="60"
                                        />
                                        {errors.duration_minutes && <p className="text-red-400 text-sm mt-1">{errors.duration_minutes}</p>}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Details */}
                            {currentStep === 3 && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold mb-4">Class Details</h3>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Instructor *</label>
                                        <select
                                            value={formData.instructor_id}
                                            onChange={(e) => handleTrainerChange(e.target.value)}
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                        >
                                            <option value="">Select an instructor</option>
                                            {trainers.map((trainer) => (
                                                <option key={trainer.id} value={trainer.id}>
                                                    {trainer.full_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.instructor_id && <p className="text-red-400 text-sm mt-1">{errors.instructor_id}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Max Capacity *</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={formData.max_capacity}
                                            onChange={(e) => setFormData({ ...formData, max_capacity: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                            placeholder="20"
                                        />
                                        {errors.max_capacity && <p className="text-red-400 text-sm mt-1">{errors.max_capacity}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Price (USD) *</label>
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={(formData.price_cents / 100).toString()}
                                            onChange={(e) => setFormData({ ...formData, price_cents: Math.round(parseFloat(e.target.value || '0') * 100) })}
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                            placeholder="20.00"
                                        />
                                        {errors.price_cents && <p className="text-red-400 text-sm mt-1">{errors.price_cents}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Acuity Appointment Type ID</label>
                                        <input
                                            type="text"
                                            value={formData.acuity_appointment_type_id}
                                            onChange={(e) => setFormData({ ...formData, acuity_appointment_type_id: e.target.value })}
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                                            placeholder="Optional (e.g., 12345678)"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">ID from Acuity Scheduling for direct booking integration.</p>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Preview */}
                            {currentStep === 4 && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold mb-4">Review & Confirm</h3>

                                    <div className="glass rounded-lg p-6 space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Class Name:</span>
                                            <span className="text-white font-semibold">{formData.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Category:</span>
                                            <span className="text-white">{formData.category}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Instructor:</span>
                                            <span className="text-white">{formData.instructor_name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Schedule:</span>
                                            <span className="text-white">{DAYS[formData.day_of_week]} at {timeHour}:{timeMinute} {timePeriod}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Duration:</span>
                                            <span className="text-white">{formData.duration_minutes} minutes</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Max Capacity:</span>
                                            <span className="text-white">{formData.max_capacity} people</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Price:</span>
                                            <span className="text-white">${(formData.price_cents / 100).toFixed(2)}</span>
                                        </div>
                                        {formData.acuity_appointment_type_id && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Acuity ID:</span>
                                                <span className="text-white">{formData.acuity_appointment_type_id}</span>
                                            </div>
                                        )}
                                        <div className="pt-3 border-t border-white/10">
                                            <span className="text-gray-400">Description:</span>
                                            <p className="text-white mt-2">{formData.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Modal Actions */}
                            <div className="flex justify-between mt-8">
                                <button
                                    onClick={currentStep === 1 ? closeModal : prevStep}
                                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all"
                                >
                                    {currentStep === 1 ? 'Cancel' : 'Back'}
                                </button>

                                {currentStep < 4 ? (
                                    <button
                                        onClick={nextStep}
                                        className="px-6 py-3 bg-gradient-to-r from-teal-6 to-teal-6 hover:from-teal-700 hover:to-teal-700 text-white font-bold rounded-lg transition-all"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        className="px-6 py-3 bg-gradient-to-r from-teal-6 to-teal-6 hover:from-teal-700 hover:to-teal-700 text-white font-bold rounded-lg transition-all"
                                    >
                                        {editingClass ? 'Update Class' : 'Create Class'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
