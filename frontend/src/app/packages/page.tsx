'use client';

import { useState, useEffect } from 'react';
import PackageCard from '@/components/PackageCard';
import { apiClient } from '@/lib/api';

export interface Package {
    id: string;
    name: string;
    description: string;
    price_cents: number;
    credit_count: number;
    type: 'one_time' | 'subscription';
    duration_days?: number;
}

export default function PackagesPage() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await apiClient.getPackages();
                if (response.error) {
                    throw new Error(response.error);
                }
                if (response.data) {
                    setPackages(response.data);
                }
            } catch (err: any) {
                console.error('Error fetching packages:', err);
                setError(err.message || 'Failed to load packages. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    // Rollback: Filter only for one-time token packs
    const oneTimePackages = packages.filter(pkg => pkg.type === 'one_time');

    return (
        <div className="min-h-screen bg-background page-container relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-turquoise-surf/5 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase italic">
                        Token <span className="text-gradient">Vault</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 max-w-2xl mx-auto">
                        Secure your tactical credits • Deploy at will
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-6 rounded-2xl text-center max-w-2xl mx-auto backdrop-blur-xl">
                        {error}
                    </div>
                ) : (
                    <div className="space-y-16">
                        {/* One-time Section */}
                        {oneTimePackages.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {oneTimePackages.map((pkg) => (
                                    <PackageCard key={pkg.id} pkg={pkg} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-600 font-bold uppercase tracking-widest py-20 glass-card border-dashed border-white/10">
                                No token packs currently available in the vault.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
