'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BlackGlassCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hoverable?: boolean;
}

/**
 * BlackGlassCard - The universal container for the Tidal Power Fitness "Luxury Vault" aesthetic.
 * Implements backdrop-blur, border-transparency, and optional hover animations.
 */
const BlackGlassCard = ({ 
    children, 
    className, 
    onClick, 
    hoverable = true 
}: BlackGlassCardProps) => {
    return (
        <motion.div
            whileHover={hoverable ? { scale: 1.02, borderColor: 'rgba(8, 172, 214, 0.4)' } : {}}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={onClick}
            className={cn(
                "glass-card",
                onClick && "cursor-pointer",
                className
            )}
        >
            {children}
        </motion.div>
    );
};

export default BlackGlassCard;
