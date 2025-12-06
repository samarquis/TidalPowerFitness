'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

function MockCheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { isAuthenticated, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const packageId = searchParams.get('packageId');
    const cartParam = searchParams.get('cart');

    // Parse cart data if present
    let cartItems: { packageId: string; quantity: number }[] = [];
    if (cartParam) {
        try {
            const jsonStr = atob(cartParam);
            cartItems = JSON.parse(jsonStr);
        } catch (e) {
            console.error('Failed to parse cart param', e);
        }
    }

    const isCartCheckout = cartItems.length > 0;
    const isValid = packageId || isCartCheckout;

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    const handlePayment = async () => {
        if (!isValid) return;

        setLoading(true);
        setError(null);

        try {
            // Prepare payload based on checkout type
            const payload = isCartCheckout
                ? { items: cartItems }
                : { packageId };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/payments/confirm-mock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Payment failed');
            }

            setSuccess(true);

            // Clear cart if successful cart checkout
            if (isCartCheckout) {
                try {
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/cart`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                } catch (e) {
                    console.error('Failed to clear cart after payment', e);
                }
            }

            setTimeout(() => {
                router.push('/profile'); // Redirect to profile to see credits
            }, 2000);

        } catch (err: any) {
            console.error('Payment error:', err);
            setError(err.message || 'Failed to process payment');
        } finally {
            setLoading(false);
        }
    };

    if (!isValid) {
        return (
            <div className="min-h-screen bg-black pt-24 px-4 flex justify-center">
                <div className="text-red-500">Invalid checkout session: Missing package ID or Cart info</div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-black pt-24 px-4 flex justify-center items-center">
                <div className="bg-gray-900 p-8 rounded-xl border border-green-500/50 text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                    <p className="text-gray-400 mb-6">Your credits have been added to your account.</p>
                    <p className="text-sm text-teal-400 animate-pulse">Redirecting to profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-24 px-4 flex justify-center items-center">
            <div className="bg-gray-900 p-8 rounded-xl border border-white/10 max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Mock Payment Gateway</h1>
                    <p className="text-gray-400 text-sm">
                        This is a simulated payment page for testing purposes. No real money will be charged.
                    </p>
                </div>

                <div className="bg-white/5 p-4 rounded-lg mb-6">
                    {isCartCheckout ? (
                        <>
                            <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-2">
                                <span className="text-gray-400">Order Type:</span>
                                <span className="text-white">Cart Checkout</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400">Items:</span>
                                <span className="text-white">{cartItems.length} packages</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Total Items:</span>
                                <span className="text-white font-mono">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
                            </div>
                        </>
                    ) : (
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400">Package ID:</span>
                            <span className="text-white font-mono text-xs">{packageId?.slice(0, 8)}...</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-4 pt-2 border-t border-white/10">
                        <span className="text-gray-400">Total Amount:</span>
                        <span className="text-teal-400 font-bold">TEST MODE</span>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                    {loading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        'Confirm Mock Payment'
                    )}
                </button>

                <button
                    onClick={() => router.back()}
                    className="w-full mt-3 py-2 text-gray-400 hover:text-white text-sm transition-colors"
                >
                    Cancel
                </button>
            </div>
            );
    }

export default function MockCheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
            <MockCheckoutContent />
        </Suspense>
    );
}
