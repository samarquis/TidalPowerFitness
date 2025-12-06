'use client';

import { useState } from 'react';

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
    onClose: () => void;
    onConfirm: (classId: string) => Promise<void>;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatTime(time24: string): string {
    const [hourStr, minuteStr] = time24.split(':');
    let hour = parseInt(hourStr);
    const period = hour >= 12 ? 'PM' : 'AM';
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
    return `${hour}:${minuteStr || '00'} ${period}`;
}

export default function ClassSignupModal({
    classInfo,
    userCredits,
    isOpen,
    onClose,
    onConfirm
}: ClassSignupModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const hasEnoughCredits = userCredits >= 1;

    const handleConfirm = async () => {
        setIsLoading(true);
        setError('');
        try {
            await onConfirm(classInfo.id);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-white/10 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">Confirm Class Booking</h2>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Class Details */}
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{classInfo.name}</h3>
                        <p className="text-gray-400 text-sm mb-4">{classInfo.description}</p>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-300">
                                <svg className="w-4 h-4 mr-3 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {formattedDate}
                            </div>
                            <div className="flex items-center text-gray-300">
                                <svg className="w-4 h-4 mr-3 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formatTime(classInfo.start_time)} • {classInfo.duration_minutes} min
                            </div>
                            <div className="flex items-center text-gray-300">
                                <svg className="w-4 h-4 mr-3 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Instructor: {classInfo.instructor_name}
                            </div>
                        </div>
                    </div>

                    {/* Credit Info */}
                    <div className="bg-white/5 rounded-xl p-4 mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400">Class Cost</span>
                            <span className="font-bold text-white">1 Credit</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400">Your Balance</span>
                            <span className={`font-bold ${hasEnoughCredits ? 'text-teal-400' : 'text-red-400'}`}>
                                {userCredits} Credits
                            </span>
                        </div>
                        <div className="border-t border-white/10 pt-2 mt-2">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">After Booking</span>
                                <span className="font-bold text-white">
                                    {hasEnoughCredits ? userCredits - 1 : 0} Credits
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    {/* Insufficient Credits Warning */}
                    {!hasEnoughCredits && (
                        <div className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 px-4 py-3 rounded-lg mb-4">
                            <p className="font-semibold mb-1">Insufficient Credits</p>
                            <p className="text-sm">You need at least 1 credit to book this class. Please purchase a package first.</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors"
                    >
                        Cancel
                    </button>
                    {hasEnoughCredits ? (
                        <button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Booking...
                                </>
                            ) : (
                                'Confirm Booking'
                            )}
                        </button>
                    ) : (
                        <a
                            href="/packages"
                            className="flex-1 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-colors text-center"
                        >
                            Buy Credits
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
