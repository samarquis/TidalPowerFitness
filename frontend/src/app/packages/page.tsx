'use client';

import { useState, useEffect } from 'react';
import PackageCard from '@/components/PackageCard';

interface Package {
    id: number;
    name: string;
    description: string;
    price: number;
    credit_amount: number;
}

export default function PackagesPage() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/packages');
                if (!response.ok) {
                    throw new Error('Failed to fetch packages');
                }
                const data = await response.json();
                setPackages(data);
            } catch (err) {
                console.error('Error fetching packages:', err);
                setError('Failed to load packages. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Class Packages</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Choose the perfect package for your fitness journey. Flexible options to suit your schedule.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-lg text-center max-w-2xl mx-auto">
                        {error}
                    </div>
                ) : packages.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">
                        No packages available at the moment. Please check back later.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {packages.map((pkg) => (
                            <PackageCard key={pkg.id} pkg={pkg} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
