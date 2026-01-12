'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import Skeleton from '@/components/ui/Skeleton';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

interface RevenueSummary {
    total_revenue_cents: string;
    total_transactions: string;
}

interface RevenueTrend {
    date: string;
    amount_cents: string;
}

interface PackageStat {
    package_name: string;
    package_type: string;
    sales_count: string;
    total_revenue_cents: string;
}

interface TrainerStat {
    trainer_id: string;
    trainer_name: string;
    email: string;
    class_count: string;
    total_attendees: string;
    unique_clients: string;
}

interface AnalyticsData {
    summary: RevenueSummary;
    trend: RevenueTrend[];
    package_stats: PackageStat[];
}

export default function AdminAnalyticsPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [trainerStats, setTrainerStats] = useState<TrainerStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [trainerLoading, setTrainerLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (authLoading) return;

        if (isAuthenticated && !user?.roles?.includes('admin')) {
            router.push('/');
            return;
        }

        if (isAuthenticated) {
            fetchAnalytics();
            fetchTrainerStats();
        }
    }, [isAuthenticated, user, router, authLoading]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await apiClient.getRevenueReport(dateRange.start, dateRange.end);
            if (response.data) {
                setData(response.data);
            } else {
                setError(response.error || 'Failed to load analytics');
            }
        } catch (err) {
            console.error('Error fetching analytics:', err);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleRefreshAll = () => {
        fetchAnalytics();
        fetchTrainerStats();
    };

    const fetchTrainerStats = async () => {
        setTrainerLoading(true);
        try {
            const response = await apiClient.getTrainerPerformanceReport(dateRange.start, dateRange.end);
            if (response.data) {
                setTrainerStats(response.data);
            }
        } catch (err) {
            console.error('Error fetching trainer stats:', err);
        } finally {
            setTrainerLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
            </div>
        );
    }

    if (!data) return null;

    const totalRevenue = (parseInt(data.summary.total_revenue_cents || '0') / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    return (
        <div className="min-h-screen bg-black page-container print:bg-white print:p-0">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="print:hidden">
                        <Link href="/admin" className="text-turquoise-surf hover:text-pacific-cyan mb-6 inline-flex items-center gap-2 font-bold uppercase tracking-wider text-xs transition-colors">
                            ← Back to Admin
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Business <span className="text-gradient">Analytics</span>
                        </h1>
                        <p className="text-xl text-gray-400">Track revenue, sales trends, and package performance</p>
                    </div>
                    
                    <div className="hidden print:block text-black mb-8 border-b-2 border-black pb-4 w-full">
                        <h1 className="text-4xl font-bold uppercase tracking-tighter">Business Performance Report</h1>
                        <p className="text-gray-600 font-bold uppercase tracking-widest text-sm mt-2">
                            Generated on: {new Date().toLocaleDateString()} | Range: {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 print:hidden">
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2 rounded-xl">
                            <input 
                                type="date" 
                                value={dateRange.start}
                                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                                className="bg-transparent border-none text-xs font-bold focus:ring-0 outline-none"
                            />
                            <span className="text-gray-500 text-xs">to</span>
                            <input 
                                type="date" 
                                value={dateRange.end}
                                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                                className="bg-transparent border-none text-xs font-bold focus:ring-0 outline-none"
                            />
                        </div>
                        
                        <button 
                            onClick={handleRefreshAll}
                            className="px-6 py-3 bg-turquoise-surf text-black rounded-xl font-black uppercase text-xs hover:scale-105 transition-all shadow-lg shadow-turquoise-surf/20"
                        >
                            🔄 Refresh Data
                        </button>

                        <button 
                            onClick={handlePrint}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold flex items-center gap-2 transition-all text-xs uppercase tracking-widest"
                        >
                            🖨️ PDF
                        </button>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 print:grid-cols-3 print:gap-4 print:mb-8">
                    <div className="glass-card print:border print:border-black print:bg-white print:shadow-none print:text-black">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 print:text-gray-600">Total Revenue</p>
                        <p className="text-4xl font-bold text-white print:text-black">{totalRevenue}</p>
                        <p className="text-xs text-green-400 mt-2 font-medium print:text-green-600">All-time settled</p>
                    </div>
                    <div className="glass-card print:border print:border-black print:bg-white print:shadow-none print:text-black">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 print:text-gray-600">Transactions</p>
                        <p className="text-4xl font-bold text-turquoise-surf print:text-black">{data.summary.total_transactions}</p>
                        <p className="text-xs text-gray-500 mt-2 font-medium print:text-gray-600">Successful payments</p>
                    </div>
                    <div className="glass-card print:border print:border-black print:bg-white print:shadow-none print:text-black">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 print:text-gray-600">Avg. Ticket</p>
                        <p className="text-4xl font-bold text-blue-400 print:text-black">
                            {data.summary.total_transactions !== '0' 
                                ? ((parseInt(data.summary.total_revenue_cents) / parseInt(data.summary.total_transactions)) / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                                : '$0.00'}
                        </p>
                        <p className="text-xs text-gray-500 mt-2 font-medium print:text-gray-600">Per transaction</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-12 print:block">
                    {/* Revenue Trend */}
                    <div className="glass-card print:hidden">
                        <h2 className="text-xl font-bold mb-8">30-Day Revenue Trend</h2>
                        {data.trend.length === 0 ? (
                            <p className="text-gray-500 italic py-20 text-center">No transactions in the last 30 days.</p>
                        ) : (
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={data.trend.map(d => ({
                                            date: new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                                            amount: parseInt(d.amount_cents) / 100
                                        }))}
                                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#111', 
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '8px',
                                                fontSize: '12px'
                                            }}
                                            itemStyle={{ color: '#00f2ff' }}
                                            formatter={(value: any) => [`$${value.toFixed(2)}`, 'Revenue']}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="amount" 
                                            stroke="#00f2ff" 
                                            strokeWidth={3}
                                            fillOpacity={1} 
                                            fill="url(#colorRevenue)" 
                                            animationDuration={1500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Package Popularity */}
                    <div className="glass-card overflow-hidden p-0 print:border print:border-black print:bg-white print:text-black">
                        <div className="px-6 py-6 border-b border-white/5 print:border-black">
                            <h2 className="text-xl font-bold">Package Performance</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[500px] md:min-w-0">
                                <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-white/5 print:bg-gray-100 print:text-black print:border-black">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Package</th>
                                        <th className="px-6 py-4 text-center">Sales</th>
                                        <th className="px-6 py-4 text-right">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 print:divide-black">
                                    {data.package_stats.map((pkg, i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors print:bg-white">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-white print:text-black">{pkg.package_name || 'Unknown Item'}</div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-tighter print:text-gray-600">{pkg.package_type}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center font-medium text-turquoise-surf print:text-black">
                                                {pkg.sales_count}
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-white print:text-black">
                                                {(parseInt(pkg.total_revenue_cents) / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Trainer Performance Section */}
                <div className="glass-card overflow-hidden p-0 print:border print:border-black print:bg-white print:text-black print:mt-12">
                    <div className="px-6 py-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 print:border-black">
                        <h2 className="text-xl font-bold uppercase tracking-widest text-turquoise-surf print:text-black">Trainer Performance Report</h2>
                        
                        <div className="flex items-center gap-3 print:hidden">
                            <input 
                                type="date" 
                                value={dateRange.start}
                                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs font-bold focus:border-turquoise-surf outline-none"
                            />
                            <span className="text-gray-500">to</span>
                            <input 
                                type="date" 
                                value={dateRange.end}
                                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs font-bold focus:border-turquoise-surf outline-none"
                            />
                            <button 
                                onClick={fetchTrainerStats}
                                className="px-4 py-1.5 bg-turquoise-surf text-black font-black uppercase text-[10px] rounded-lg hover:scale-105 transition-all"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-white/5 print:bg-gray-100 print:text-black print:border-black">
                                <tr>
                                    <th className="px-6 py-4 text-left">Trainer</th>
                                    <th className="px-6 py-4 text-center">Sessions</th>
                                    <th className="px-6 py-4 text-center">Attendees</th>
                                    <th className="px-6 py-4 text-center">Unique Clients</th>
                                    <th className="px-6 py-4 text-right print:hidden">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 print:divide-black">
                                {trainerLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-turquoise-surf mx-auto"></div>
                                        </td>
                                    </tr>
                                ) : trainerStats.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">No activity for trainers in this period.</td>
                                    </tr>
                                ) : (
                                    trainerStats.map((trainer) => (
                                        <tr key={trainer.trainer_id} className="hover:bg-white/[0.02] transition-colors print:bg-white">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-white print:text-black">{trainer.trainer_name}</div>
                                                <div className="text-[10px] text-gray-500 truncate max-w-[150px] print:text-gray-600">{trainer.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-white print:text-black">
                                                {trainer.class_count}
                                            </td>
                                            <td className="px-6 py-4 text-center font-medium text-turquoise-surf print:text-black">
                                                {trainer.total_attendees}
                                            </td>
                                            <td className="px-6 py-4 text-center font-medium text-blue-400 print:text-black">
                                                {trainer.unique_clients}
                                            </td>
                                            <td className="px-6 py-4 text-right print:hidden">
                                                <button 
                                                    onClick={() => window.print()}
                                                    className="text-[10px] font-bold text-gray-500 hover:text-turquoise-surf uppercase tracking-widest border border-white/5 px-3 py-1 rounded bg-white/5 transition-all"
                                                >
                                                    Generate Invoice
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
