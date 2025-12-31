'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

interface WorkoutTemplate {
    id: string;
    name: string;
    description?: string;
}

interface ProgramDay {
    week: number;
    day: number;
    template_id: string;
    template_name?: string;
}

export default function NewProgramPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
    const [loadingTemplates, setLoadingTemplates] = useState(true);
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [totalWeeks, setTotalWeeks] = useState(4);
    const [isPublic, setIsPublic] = useState(false);
    const [programDays, setProgramDays] = useState<ProgramDay[]>([]);
    
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Industry Leader Optimization: Use an indexed lookup for rendering days (O(1) vs O(N))
    const assignedByDay = useMemo(() => {
        const lookup: Record<string, ProgramDay[]> = {};
        programDays.forEach(d => {
            const key = `${d.week}-${d.day}`;
            if (!lookup[key]) lookup[key] = [];
            lookup[key].push(d);
        });
        return lookup;
    }, [programDays]);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated || (!user?.roles?.includes('trainer') && !user?.roles?.includes('admin'))) {
            router.push('/trainer');
            return;
        }
        fetchTemplates();
    }, [isAuthenticated, authLoading]);

    const fetchTemplates = async () => {
        try {
            const response = await apiClient.getWorkoutTemplates(true);
            if (response.data) {
                setTemplates(response.data);
            }
        } catch (err) {
            console.error('Error fetching templates:', err);
        } finally {
            setLoadingTemplates(false);
        }
    };

    const handleAddTemplate = (week: number, day: number, templateId: string) => {
        if (!templateId) return;
        
        const template = templates.find(t => t.id === templateId);
        
        const newDay: ProgramDay = {
            week,
            day,
            template_id: templateId,
            template_name: template?.name
        };

        setProgramDays(prev => {
            // Remove existing for same week/day/template (or just week/day if we only allow one)
            const filtered = prev.filter(d => !(d.week === week && d.day === day && d.template_id === templateId));
            return [...filtered, newDay];
        });
    };

    const handleRemoveTemplate = (week: number, day: number, templateId: string) => {
        setProgramDays(prev => prev.filter(d => !(d.week === week && d.day === day && d.template_id === templateId)));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            setError('Program name is required');
            return;
        }
        if (programDays.length === 0) {
            setError('Please add at least one workout to the program');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const response = await apiClient.createProgram({
                name,
                description,
                total_weeks: totalWeeks,
                is_public: isPublic,
                templates: programDays.map(d => ({
                    template_id: d.template_id,
                    week_number: d.week,
                    day_number: d.day
                }))
            });

            if (response.data) {
                router.push('/trainer/programs');
            } else {
                setError(response.error || 'Failed to create program');
            }
        } catch (err) {
            console.error('Error creating program:', err);
            setError('An unexpected error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loadingTemplates) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black page-container">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/trainer/programs" className="text-turquoise-surf hover:text-pacific-cyan mb-4 inline-block">
                        ← Back to Programs
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold">
                        Create <span className="text-gradient">Program</span>
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="glass-card">
                        <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-turquoise-surf rounded-full"></span>
                            Basic Information
                        </h2>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Program Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-turquoise-surf outline-none transition-all"
                                    placeholder="e.g. 12-Week Hypertrophy Master"
                                    required
                                />
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-turquoise-surf outline-none transition-all h-32"
                                    placeholder="What should clients expect from this program?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Duration (Weeks)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="52"
                                    value={totalWeeks}
                                    onChange={(e) => setTotalWeeks(parseInt(e.target.value))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-turquoise-surf outline-none transition-all"
                                />
                            </div>

                            <div className="flex items-center">
                                <label className="flex items-center gap-3 cursor-pointer group mt-6">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={isPublic}
                                            onChange={(e) => setIsPublic(e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-12 h-6 rounded-full transition-colors ${isPublic ? 'bg-turquoise-surf' : 'bg-white/10'}`}></div>
                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isPublic ? 'translate-x-6' : ''}`}></div>
                                    </div>
                                    <span className="text-gray-300 font-medium group-hover:text-white transition-colors">Make Program Public</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Builder */}
                    <div className="glass-card">
                        <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-cerulean rounded-full"></span>
                            Schedule Builder
                        </h2>

                        <div className="space-y-12">
                            {Array.from({ length: totalWeeks }).map((_, wIndex) => {
                                const week = wIndex + 1;
                                return (
                                    <div key={week} className="border-l-2 border-white/5 pl-6">
                                        <h3 className="text-2xl font-bold text-turquoise-surf mb-6 uppercase tracking-tighter">Week {week}</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                                            {[1, 2, 3, 4, 5, 6, 0].map((dayIndex) => {
                                                const dayNum = dayIndex === 0 ? 7 : dayIndex; // 1-7
                                                const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex];
                                                const assigned = assignedByDay[`${week}-${dayNum}`] || [];

                                                return (
                                                    <div key={dayNum} className="space-y-3">
                                                        <p className="text-[10px] font-bold text-gray-500 uppercase text-center">{dayName}</p>
                                                        
                                                        <div className="min-h-[100px] bg-white/5 rounded-xl p-2 border border-dashed border-white/10 flex flex-col gap-2">
                                                            {assigned.map((d, i) => (
                                                                <div key={i} className="bg-turquoise-surf/20 text-turquoise-surf text-[10px] p-2 rounded relative group border border-turquoise-surf/30">
                                                                    <span className="font-bold block truncate">{d.template_name}</span>
                                                                    <button 
                                                                        type="button"
                                                                        onClick={() => handleRemoveTemplate(week, dayNum, d.template_id)}
                                                                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[8px]"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            
                                                            <select
                                                                onChange={(e) => {
                                                                    handleAddTemplate(week, dayNum, e.target.value);
                                                                    e.target.value = '';
                                                                }}
                                                                className="w-full bg-black/40 border border-white/5 rounded p-1 text-[10px] text-gray-400 outline-none focus:border-turquoise-surf"
                                                                defaultValue=""
                                                            >
                                                                <option value="" disabled>+ Add</option>
                                                                {templates.map(t => (
                                                                    <option key={t.id} value={t.id}>{t.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary flex-1 py-4 text-lg"
                        >
                            {saving ? 'Creating Program...' : 'Create Program'}
                        </button>
                        <Link
                            href="/trainer/programs"
                            className="btn-secondary px-8 py-4 text-lg"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
