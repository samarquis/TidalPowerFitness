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
                                className="p-3 md:p-4 transition-all duration-300"
                                hoverable={isActive}
                            >
                                <div className="grid grid-cols-12 gap-2 md:gap-4 items-center">
                                    {/* Set Number */}
                                    <div className="col-span-2 flex justify-center">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">
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

                                    {/* Status Indicator / Pulse */}
                                    <div className="col-span-2 flex justify-center">
                                        {pulseType !== 'none' ? (
                                            <PulseIndicator type={pulseType} />
                                        ) : set.reps_completed !== undefined && set.weight_used_lbs !== undefined ? (
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