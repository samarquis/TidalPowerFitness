'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';

export default function CheckoutPage() {
    const { isAuthenticated } = useAuth();
    const { cart, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/checkout');
        }
    }, [isAuthenticated, router]);

    const handleCheckout = async () => {
        if (!cart || cart.items.length === 0) {
            setError('Your cart is empty');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await apiClient.checkoutCart();

            if (response.error) {
                throw new Error(response.error || 'Failed to initiate checkout');
            }

            if (response.data && response.data.url) {
                // Clear cart before redirecting to payment
                await clearCart();
                window.location.href = response.data.url;
            } else {
                throw new Error('No checkout URL returned');
            }
        } catch (err: any) {
            console.error('Checkout error:', err);
            setError(err.message || 'Failed to start checkout. Please try again.');
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    const items = cart?.items || [];
    const totalCents = cart?.total_cents || 0;
    const totalDollars = (totalCents / 100).toFixed(2);

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8">Checkout</h1>

                {error && (
                    <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="bg-gray-900 border border-white/10 rounded-xl p-6 mb-6">
                    <h2 className="text-2xl font-bold text-white mb-4">Order Summary</h2>

                    <div className="space-y-3 mb-6">
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center py-2 border-b border-white/5">
                                <div>
                                    <p className="text-white font-semibold">{item.package_name}</p>
                                    <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                                </div>
                                <p className="text-teal-400 font-semibold">
                                    ${((item.package_price_cents * item.quantity) / 100).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                        <span className="text-xl font-bold text-white">Total:</span>
                        <span className="text-3xl font-bold text-teal-400">${totalDollars}</span>
                    </div>
                </div>

                <div className="bg-gray-900 border border-white/10 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-bold text-white mb-2">Payment</h3>
                    <p className="text-gray-400 text-sm mb-4">
                        You will be redirected to our secure payment processor to complete your purchase.
                    </p>
                </div>

                <button
                    onClick={handleCheckout}
                    disabled={loading || items.length === 0}
                    className="w-full py-3 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        `Pay $${totalDollars}`
                    )}
                </button>

                <button
                    onClick={() => router.push('/cart')}
                    className="w-full mt-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                    ← Back to Cart
                </button>
            </div>
        </div>
    );
}
