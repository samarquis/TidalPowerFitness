import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Package {
    id: string;
    name: string;
    description: string;
    price_cents: number;
    credit_count: number;
    type: 'one_time' | 'subscription';
    duration_days?: number;
}

interface PackageCardProps {
    pkg: Package;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg }) => {
    const { isAuthenticated, token } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleBuy = async () => {
        if (!isAuthenticated) {
            window.location.href = '/login?redirect=/packages';
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/payments/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ packageId: pkg.id })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to initiate checkout');
            }

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL returned');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to start checkout. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const price = (pkg.price_cents / 100).toFixed(2);
    const isSubscription = pkg.type === 'subscription';

    return (
        <div className="bg-gray-900 border border-white/10 rounded-xl p-6 flex flex-col h-full hover:border-teal-500/50 transition-all duration-300 group">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">{pkg.name}</h3>
                <div className="mt-2 flex items-baseline text-white">
                    <span className="text-3xl font-bold tracking-tight">${price}</span>
                    <span className="ml-1 text-sm text-gray-400">{isSubscription ? '/ month' : '/ package'}</span>
                </div>
            </div>

            <div className="flex-grow">
                <p className="text-gray-400 text-sm mb-4">{pkg.description}</p>

                <div className="flex items-center space-x-2 text-sm text-gray-300 mb-6">
                    <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>{pkg.credit_count} Credits</span>
                </div>
            </div>

            <button
                className="w-full py-2 px-4 bg-white/5 hover:bg-teal-600 text-teal-400 hover:text-white border border-teal-500/30 hover:border-teal-500 rounded-lg transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                onClick={handleBuy}
                disabled={loading}
            >
                {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    'Buy Now'
                )}
            </button>
        </div>
    );
};

export default PackageCard;
