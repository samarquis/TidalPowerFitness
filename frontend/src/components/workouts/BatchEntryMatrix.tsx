'use client';

import React from 'react';
import { BlackGlassCard } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';

interface SetLog {
    set_number: number;
    reps_completed?: number;
    weight_used_lbs?: number;
    notes?: string;
}

interface BatchEntryMatrixProps {
    sets: SetLog[];
    onUpdateSet: (index: number, updates: Partial<SetLog>) => void;
    plannedReps?: number;
    plannedWeight?: number;
    activeSetIndex: number;
}

/**
 * BatchEntryMatrix - A high-density grid for rapid workout logging.
 * Optimized for touch with large numerical targets and predictive pre-filling.
 */
const BatchEntryMatrix = ({
    sets,
    onUpdateSet,
    plannedReps = 0,
    plannedWeight = 0,
    activeSetIndex
}: BatchEntryMatrixProps) => {
    return (
        <div className="space-y-4">
            {/* Header Labels */}
            <div className="grid grid-cols-12 gap-4 px-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <div className="col-span-2 text-center">Set</div>
                <div className="col-span-4 text-center">Reps</div>
                <div className="col-span-4 text-center">Lbs</div>
                <div className="col-span-2"></div>
            </div>

            <AnimatePresence mode='popLayout'>
                {sets.map((set, index) => {
                    const isActive = index === activeSetIndex;
                    
                    return (
                        <motion.div
                            key={set.set_number}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <BlackGlassCard 
                                className={`p-3 md:p-4 transition-all duration-300 ${
                                    isActive 
                                        ? 'border-turquoise-surf/50 bg-turquoise-surf/5 shadow-[0_0_20px_rgba(8,172,214,0.1)]' 
                                        : 'opacity-60 grayscale-[0.5]'
                                }`}
                                hoverable={isActive}
                            >
                                <div className="grid grid-cols-12 gap-2 md:gap-4 items-center">
                                    {/* Set Number */}
                                    <div className="col-span-2 flex justify-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                                            isActive ? 'bg-turquoise-surf text-black' : 'bg-white/10 text-gray-400'
                                        }`}>
                                            {set.set_number}
                                        </div>
                                    </div>

                                    {/* Reps Input */}
                                    <div className="col-span-4">
                                        <input
                                            type="number"
                                            inputMode="numeric"
                                            value={set.reps_completed ?? ''}
                                            placeholder={plannedReps.toString()}
                                            onChange={(e) => onUpdateSet(index, { reps_completed: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-black/40 border border-white/5 rounded-xl py-3 text-center text-xl font-black text-turquoise-surf focus:border-turquoise-surf/50 focus:bg-black/60 outline-none transition-all"
                                        />
                                    </div>

                                    {/* Weight Input */}
                                    <div className="col-span-4">
                                        <input
                                            type="number"
                                            inputMode="numeric"
                                            value={set.weight_used_lbs ?? ''}
                                            placeholder={plannedWeight.toString()}
                                            onChange={(e) => onUpdateSet(index, { weight_used_lbs: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-black/40 border border-white/5 rounded-xl py-3 text-center text-xl font-black text-turquoise-surf focus:border-turquoise-surf/50 focus:bg-black/60 outline-none transition-all"
                                        />
                                    </div>

                                    {/* Status Indicator / Pulse Placeholder */}
                                    <div className="col-span-2 flex justify-center">
                                        {set.reps_completed !== undefined && set.weight_used_lbs !== undefined ? (
                                            <span className="text-green-500 font-bold">✓</span>
                                        ) : (
                                            <div className="w-2 h-2 rounded-full bg-white/10 animate-pulse"></div>
                                        )}
                                    </div>
                                </div>
                            </BlackGlassCard>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default BatchEntryMatrix;
