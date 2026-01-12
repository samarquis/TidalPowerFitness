import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/packages');
            return;
        }

        setLoading(true);
        try {
            const result = await addToCart(pkg.id);

            if (result.success) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2000);
            } else {
                alert(result.error || 'Failed to add to cart');
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            alert('Failed to add to cart. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const price = (pkg.price_cents / 100).toFixed(2);

    return (
        <motion.div
            className="glass-card flex flex-col h-full group p-8 border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, border: 'rgba(255,255,255,0.1)' }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <span className="text-8xl">⚡</span>
            </div>

            <div className="mb-8 relative z-10">
                <h3 className="text-2xl font-black text-white group-hover:text-turquoise-surf transition-colors uppercase tracking-tight">{pkg.name}</h3>
                <div className="mt-4 flex items-baseline text-white">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mr-2">MSRP:</span>
                    <span className="text-4xl font-black tracking-tighter italic">${price}</span>
                </div>
            </div>

            <div className="flex-grow relative z-10">
                <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">{pkg.description}</p>

                <div className="flex items-center space-x-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-turquoise-surf/10 flex items-center justify-center border border-turquoise-surf/20">
                        <svg className="w-5 h-5 text-turquoise-surf" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <span className="block text-2xl font-black text-white italic leading-none">{pkg.credit_count}</span>
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Tactical Tokens</span>
                    </div>
                </div>
            </div>

            <button
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all relative z-10 active:scale-95 shadow-xl ${
                    showSuccess 
                        ? 'bg-green-500 text-black shadow-green-500/20' 
                        : 'bg-white text-black hover:bg-turquoise-surf hover:shadow-turquoise-surf/20'
                }`}
                onClick={handleAddToCart}
                disabled={loading || showSuccess}
            >
                {loading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black"></div>
                    </div>
                ) : showSuccess ? (
                    'Secured in Cart'
                ) : (
                    'Acquire'
                )}
            </button>
        </motion.div>
    );
};

export default PackageCard;