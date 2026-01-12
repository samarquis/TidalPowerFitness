'use client';
import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { CTAButton } from '@/components/ui';
import { formatTime12Hour } from "@/lib/utils";

interface Class {
    id: string;
    name: string;
    description: string;
    category: string;
    instructor_id?: string;
    instructor_name: string;
    day_of_week: number;
    days_of_week?: number[]; // New multi-day support
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
    days_of_week: number[];
    start_time: string;
    duration_minutes: number;
    max_capacity: number;
    price_cents: number;
    acuity_appointment_type_id: string;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function AdminClassesContent() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
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
        days_of_week: [1],
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
        if (searchParams?.get('action') === 'new') {
            const dayParam = searchParams.get('day');

            // Open modal first
            openCreateModal();

            // Then pre-select day if provided
            if (dayParam) {
                const dayIndex = parseInt(dayParam);
                if (!isNaN(dayIndex) && dayIndex >= 0 && dayIndex <= 6) {
                    setFormData(prev => ({
                        ...prev,
                        day_of_week: dayIndex,
                        days_of_week: [dayIndex]
                    }));
                }
            }
        }
    }, [searchParams]);

    useEffect(() => {
        if (isAuthenticated && user?.roles?.includes('admin')) {
            fetchInitialData();
        } else if (!loading && (!isAuthenticated || !user?.roles?.includes('admin'))) {
            router.push('/login');
        }
    }, [isAuthenticated, user, router, loading]);

    useEffect(() => {
        filterClasses();
    }, [searchTerm, dayFilter, categoryFilter, statusFilter, classes]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [classesRes, trainersRes] = await Promise.all([
                fetch('/api/classes'),
                fetch('/api/users/trainers')
            ]);

            if (classesRes.ok) {
                const data = await classesRes.json();
                setClasses(data);
            }

            if (trainersRes.ok) {
                const data = await trainersRes.json();
                setTrainers(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterClasses = () => {
        let filtered = [...classes];

        if (searchTerm) {
            filtered = filtered.filter(c => 
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.instructor_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (dayFilter !== null) {
            filtered = filtered.filter(c => {
                if (c.days_of_week && c.days_of_week.length > 0) {
                    return c.days_of_week.includes(dayFilter);
                }
                return c.day_of_week === dayFilter;
            });
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(c => c.category === categoryFilter);
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(c => 
                statusFilter === 'active' ? c.is_active : !c.is_active
            );
        }

        setFilteredClasses(filtered);
    };

    const openCreateModal = () => {
        setEditingClass(null);
        setFormData({
            name: '',
            description: '',
            category: 'Strength Training',
            instructor_id: '',
            instructor_name: '',
            day_of_week: 1,
            days_of_week: [1],
            start_time: '09:00',
            duration_minutes: 60,
            max_capacity: 20,
            price_cents: 2000,
            acuity_appointment_type_id: ''
        });
        setTimeHour('9');
        setTimeMinute('00');
        setTimePeriod('am');
        setCurrentStep(1);
        setErrors({});
        setShowModal(true);
    };

    const openEditModal = (classItem: Class) => {
        setEditingClass(classItem);
        
        // Parse time
        const [hourStr, minuteStr] = classItem.start_time.split(':');
        let hour = parseInt(hourStr);
        const minute = minuteStr;
        const period = hour >= 12 ? 'pm' : 'am';
        
        if (hour > 12) hour -= 12;
        if (hour === 0) hour = 12;

        setFormData({
            name: classItem.name,
            description: classItem.description,
            category: classItem.category,
            instructor_id: classItem.instructor_id || '',
            instructor_name: classItem.instructor_name,
            day_of_week: classItem.day_of_week,
            days_of_week: classItem.days_of_week || [classItem.day_of_week],
            start_time: classItem.start_time,
            duration_minutes: classItem.duration_minutes,
            max_capacity: classItem.max_capacity,
            price_cents: classItem.price_cents,
            acuity_appointment_type_id: classItem.acuity_appointment_type_id || ''
        });
        
        setTimeHour(hour.toString());
        setTimeMinute(minute);
        setTimePeriod(period);
        setCurrentStep(1);
        setErrors({});
        setShowModal(true);
    };

    const toggleDay = (dayIndex: number) => {
        setFormData(prev => {
            const currentDays = [...prev.days_of_week];
            const exists = currentDays.indexOf(dayIndex);
            
            if (exists !== -1) {
                // Don't remove if it's the last one
                if (currentDays.length > 1) {
                    currentDays.splice(exists, 1);
                }
            } else {
                currentDays.push(dayIndex);
            }
            
            return {
                ...prev,
                days_of_week: currentDays.sort((a, b) => a - b),
                day_of_week: currentDays[0] // Legacy support
            };
        });
    };

    const validateStep1 = () => {
        const newErrors: Partial<Record<keyof ClassFormData, string>> = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.instructor_id) newErrors.instructor_id = 'Instructor is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Partial<Record<keyof ClassFormData, string>> = {};
        if (formData.days_of_week.length === 0) newErrors.days_of_week = 'At least one day is required' as any;
        if (formData.duration_minutes <= 0) newErrors.duration_minutes = 'Duration must be positive';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        // Format time back to 24h
        let hour = parseInt(timeHour);
        if (timePeriod === 'pm' && hour < 12) hour += 12;
        if (timePeriod === 'am' && hour === 12) hour = 0;
        const formattedTime = `${hour.toString().padStart(2, '0')}:${timeMinute}`;

        const finalData = {
            ...formData,
            start_time: formattedTime,
            instructor_name: trainers.find(t => t.id === formData.instructor_id)?.full_name || ''
        };

        try {
            const url = editingClass ? `/api/classes/${editingClass.id}` : '/api/classes';
            const method = editingClass ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData)
            });

            if (response.ok) {
                setShowModal(false);
                fetchInitialData();
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error saving class:', error);
            alert('Failed to save class');
        }
    };

    const toggleStatus = async (classItem: Class) => {
        try {
            const response = await fetch(`/api/classes/${classItem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...classItem, is_active: !classItem.is_active })
            });

            if (response.ok) {
                fetchInitialData();
            }
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Class Management</h1>
                        <p className="text-gray-400">Create and manage gym classes and schedules</p>
                    </div>
                    <CTAButton onClick={openCreateModal}>
                        + Create New Class
                    </CTAButton>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-white/5 p-4 rounded-xl border border-white/10">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Search</label>
                        <input 
                            type="text"
                            placeholder="Search name or trainer..."
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-turquoise-surf outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Day</label>
                        <select 
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-turquoise-surf outline-none"
                            value={dayFilter === null ? 'all' : dayFilter}
                            onChange={(e) => setDayFilter(e.target.value === 'all' ? null : parseInt(e.target.value))}
                        >
                            <option value="all">All Days</option>
                            {DAYS.map((day, i) => (
                                <option key={i} value={i}>{day}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                        <select 
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-turquoise-surf outline-none"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            <option value="Strength Training">Strength Training</option>
                            <option value="Cardio">Cardio</option>
                            <option value="Yoga">Yoga</option>
                            <option value="HIIT">HIIT</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Status</label>
                        <select 
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-turquoise-surf outline-none"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active Only</option>
                            <option value="inactive">Inactive Only</option>
                        </select>
                    </div>
                </div>

                {/* Class List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClasses.map(classItem => (
                        <div key={classItem.id} className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-turquoise-surf/30 transition-all flex flex-col">
                            <div className="p-6 flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-3 py-1 bg-turquoise-surf/10 text-turquoise-surf text-xs font-bold rounded-full border border-turquoise-surf/20">
                                        {classItem.category}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${classItem.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></span>
                                        <span className="text-xs text-gray-400 capitalize">{classItem.is_active ? 'Active' : 'Inactive'}</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{classItem.name}</h3>
                                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{classItem.description}</p>
                                
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center text-sm text-gray-300">
                                        <span className="w-5 text-turquoise-surf">📅</span>
                                        <span>
                                            {classItem.days_of_week && classItem.days_of_week.length > 0 
                                                ? classItem.days_of_week.map(d => DAYS[d].substring(0, 3)).join(', ')
                                                : DAYS[classItem.day_of_week]}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-300">
                                        <span className="w-5 text-turquoise-surf">🕒</span>
                                        <span>{formatTime12Hour(classItem.start_time)} ({classItem.duration_minutes}m)</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-300">
                                        <span className="w-5 text-turquoise-surf">👤</span>
                                        <span>{classItem.instructor_name}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-300">
                                        <span className="w-5 text-turquoise-surf">👥</span>
                                        <span>{classItem.max_capacity} capacity</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 bg-white/5 border-t border-white/10 flex items-center justify-between gap-2">
                                <button 
                                    onClick={() => openEditModal(classItem)}
                                    className="flex-grow py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-lg transition-colors border border-white/10"
                                >
                                    Edit Class
                                </button>
                                <button 
                                    onClick={() => toggleStatus(classItem)}
                                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors border ${
                                        classItem.is_active 
                                            ? 'border-red-500/30 text-red-500 hover:bg-red-500/10' 
                                            : 'border-green-500/30 text-green-500 hover:bg-green-500/10'
                                    }`}
                                >
                                    {classItem.is_active ? 'Disable' : 'Enable'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredClasses.length === 0 && (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-white mb-2">No classes found</h3>
                        <p className="text-gray-400">Try adjusting your filters or search term</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-black border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {editingClass ? 'Edit Class' : 'Create New Class'}
                                </h2>
                                <p className="text-gray-400 text-sm">Step {currentStep} of 2</p>
                            </div>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-white/10 rounded-full text-gray-400"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 max-h-[70vh] overflow-y-auto">
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2">Class Name</label>
                                        <input 
                                            type="text"
                                            className={`w-full bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl p-3 text-white outline-none focus:border-turquoise-surf`}
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            placeholder="e.g. Morning Strength Elite"
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2">Description</label>
                                        <textarea 
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white h-24 outline-none focus:border-turquoise-surf"
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            placeholder="What is this class about?"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-400 mb-2">Category</label>
                                            <select 
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-turquoise-surf"
                                                value={formData.category}
                                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                            >
                                                <option value="Strength Training">Strength Training</option>
                                                <option value="Cardio">Cardio</option>
                                                <option value="Yoga">Yoga</option>
                                                <option value="HIIT">HIIT</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-400 mb-2">Instructor</label>
                                            <select 
                                                className={`w-full bg-white/5 border ${errors.instructor_id ? 'border-red-500' : 'border-white/10'} rounded-xl p-3 text-white outline-none focus:border-turquoise-surf`}
                                                value={formData.instructor_id}
                                                onChange={(e) => setFormData({...formData, instructor_id: e.target.value})}
                                            >
                                                <option value="">Select Instructor</option>
                                                {trainers.map(t => (
                                                    <option key={t.id} value={t.id}>{t.full_name}</option>
                                                ))}
                                            </select>
                                            {errors.instructor_id && <p className="text-red-500 text-xs mt-1">{errors.instructor_id}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-3">Schedule (Select Days)</label>
                                        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                                            {DAYS.map((day, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => toggleDay(i)}
                                                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                                                        formData.days_of_week.includes(i)
                                                            ? 'bg-turquoise-surf text-black border-turquoise-surf'
                                                            : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'
                                                    }`}
                                                >
                                                    {day.substring(0, 3)}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.days_of_week && <p className="text-red-500 text-xs mt-1">At least one day is required</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-400 mb-2">Start Time</label>
                                            <div className="flex items-center gap-2">
                                                <select 
                                                    className="flex-grow bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-turquoise-surf"
                                                    value={timeHour}
                                                    onChange={(e) => setTimeHour(e.target.value)}
                                                >
                                                    {[12,1,2,3,4,5,6,7,8,9,10,11].map(h => (
                                                        <option key={h} value={h}>{h}</option>
                                                    ))}
                                                </select>
                                                <span className="text-white">:</span>
                                                <select 
                                                    className="flex-grow bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-turquoise-surf"
                                                    value={timeMinute}
                                                    onChange={(e) => setTimeMinute(e.target.value)}
                                                >
                                                    {['00','15','30','45'].map(m => (
                                                        <option key={m} value={m}>{m}</option>
                                                    ))}
                                                </select>
                                                <select 
                                                    className="w-20 bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-turquoise-surf"
                                                    value={timePeriod}
                                                    onChange={(e) => setTimePeriod(e.target.value as any)}
                                                >
                                                    <option value="am">AM</option>
                                                    <option value="pm">PM</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-400 mb-2">Duration (Min)</label>
                                            <input 
                                                type="number"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-turquoise-surf"
                                                value={formData.duration_minutes}
                                                onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-400 mb-2">Capacity</label>
                                            <input 
                                                type="number"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-turquoise-surf"
                                                value={formData.max_capacity}
                                                onChange={(e) => setFormData({...formData, max_capacity: parseInt(e.target.value)})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-400 mb-2">Price (Cents)</label>
                                            <input 
                                                type="number"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-turquoise-surf"
                                                value={formData.price_cents}
                                                onChange={(e) => setFormData({...formData, price_cents: parseInt(e.target.value)})}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2">Acuity Appointment Type ID</label>
                                        <input 
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-turquoise-surf"
                                            value={formData.acuity_appointment_type_id}
                                            onChange={(e) => setFormData({...formData, acuity_appointment_type_id: e.target.value})}
                                            placeholder="Optional: for direct booking links"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-white/10 bg-white/5 flex justify-between">
                            {currentStep === 2 ? (
                                <button 
                                    onClick={() => setCurrentStep(1)}
                                    className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    Back
                                </button>
                            ) : (
                                <div></div>
                            )}
                            
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                {currentStep === 1 ? (
                                    <CTAButton onClick={() => validateStep1() && setCurrentStep(2)}>
                                        Next Step
                                    </CTAButton>
                                ) : (
                                    <CTAButton onClick={() => validateStep2() && handleSave()}>
                                        {editingClass ? 'Update Class' : 'Create Class'}
                                    </CTAButton>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AdminClassesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
            </div>
        }>
            <AdminClassesContent />
        </Suspense>
    );
}
