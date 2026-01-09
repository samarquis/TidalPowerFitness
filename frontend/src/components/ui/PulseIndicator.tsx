'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PulseIndicatorProps {
    type: 'overload' | 'pr' | 'none';
}

/**
 * PulseIndicator - A high-fidelity visual feedback atom.
 * Pacific Cyan for 'overload', Flame Orange for 'pr'.
 */
const PulseIndicator = ({ type }: PulseIndicatorProps) => {
    if (type === 'none') return null;

    const isPR = type === 'pr';
    const color = isPR ? 'rgba(255, 69, 0, 0.8)' : 'rgba(8, 172, 214, 0.8)';
    const shadow = isPR ? '0 0 15px rgba(255, 69, 0, 0.5)' : '0 0 15px rgba(8, 172, 214, 0.5)';

    return (
        <div className="relative flex items-center justify-center w-6 h-6">
            {/* Core dot */}
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-2.5 h-2.5 rounded-full z-10"
                style={{ 
                    backgroundColor: color,
                    boxShadow: shadow
                }}
            />

            {/* Pulsing ring */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                    scale: [1, 2.5], 
                    opacity: [0.5, 0] 
                }}
                transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeOut"
                }}
                className="absolute w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: color }}
            />

            {/* Secondary delayed pulse for depth */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                    scale: [1, 2.5], 
                    opacity: [0.5, 0] 
                }}
                transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.75
                }}
                className="absolute w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: color }}
            />

            {isPR && (
                <motion.span
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: -20, opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute text-[10px] font-black text-orange-500 whitespace-nowrap"
                >
                    NEW PR!
                </motion.span>
            )}
        </div>
    );
};

export default PulseIndicator;
