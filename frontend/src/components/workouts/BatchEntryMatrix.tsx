'use client';

import React, { useEffect, useState } from 'react';
import { BlackGlassCard, PulseIndicator } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api';

interface SetLog {
    set_number: number;
    reps_completed?: number;
    weight_used_lbs?: number;
    notes?: string;
}

interface BatchEntryMatrixProps {
    exerciseId: string;
    sets: SetLog[];
    onUpdateSet: (index: number, updates: Partial<SetLog>) => void;
    plannedReps?: number;
    plannedWeight?: number;
    activeSetIndex: number;
}

interface ExerciseBest {
    personal_records: { value: number; record_type: string }[];
    previous_best: { prev_max_weight: number; prev_max_reps: number } | null;
}

/**
 * BatchEntryMatrix - A high-density grid for rapid workout logging.
 * Optimized for touch with large numerical targets and predictive pre-filling.
 * Integrated with the Progressive Overload Pulse Engine.
 */
const BatchEntryMatrix = ({
    exerciseId,
    sets,
    onUpdateSet,
    plannedReps = 0,
    plannedWeight = 0,
    activeSetIndex
}: BatchEntryMatrixProps) => {
    const [bestData, setBestBestData] = useState<ExerciseBest | null>(null);

    useEffect(() => {
        const fetchBest = async () => {
            try {
                const response = await apiClient.getExerciseBest(exerciseId);
                if (response.data) {
                    setBestBestData(response.data);
                }
            } catch (error) {
                console.error('Error fetching best data:', error);
            }
        };
        fetchBest();
    }, [exerciseId]);

    const getPulseType = (reps: number | undefined, weight: number | undefined): 'overload' | 'pr' | 'none' => {
        if (!bestData || reps === undefined || weight === undefined) return 'none';

        // 1. Check for All-Time PR
        const prWeight = bestData.personal_records.find(r => r.record_type === 'max_weight')?.value || 0;
        if (weight > prWeight) return 'pr';

        // 2. Check for Overload (beating last session)
        const prevWeight = bestData.previous_best?.prev_max_weight || 0;
        const prevReps = bestData.previous_best?.prev_max_reps || 0;

        if (weight > prevWeight || (weight === prevWeight && reps > prevReps)) {
            return 'overload';
        }

        return 'none';
    };

    return (
        <div className="space-y-4">
            <AnimatePresence mode='popLayout'>
                {sets.map((set, index) => {
                    const isActive = index === activeSetIndex;
                    const pulseType = getPulseType(set.reps_completed, set.weight_used_lbs);
                    
                    return (
                        <motion.div
                            key={set.set_number}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <BlackGlassCard 
                                className="p-4 md:p-5 transition-all duration-300"
                                hoverable={isActive}
                            >
                                <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
                                    {/* Set Input */}
                                    <div className="flex-1 min-w-[60px] md:flex-none md:w-20">
                                        <label className="block text-[9px] font-black text-gray-500 uppercase tracking-tighter mb-1 ml-1">Set</label>
                                        <input
                                            type="number"
                                            value={set.set_number}
                                            readOnly
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 text-center text-xl font-black text-gray-500 outline-none cursor-default"
                                        />
                                    </div>

                                    {/* Reps Input */}
                                    <div className="flex-[2] min-w-[120px]">
                                        <label className="block text-[9px] font-black text-turquoise-surf uppercase tracking-tighter mb-1 ml-1">Reps</label>
                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={() => onUpdateSet(index, { reps_completed: Math.max(0, (set.reps_completed ?? 0) - 1) })}
                                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/5"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                inputMode="numeric"
                                                value={set.reps_completed ?? ''}
                                                placeholder={(plannedReps ?? 0).toString()}
                                                onChange={(e) => onUpdateSet(index, { reps_completed: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 text-center text-xl font-black text-turquoise-surf focus:border-turquoise-surf/50 focus:bg-black/60 outline-none transition-all"
                                            />
                                            <button 
                                                onClick={() => onUpdateSet(index, { reps_completed: (set.reps_completed ?? 0) + 1 })}
                                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/5"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Weight Input */}
                                    <div className="flex-[2] min-w-[120px]">
                                        <label className="block text-[9px] font-black text-turquoise-surf uppercase tracking-tighter mb-1 ml-1">Lbs</label>
                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={() => onUpdateSet(index, { weight_used_lbs: Math.max(0, (set.weight_used_lbs ?? 0) - 5) })}
                                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/5"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                inputMode="numeric"
                                                value={set.weight_used_lbs ?? ''}
                                                placeholder={(plannedWeight ?? 0).toString()}
                                                onChange={(e) => onUpdateSet(index, { weight_used_lbs: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 text-center text-xl font-black text-turquoise-surf focus:border-turquoise-surf/50 focus:bg-black/60 outline-none transition-all"
                                            />
                                            <button 
                                                onClick={() => onUpdateSet(index, { weight_used_lbs: (set.weight_used_lbs ?? 0) + 5 })}
                                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/5"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Status Indicator */}
                                    <div className="flex-none w-10 flex justify-center pt-4 md:pt-0">
                                        {pulseType !== 'none' ? (
                                            <PulseIndicator type={pulseType} />
                                        ) : set.reps_completed !== undefined && set.weight_used_lbs !== undefined ? (
                                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                                <span className="text-green-500 font-black text-xs">✓</span>
                                            </div>
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