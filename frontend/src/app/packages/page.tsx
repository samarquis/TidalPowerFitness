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

    const filteredPackages = packages.filter(pkg => pkg.type === 'one_time');

    return (
        <div className="min-h-screen bg-background page-container">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Membership & <span className="text-gradient">Tokens</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Purchase tokens to book your classes.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-lg text-center max-w-2xl mx-auto">
                        {error}
                    </div>
                ) : filteredPackages.length === 0 ? (
                    <div className="text-center text-gray-400 py-12 glass-card border-dashed">
                        No token packages available at the moment.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPackages.map((pkg) => (
                            <PackageCard key={pkg.id} pkg={pkg} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
