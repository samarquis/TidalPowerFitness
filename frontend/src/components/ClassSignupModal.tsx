'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { apiClient } from '@/lib/api';
import { formatTime12Hour } from "@/lib/utils";

interface ClassInfo {
    id: string;
    name: string;
    description: string;
    start_time: string;
    duration_minutes: number;
    instructor_name: string;
    category: string;
    day_of_week?: number;
    date?: Date;
}

interface ClassSignupModalProps {
    classInfo: ClassInfo;
    userCredits: number;
    isOpen: boolean;
    isBooked?: boolean;
    onClose: () => void;
    onConfirm: (classId: string, attendeeCount: number) => Promise<void>;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ClassSignupModal({
    classInfo,
    userCredits,
    isOpen,
    isBooked = false,
    onClose,
    onConfirm
}: ClassSignupModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [attendeeCount, setAttendeeCount] = useState(1);
    const [error, setError] = useState('');
    const [workoutSession, setWorkoutSession] = useState<any>(null);
    const [loadingWorkout, setLoadingWorkout] = useState(false);

    React.useEffect(() => {
        if (isOpen && isBooked && classInfo.id && classInfo.date) {
            fetchWorkoutPlan();
        }
    }, [isOpen, isBooked, classInfo.id, classInfo.date]);

    const fetchWorkoutPlan = async () => {
        setLoadingWorkout(true);
        try {
            const dateStr = classInfo.date!.toISOString().split('T')[0];
            const response = await apiClient.getWorkoutSessions();
            if (response.data) {
                // Find the session matching this class and date
                const session = response.data.find((s: any) => 
                    s.class_id === classInfo.id && 
                    s.session_date.split('T')[0] === dateStr
                );
                
                if (session) {
                    // Fetch full session details including exercises
                    const details = await apiClient.getWorkoutSession(session.id);
                    if (details.data) {
                        setWorkoutSession(details.data);
                    }
                }
            }
        } catch (err) {
            console.error('Error fetching workout plan:', err);
        } finally {
            setLoadingWorkout(false);
        }
    };

    if (!isOpen) return null;

    const totalCost = attendeeCount;
    const hasEnoughCredits = userCredits >= totalCost;

    const handleConfirm = async () => {
        setIsLoading(true);
        setError('');
        try {
            await onConfirm(classInfo.id, attendeeCount);

            // Trigger confetti for delight!
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#08acd6', '#478ea0', '#18809e', '#ffffff']
            });

            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to book class');
        } finally {
            setIsLoading(false);
        }
    };

    const formattedDate = classInfo.date
        ? classInfo.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
        : classInfo.day_of_week !== undefined ? DAYS[classInfo.day_of_week] : 'TBD';

    return (
        <div className="modal-overlay backdrop-blur-sm">
            <div className="glass rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden relative">
                {/* Header */}
                <div className={`bg-gradient-to-r ${isBooked ? 'from-green-600 to-teal-600' : 'from-cerulean to-pacific-cyan'} px-6 py-4`}>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                        {isBooked ? '✓ Session Confirmed' : 'Confirm Booking'}
                    </h2>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Class Details */}
                    <div className="mb-8">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-2xl font-bold">{classInfo.name}</h3>
                            <span className="px-2 py-1 bg-turquoise-surf/10 text-turquoise-surf text-[10px] font-bold uppercase rounded border border-turquoise-surf/20">
                                {classInfo.category}
                            </span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{classInfo.description}</p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300">
                                <span className="w-8 h-8 rounded-lg bg-turquoise-surf/10 flex items-center justify-center mr-3">
                                    <svg className="w-4 h-4 text-turquoise-surf" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                {formattedDate}
                            </div>
                            <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300">
                                <span className="w-8 h-8 rounded-lg bg-turquoise-surf/10 flex items-center justify-center mr-3">
                                    <svg className="w-4 h-4 text-turquoise-surf" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </span>
                                {formatTime12Hour(classInfo.start_time)}
                            </div>
                        </div>
                    </div>

                    {/* Workout Plan Section (Only if booked) */}
                    {isBooked && (
                        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-turquoise-surf"></span>
                                Workout Plan
                            </h4>
                            
                            {loadingWorkout ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-turquoise-surf"></div>
                                </div>
                            ) : workoutSession?.exercises && workoutSession.exercises.length > 0 ? (
                                <div className="space-y-3 bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-white/10 max-h-60 overflow-y-auto custom-scrollbar">
                                    {workoutSession.exercises.map((ex: any, idx: number) => (
                                        <div key={ex.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                            <div>
                                                <p className="text-sm font-bold text-foreground">{idx + 1}. {ex.exercise_name}</p>
                                                {ex.notes && <p className="text-[10px] text-gray-500 italic">{ex.notes}</p>}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-mono font-bold text-turquoise-surf">
                                                    {ex.planned_sets}x{ex.planned_reps}
                                                </p>
                                                {ex.planned_weight_lbs > 0 && (
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold">{ex.planned_weight_lbs} lbs</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-black/5 dark:bg-white/5 rounded-xl border border-dashed border-white/10">
                                    <p className="text-gray-500 text-sm">Trainer hasn't posted today's specific exercises yet. Get ready for a surprise!</p>
                                </div>
                            )}
                        </div>
                    )}

                    {!isBooked && (
                        <>
                            {/* Attendee Selection */}
                            <div className="mb-8 flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                                <span className="font-bold text-xs uppercase tracking-widest text-gray-500">Attendees</span>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setAttendeeCount(Math.max(1, attendeeCount - 1))}
                                        className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-xl font-bold text-foreground"
                                    >
                                        -
                                    </button>
                                    <span className="text-2xl font-bold text-turquoise-surf w-6 text-center">{attendeeCount}</span>
                                    <button
                                        onClick={() => setAttendeeCount(Math.min(5, attendeeCount + 1))}
                                        className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-xl font-bold text-foreground"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Credit Info */}
                            <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Total Cost</span>
                                    <span className="font-bold text-lg">{totalCost} {totalCost === 1 ? 'Credit' : 'Credits'}</span>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Your Balance</span>
                                    <span className={`font-bold ${hasEnoughCredits ? 'text-turquoise-surf' : 'text-red-500'}`}>
                                        {userCredits} Credits
                                    </span>
                                </div>
                                <div className="border-t border-white/10 pt-3 mt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">After Booking</span>
                                        <span className="font-bold">
                                            {hasEnoughCredits ? userCredits - totalCost : 0} Credits
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* Insufficient Credits Warning */}
                    {!isBooked && !hasEnoughCredits && (
                        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 px-4 py-3 rounded-lg mb-6">
                            <p className="font-bold text-sm uppercase tracking-wide mb-1">Insufficient Credits</p>
                            <p className="text-xs opacity-80">You need {totalCost} credits but only have {userCredits}.</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="px-8 pb-8 flex gap-4">
                    <button
                        onClick={onClose}
                        className="btn-secondary flex-1"
                    >
                        {isBooked ? 'Close' : 'Cancel'}
                    </button>
                    {!isBooked && (
                        hasEnoughCredits ? (
                            <button
                                onClick={handleConfirm}
                                disabled={isLoading}
                                className="btn-primary flex-1 min-w-[140px]"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    `Confirm`
                                )}
                            </button>
                        ) : (
                            <Link
                                href="/packages"
                                className="btn-primary flex-1 text-center"
                            >
                                Get Credits
                            </Link>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
