'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

interface Metric {
    log_date: string;
    weight_lbs?: number;
    body_fat_percentage?: number;
    muscle_mass_lbs?: number;
}

interface PersonalRecord {
    exercise_name: string;
    record_type: string;
    value: number;
    achieved_at: string;
}

export default function ProgressDashboard({ clientId }: { clientId: string }) {
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [records, setRecords] = useState<PersonalRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [showLogForm, setShowLogForm] = useState(false);

    // Form state
    const [weight, setWeight] = useState('');
    const [bodyFat, setBodyFat] = useState('');
    const [logging, setLogging] = useState(false);

    useEffect(() => {
        fetchProgress();
    }, [clientId]);

    const fetchProgress = async () => {
        setLoading(true);
        try {
            const [metricsRes, recordsRes] = await Promise.all([
                apiClient.getMetrics(clientId),
                apiClient.getPersonalRecords(clientId)
            ]);

            if (metricsRes.data) setMetrics(metricsRes.data);
            if (recordsRes.data) setRecords(recordsRes.data);
        } catch (error) {
            console.error('Error fetching progress:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogMetric = async (e: React.FormEvent) => {
        e.preventDefault();
        setLogging(true);
        try {
            const response = await apiClient.logMetric({
                weight_lbs: parseFloat(weight) || undefined,
                body_fat_percentage: parseFloat(bodyFat) || undefined,
                log_date: new Date()
            });

            if (response.data) {
                setShowLogForm(false);
                setWeight('');
                setBodyFat('');
                fetchProgress();
            }
        } catch (error) {
            console.error('Error logging metric:', error);
        } finally {
            setLogging(false);
        }
    };

    if (loading) return <div className="animate-pulse space-y-4 pr-4"><div className="h-48 bg-white/5 rounded-xl"></div></div>;

    return (
        <div className="space-y-8">
            {/* Header with Log Button */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Body Metrics</h2>
                <button
                    onClick={() => setShowLogForm(!showLogForm)}
                    className="px-4 py-2 bg-cerulean/20 hover:bg-cerulean/30 text-turquoise-surf border border-cerulean/50 rounded-lg text-sm font-semibold transition-all"
                >
                    {showLogForm ? 'Cancel' : 'Log Measurements'}
                </button>
            </div>

            {/* Log Form */}
            {showLogForm && (
                <div className="glass p-6 rounded-xl border-pacific-cyan/30">
                    <form onSubmit={handleLogMetric} className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 uppercase mb-2">Weight (lbs)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-pacific-cyan outline-none"
                                placeholder="0.0"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 uppercase mb-2">Body Fat %</label>
                            <input
                                type="number"
                                step="0.1"
                                value={bodyFat}
                                onChange={(e) => setBodyFat(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-pacific-cyan outline-none"
                                placeholder="0.0"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={logging}
                                className="w-full py-2 bg-cerulean hover:bg-pacific-cyan text-white font-bold rounded-lg transition-all disabled:opacity-50"
                            >
                                {logging ? 'Saving...' : 'Save Measurements'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Metrics Overview / Trend (Simplified) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-xl">
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-4">Weight Trend</h3>
                    {metrics.length > 0 ? (
                        <div className="space-y-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-white">{metrics[0].weight_lbs}</span>
                                <span className="text-gray-500">lbs</span>
                                {metrics.length > 1 && (
                                    <span className={`text-sm ml-2 ${metrics[0].weight_lbs! < metrics[1].weight_lbs! ? 'text-green-400' : 'text-red-400'}`}>
                                        {metrics[0].weight_lbs! < metrics[1].weight_lbs! ? '↓' : '↑'}
                                        {Math.abs(metrics[0].weight_lbs! - metrics[1].weight_lbs!).toFixed(1)} lbs
                                    </span>
                                )}
                            </div>
                            <div className="h-24 flex items-end gap-1">
                                {metrics.slice(0, 10).reverse().map((m, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-pacific-cyan/20 hover:bg-pacific-cyan/40 rounded-t transition-all cursor-help relative group"
                                        style={{ height: `${(m.weight_lbs! / Math.max(...metrics.map(x => x.weight_lbs! || 1))) * 100}%` }}
                                    >
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-[10px] px-2 py-1 rounded whitespace-nowrap z-20">
                                            {m.weight_lbs} lbs - {new Date(m.log_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic py-8 text-center text-sm">No weight data logged yet.</p>
                    )}
                </div>

                <div className="glass p-6 rounded-xl">
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-4">Body Fat %</h3>
                    {metrics.length > 0 && metrics[0].body_fat_percentage ? (
                        <div className="space-y-4">
                            <div className="text-4xl font-bold text-white">{metrics[0].body_fat_percentage}%</div>
                            <div className="h-24 flex items-end gap-1">
                                {metrics.slice(0, 10).reverse().map((m, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-blue-500/20 hover:bg-blue-500/40 rounded-t transition-all"
                                        style={{ height: `${(m.body_fat_percentage || 0) * 4}%` }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic py-8 text-center text-sm">No body fat data logged yet.</p>
                    )}
                </div>
            </div>

            {/* Personal Records */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Personal Records</h2>
                {records.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {records.map((record, i) => (
                            <div key={i} className="glass p-5 rounded-xl border-l border-l-yellow-500/50 hover:border-l-yellow-400 transition-all group">
                                <div className="text-xs text-yellow-500/70 font-bold uppercase tracking-widest mb-1 flex justify-between">
                                    <span>{record.record_type.replace('_', ' ')}</span>
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">🏆</span>
                                </div>
                                <h4 className="text-white font-bold text-lg mb-2">{record.exercise_name}</h4>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-2xl font-bold text-white">
                                        {record.value.toLocaleString()}
                                        <span className="text-xs text-gray-500 ml-1 font-normal uppercase">
                                            {record.record_type.includes('weight') || record.record_type.includes('volume') ? 'lbs' : 'reps'}
                                        </span>
                                    </span>
                                    <span className="text-[10px] text-gray-500">{new Date(record.achieved_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass p-12 text-center text-gray-500 italic rounded-xl">
                        PRs will appear here as you log workouts!
                    </div>
                )}
            </div>
        </div>
    );
}
