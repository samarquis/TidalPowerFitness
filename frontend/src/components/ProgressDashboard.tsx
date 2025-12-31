'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

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
    const [volumeTrend, setVolumeTrend] = useState<any[]>([]);
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
            const [metricsRes, recordsRes, volumeRes] = await Promise.all([
                apiClient.getMetrics(clientId),
                apiClient.getPersonalRecords(clientId),
                apiClient.getVolumeTrend(clientId)
            ]);

            if (metricsRes.data) setMetrics(metricsRes.data);
            if (recordsRes.data) setRecords(recordsRes.data);
            if (volumeRes.data) setVolumeTrend(volumeRes.data);
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

            {/* Metrics Overview / Trend */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card">
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">Weight Trend (lbs)</h3>
                    {metrics.length > 0 ? (
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={[...metrics].reverse().map(m => ({
                                        date: new Date(m.log_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                                        weight: m.weight_lbs
                                    }))}
                                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis 
                                        dataKey="date" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#666', fontSize: 10 }}
                                        minTickGap={20}
                                    />
                                    <YAxis 
                                        hide={true} 
                                        domain={['dataMin - 5', 'dataMax + 5']}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#00f2ff' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="weight" 
                                        stroke="#00f2ff" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorWeight)" 
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic py-20 text-center text-sm">No weight data logged yet.</p>
                    )}
                </div>

                <div className="glass-card">
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">Body Fat Trend (%)</h3>
                    {metrics.length > 0 && metrics.some(m => m.body_fat_percentage) ? (
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={[...metrics].reverse().filter(m => m.body_fat_percentage).map(m => ({
                                        date: new Date(m.log_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                                        fat: m.body_fat_percentage
                                    }))}
                                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorFat" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis 
                                        dataKey="date" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#666', fontSize: 10 }}
                                        minTickGap={20}
                                    />
                                    <YAxis 
                                        hide={true} 
                                        domain={['dataMin - 2', 'dataMax + 2']}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#3b82f6' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="fat" 
                                        stroke="#3b82f6" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorFat)" 
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic py-20 text-center text-sm">No body fat data logged yet.</p>
                    )}
                </div>
            </div>

            {/* Volume Trend */}
            <div className="glass-card">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">Workout Volume Trend (lbs)</h3>
                {volumeTrend.length > 0 ? (
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={volumeTrend.map(v => ({
                                    date: new Date(v.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                                    volume: parseFloat(v.volume)
                                }))}
                                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#666', fontSize: 10 }}
                                    minTickGap={20}
                                />
                                <YAxis 
                                    hide={true}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#a855f7' }}
                                    formatter={(value: number) => [`${value.toLocaleString()} lbs`, 'Volume']}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="volume" 
                                    stroke="#a855f7" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorVolume)" 
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="text-gray-500 italic py-20 text-center text-sm">No workout volume data available yet.</p>
                )}
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
