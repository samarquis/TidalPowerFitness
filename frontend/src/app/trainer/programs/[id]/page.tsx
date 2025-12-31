'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

interface ProgramTemplate {
    template_id: string;
    template_name: string;
    week_number: number;
    day_number: number;
}

interface Program {
    id: string;
    name: string;
    description: string;
    total_weeks: number;
    trainer_name: string;
    trainer_id: string;
    templates: ProgramTemplate[];
    collaborators?: Array<{
        trainer_id: string;
        first_name: string;
        last_name: string;
        email: string;
        can_edit: boolean;
    }>;
}

export default function ProgramDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [program, setProgram] = useState<Program | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Collaborator state
    const [showAddModal, setShowAddModal] = useState(false);
    const [allTrainers, setAllTrainers] = useState<any[]>([]);
    const [selectedTrainerId, setSelectedTrainerId] = useState('');
    const [canEdit, setCanEdit] = useState(false);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated || (!user?.roles?.includes('trainer') && !user?.roles?.includes('admin'))) {
            router.push('/trainer');
            return;
        }
        fetchProgram();
        fetchTrainers();
    }, [isAuthenticated, authLoading, id]);

    const fetchProgram = async () => {
        try {
            const response = await apiClient.getProgram(id);
            if (response.data) {
                setProgram(response.data);
            } else {
                setError(response.error || 'Failed to load program');
            }
        } catch (err) {
            console.error('Error fetching program:', err);
            setError('Failed to load program');
        } finally {
            setLoading(false);
        }
    };

    const fetchTrainers = async () => {
        try {
            const response = await apiClient.getTrainerUsers();
            if (response.data) {
                setAllTrainers(response.data);
            }
        } catch (err) {
            console.error('Error fetching trainers:', err);
        }
    };

    const handleAddCollaborator = async () => {
        if (!selectedTrainerId) return;
        try {
            const response = await (apiClient as any).request(`/programs/${id}/collaborators`, {
                method: 'POST',
                body: JSON.stringify({ trainer_id: selectedTrainerId, can_edit: canEdit })
            });
            if (response.data) {
                setShowAddModal(false);
                setSelectedTrainerId('');
                fetchProgram();
            }
        } catch (err) {
            console.error('Error adding collaborator:', err);
        }
    };

    const handleRemoveCollaborator = async (trainerId: string) => {
        if (!confirm('Are you sure you want to remove this collaborator?')) return;
        try {
            const response = await (apiClient as any).request(`/programs/${id}/collaborators/${trainerId}`, {
                method: 'DELETE'
            });
            if (response.data) {
                fetchProgram();
            }
        } catch (err) {
            console.error('Error removing collaborator:', err);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
            </div>
        );
    }

    if (!program) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Program not found</h2>
                    <Link href="/trainer/programs" className="btn-primary">Back to Programs</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black page-container">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <Link href="/trainer/programs" className="text-turquoise-surf hover:text-pacific-cyan mb-4 inline-block">
                            ← Back to Programs
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            {program.name}
                        </h1>
                        <div className="flex items-center gap-4 text-gray-400">
                            <span className="bg-white/5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                                {program.total_weeks} Week Routine
                            </span>
                            <span>Created by {program.trainer_name}</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Link href={`/trainer/programs/${id}/assign`} className="btn-primary">
                            Assign to Client
                        </Link>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Description & Collaborators */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="glass-card">
                            <h2 className="text-xl font-bold mb-4">About this Program</h2>
                            <p className="text-gray-400 leading-relaxed">
                                {program.description || 'No description provided.'}
                            </p>
                        </div>

                        {/* Collaborators Section */}
                        {(program.trainer_id === user?.id || user?.roles?.includes('admin')) && (
                            <div className="glass-card">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="text-lg">🤝</span> Collaborators
                                </h2>
                                
                                <div className="space-y-4 mb-6">
                                    {program.collaborators && program.collaborators.length > 0 ? (
                                        program.collaborators.map(c => (
                                            <div key={c.trainer_id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                                <div>
                                                    <p className="text-sm font-bold text-white">{c.first_name} {c.last_name}</p>
                                                    <p className="text-[10px] text-gray-500">{c.can_edit ? 'Full Access' : 'View Only'}</p>
                                                </div>
                                                <button 
                                                    onClick={() => handleRemoveCollaborator(c.trainer_id)}
                                                    className="text-gray-600 hover:text-red-400 transition-colors"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-500 italic">No collaborators assigned yet.</p>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                    <button 
                                        onClick={() => setShowAddModal(true)}
                                        className="w-full py-2 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest text-turquoise-surf border border-turquoise-surf/20 rounded-lg transition-all"
                                    >
                                        + Add Collaborator
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Schedule */}
                    <div className="lg:col-span-2 space-y-12">
                        {Array.from({ length: program.total_weeks }).map((_, wIndex) => {
                            const week = wIndex + 1;
                            const weekTemplates = program.templates.filter(t => t.week_number === week);
                            
                            return (
                                <div key={week} className="glass-card">
                                    <h3 className="text-2xl font-bold text-turquoise-surf mb-8 border-b border-white/5 pb-4">Week {week}</h3>
                                    
                                    <div className="space-y-6">
                                        {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                                            const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dayNum - 1];
                                            const dayTemplates = weekTemplates.filter(t => t.day_number === dayNum);

                                            return (
                                                <div key={dayNum} className="flex gap-6 group">
                                                    <div className="w-24 shrink-0">
                                                        <p className="text-xs font-bold text-gray-500 uppercase mt-1">{dayName}</p>
                                                    </div>
                                                    <div className="flex-1">
                                                        {dayTemplates.length > 0 ? (
                                                            <div className="space-y-3">
                                                                {dayTemplates.map((t, i) => (
                                                                    <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-turquoise-surf/30 transition-all">
                                                                        <div className="flex justify-between items-center">
                                                                            <h4 className="font-bold text-white">{t.template_name}</h4>
                                                                            <Link 
                                                                                href={`/workouts/templates/${t.template_id}`}
                                                                                className="text-[10px] font-bold text-turquoise-surf uppercase hover:underline"
                                                                            >
                                                                                View Template
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="h-px bg-white/5 w-full mt-3"></div>
                                                        )}
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
            </div>

            {/* Add Collaborator Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="glass-card max-w-md w-full border-turquoise-surf/30 shadow-2xl">
                        <h3 className="text-xl font-bold mb-6">Add Collaborator</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Select Trainer</label>
                                <select 
                                    value={selectedTrainerId}
                                    onChange={(e) => setSelectedTrainerId(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-turquoise-surf outline-none"
                                >
                                    <option value="" disabled>Choose a trainer...</option>
                                    {allTrainers
                                        .filter(t => t.id !== program.trainer_id && !program.collaborators?.some(c => c.trainer_id === t.id))
                                        .map(t => (
                                            <option key={t.id} value={t.id}>{t.full_name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className="flex items-center gap-3">
                                <input 
                                    type="checkbox" 
                                    id="canEdit" 
                                    checked={canEdit}
                                    onChange={(e) => setCanEdit(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-turquoise-surf focus:ring-turquoise-surf"
                                />
                                <label htmlFor="canEdit" className="text-sm text-gray-300">Allow collaborator to edit this program</label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleAddCollaborator}
                                    disabled={!selectedTrainerId}
                                    className="flex-1 py-2 bg-turquoise-surf text-black rounded-lg font-bold hover:bg-pacific-cyan transition-all disabled:opacity-50"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
