'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import confetti from 'canvas-confetti';

function WorkoutCompleteContent() {
    const { token } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams ? searchParams.get('session') : null;
    const duration = searchParams ? searchParams.get('duration') : null;

    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Fire confetti on mount
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    const handleFinish = async () => {
        setSaving(true);
        try {
            // Update session with end time and notes
            await apiClient.updateWorkoutSession(sessionId!, {
                end_time: new Date(),
                duration_minutes: parseInt(duration || '0'),
                notes: notes
            });

            router.push('/workouts/templates');
        } catch (error) {
            console.error('Error saving workout:', error);
            alert('Failed to save workout');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Success Message */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
                        <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-2">
                        Workout <span className="text-gradient">Complete!</span>
                    </h1>
                    <p className="text-xl text-gray-300">Great job! You crushed it.</p>
                </div>

                {/* Summary */}
                <div className="glass rounded-xl p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4">Workout Summary</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">Duration</div>
                            <div className="text-2xl font-bold">{duration} minutes</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">Date</div>
                            <div className="text-2xl font-bold">{new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div className="glass rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-bold mb-4">Workout Notes (Optional)</h3>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="How did the workout feel? Any observations?"
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-turquoise-surf"
                        rows={4}
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={handleFinish}
                        disabled={saving}
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white font-bold rounded-lg text-lg transition-all disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Finish & Save'}
                    </button>
                </div>

                <div className="text-center mt-6">
                    <Link href="/workouts/templates" className="text-gray-400 hover:text-white transition-colors">
                        Back to Templates
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function WorkoutCompletePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
                    <p className="mt-4 text-gray-400">Loading summary...</p>
                </div>
            </div>
        }>
            <WorkoutCompleteContent />
        </Suspense>
    );
}
