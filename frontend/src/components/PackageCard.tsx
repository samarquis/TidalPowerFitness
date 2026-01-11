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
    const isSubscription = pkg.type === 'subscription';

    return (
        <motion.div 
            className="glass-card flex flex-col h-full group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-turquoise-surf transition-colors">{pkg.name}</h3>
                <div className="mt-2 flex items-baseline text-white">
                    <span className="text-3xl font-bold tracking-tight">${price}</span>
                    <span className="ml-1 text-sm text-gray-400">{isSubscription ? '/ month' : '/ package'}</span>
                </div>
            </div>

            <div className="flex-grow">
                <p className="text-gray-400 text-sm mb-4">{pkg.description}</p>

                <div className="flex items-center space-x-2 text-sm text-gray-300 mb-6">
                    <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-semibold">{pkg.credit_count} Tokens</span>
                </div>
            </div>

            <button
                className={`w-full ${showSuccess ? 'bg-green-600 border-green-600' : 'btn-primary'}`}
                onClick={handleAddToCart}
                disabled={loading || showSuccess}
            >
                {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : showSuccess ? (
                    <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Added to Cart!
                    </>
                ) : (
                    'Add to Cart'
                )}
            </button>
        </motion.div>
    );
};

export default PackageCard;
