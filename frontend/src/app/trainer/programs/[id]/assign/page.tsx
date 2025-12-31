'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

interface Client {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface Program {
    id: string;
    name: string;
}

export default function AssignProgramPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedClientId = searchParams ? searchParams.get('client') : null;
    
    const [clients, setClients] = useState<Client[]>([]);
    const [program, setProgram] = useState<Program | null>(null);
    const [loading, setLoading] = useState(true);
    
    const [selectedClientId, setSelectedClientId] = useState(preselectedClientId || '');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated || (!user?.roles?.includes('trainer') && !user?.roles?.includes('admin'))) {
            router.push('/trainer');
            return;
        }
        fetchData();
    }, [isAuthenticated, authLoading, id]);

    const fetchData = async () => {
        try {
            const [clientsRes, programRes] = await Promise.all([
                apiClient.getTrainerUsers(),
                apiClient.getProgram(id)
            ]);

            if (clientsRes.data) {
                setClients(clientsRes.data);
                if (preselectedClientId) {
                    setSelectedClientId(preselectedClientId);
                }
            }
            if (programRes.data) setProgram(programRes.data);
        } catch (err) {
            console.error('Error fetching assignment data:', err);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClientId) {
            setError('Please select a client');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const response = await apiClient.assignProgram({
                client_id: selectedClientId,
                program_id: id,
                start_date: startDate,
                notes
            });

            if (response.data) {
                router.push(`/trainer/programs/${id}`);
            } else {
                setError(response.error || 'Failed to assign program');
            }
        } catch (err) {
            console.error('Error assigning program:', err);
            setError('An unexpected error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black page-container">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link href={`/trainer/programs/${id}`} className="text-turquoise-surf hover:text-pacific-cyan mb-4 inline-block">
                        ← Back to Program Details
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Assign <span className="text-gradient">Program</span>
                    </h1>
                    <p className="text-gray-400 text-lg">Assigning <span className="text-white font-bold">{program?.name}</span> to a client.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="glass-card">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Select Client</label>
                                <select
                                    value={selectedClientId}
                                    onChange={(e) => setSelectedClientId(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-turquoise-surf outline-none transition-all"
                                    required
                                >
                                    <option value="" disabled>Choose a client...</option>
                                    {clients.map(client => (
                                        <option key={client.id} value={client.id}>
                                            {client.first_name} {client.last_name} ({client.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-turquoise-surf outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Private Notes for Client</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-turquoise-surf outline-none transition-all h-32"
                                    placeholder="e.g. Focus on quality of movement during the first two weeks."
                                />
                            </div>
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
                            {saving ? 'Assigning...' : 'Confirm Assignment'}
                        </button>
                        <Link
                            href={`/trainer/programs/${id}`}
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
