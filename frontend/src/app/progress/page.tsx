'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProgressDashboard from '@/components/ProgressDashboard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProgressPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login?redirect=/progress');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-deep-ocean text-white pt-8 pb-16">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-turquoise-surf to-pacific-cyan mb-2">
                        Your Progress
                    </h1>
                    <p className="text-gray-400">Track your metrics, personal records, and workout volume over time.</p>
                </div>
                
                <ProgressDashboard clientId={user.id} />
            </div>
        </div>
    );
}
