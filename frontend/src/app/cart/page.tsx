'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
    const { cart, loading, removeFromCart, updateQuantity } = useCart();
    const router = useRouter();
    const [processingItem, setProcessingItem] = useState<string | null>(null);

    const handleRemove = async (itemId: string) => {
        setProcessingItem(itemId);
        await removeFromCart(itemId);
        setProcessingItem(null);
    };

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setProcessingItem(itemId);
        await updateQuantity(itemId, newQuantity);
        setProcessingItem(null);
    };

    const handleCheckout = () => {
        router.push('/checkout');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    const items = cart?.items || [];
    const totalCents = cart?.total_cents || 0;
    const totalDollars = (totalCents / 100).toFixed(2);

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8">Shopping Cart</h1>

                {items.length === 0 ? (
                    <div className="bg-gray-900 border border-white/10 rounded-xl p-12 text-center">
                        <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
                        <p className="text-gray-400 mb-6">Add some packages to get started!</p>
                        <Link
                            href="/packages"
                            className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
                        >
                            Browse Packages
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 mb-8">
                            {items.map((item) => (
                                <div key={item.id} className="bg-gray-900 border border-white/10 rounded-xl p-6 flex items-center justify-between">
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-bold text-white mb-1">{item.package_name}</h3>
                                        <p className="text-gray-400 text-sm mb-2">{item.package_description}</p>
                                        <p className="text-teal-400 font-semibold">${(item.package_price_cents / 100).toFixed(2)}</p>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                disabled={processingItem === item.id || item.quantity <= 1}
                                                className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                -
                                            </button>
                                            <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                disabled={processingItem === item.id}
                                                className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => handleRemove(item.id)}
                                            disabled={processingItem === item.id}
                                            className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gray-900 border border-white/10 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-xl font-bold text-white">Total:</span>
                                <span className="text-3xl font-bold text-teal-400">${totalDollars}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full py-3 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors"
                            >
                                Proceed to Checkout
                            </button>

                            <Link
                                href="/packages"
                                className="block text-center mt-4 text-gray-400 hover:text-white transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
