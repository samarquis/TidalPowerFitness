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

interface AnalyticsData {
    summary: RevenueSummary;
    trend: RevenueTrend[];
    package_stats: PackageStat[];
}

export default function AdminAnalyticsPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (isAuthenticated && !user?.roles?.includes('admin')) {
            router.push('/');
            return;
        }

        if (isAuthenticated) {
            fetchAnalytics();
        }
    }, [isAuthenticated, user, router, authLoading]);

    const fetchAnalytics = async () => {
        try {
            const response = await apiClient.getRevenueReport();
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
        <div className="min-h-screen bg-black page-container">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/admin" className="text-turquoise-surf hover:text-pacific-cyan mb-6 inline-flex items-center gap-2 font-bold uppercase tracking-wider text-xs transition-colors">
                        ← Back to Admin
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Business <span className="text-gradient">Analytics</span>
                    </h1>
                    <p className="text-xl text-gray-400">Track revenue, sales trends, and package performance</p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass-card">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Total Revenue</p>
                        <p className="text-4xl font-bold text-white">{totalRevenue}</p>
                        <p className="text-xs text-green-400 mt-2 font-medium">All-time settled</p>
                    </div>
                    <div className="glass-card">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Transactions</p>
                        <p className="text-4xl font-bold text-turquoise-surf">{data.summary.total_transactions}</p>
                        <p className="text-xs text-gray-500 mt-2 font-medium">Successful payments</p>
                    </div>
                    <div className="glass-card">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Avg. Ticket</p>
                        <p className="text-4xl font-bold text-blue-400">
                            {data.summary.total_transactions !== '0' 
                                ? ((parseInt(data.summary.total_revenue_cents) / parseInt(data.summary.total_transactions)) / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                                : '$0.00'}
                        </p>
                        <p className="text-xs text-gray-500 mt-2 font-medium">Per transaction</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Revenue Trend */}
                    <div className="glass-card">
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
                                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
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
                    <div className="glass-card overflow-hidden p-0">
                        <div className="px-6 py-6 border-b border-white/5">
                            <h2 className="text-xl font-bold">Package Performance</h2>
                        </div>
                        <table className="w-full">
                            <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left">Package</th>
                                    <th className="px-6 py-4 text-center">Sales</th>
                                    <th className="px-6 py-4 text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {data.package_stats.map((pkg, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white">{pkg.package_name || 'Unknown Item'}</div>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-tighter">{pkg.package_type}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium text-turquoise-surf">
                                            {pkg.sales_count}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-white">
                                            {(parseInt(pkg.total_revenue_cents) / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
