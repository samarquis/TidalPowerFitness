'use client';

import React from 'react';

interface MuscleMapProps {
    primaryMuscle?: string;
    secondaryMuscles?: string[];
    className?: string;
}

/**
 * High-fidelity anatomical mapping component.
 * Uses a simplified medical-style SVG to highlight targeted muscle groups.
 */
export default function MuscleMap({ primaryMuscle, secondaryMuscles = [], className = "" }: MuscleMapProps) {
    const isHighlighted = (muscleName: string) => {
        const normalized = muscleName.toLowerCase();
        const primary = primaryMuscle?.toLowerCase();
        const secondary = secondaryMuscles.map(m => m.toLowerCase());
        
        if (primary === normalized) return 'primary';
        if (secondary.includes(normalized)) return 'secondary';
        return 'none';
    };

    const getFillColor = (muscleName: string) => {
        const highlight = isHighlighted(muscleName);
        if (highlight === 'primary') return '#00f2ff'; // Pacific Cyan / Turquoise Surf
        if (highlight === 'secondary') return '#08acd6'; // Cerulean
        return 'rgba(255, 255, 255, 0.05)'; // Base / Hidden
    };

    const getStrokeColor = (muscleName: string) => {
        const highlight = isHighlighted(muscleName);
        if (highlight !== 'none') return '#fff';
        return 'rgba(255, 255, 255, 0.1)';
    };

    return (
        <div className={`flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-8 ${className}`}>
            <div className="flex gap-12">
                {/* FRONT VIEW */}
                <div className="flex flex-col items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Front View</span>
                    <svg width="120" height="240" viewBox="0 0 100 200" className="drop-shadow-[0_0_15px_rgba(0,242,255,0.1)]">
                        {/* Simplified Front Anatomy */}
                        {/* Chest */}
                        <path d="M35 45 Q50 40 65 45 L65 60 Q50 65 35 60 Z" fill={getFillColor('Chest')} stroke={getStrokeColor('Chest')} strokeWidth="0.5" />
                        {/* Abs */}
                        <rect x="40" y="65" width="20" height="35" rx="2" fill={getFillColor('Abs')} stroke={getStrokeColor('Abs')} strokeWidth="0.5" />
                        {/* Quads */}
                        <path d="M30 105 L48 105 L45 155 L32 155 Z" fill={getFillColor('Quadriceps')} stroke={getStrokeColor('Quadriceps')} strokeWidth="0.5" />
                        <path d="M52 105 L70 105 L68 155 L55 155 Z" fill={getFillColor('Quadriceps')} stroke={getStrokeColor('Quadriceps')} strokeWidth="0.5" />
                        {/* Shoulders */}
                        <circle cx="28" cy="45" r="6" fill={getFillColor('Shoulders')} stroke={getStrokeColor('Shoulders')} strokeWidth="0.5" />
                        <circle cx="72" cy="45" r="6" fill={getFillColor('Shoulders')} stroke={getStrokeColor('Shoulders')} strokeWidth="0.5" />
                        {/* Biceps */}
                        <path d="M22 55 Q18 75 25 90" fill="none" stroke={getFillColor('Biceps')} strokeWidth="4" strokeLinecap="round" />
                        <path d="M78 55 Q82 75 75 90" fill="none" stroke={getFillColor('Biceps')} strokeWidth="4" strokeLinecap="round" />
                        
                        {/* Outline Body (Front) */}
                        <path d="M50 20 L55 25 L55 35 L70 40 L75 100 L70 160 L60 195 L52 195 L50 100 L48 195 L40 195 L30 160 L25 100 L30 40 L45 35 L45 25 Z" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    </svg>
                </div>

                {/* BACK VIEW */}
                <div className="flex flex-col items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Back View</span>
                    <svg width="120" height="240" viewBox="0 0 100 200">
                        {/* Simplified Back Anatomy */}
                        {/* Lats / Upper Back */}
                        <path d="M30 45 L50 40 L70 45 L65 85 L35 85 Z" fill={getFillColor('Lats')} stroke={getStrokeColor('Lats')} strokeWidth="0.5" />
                        <path d="M30 45 L50 40 L70 45 L65 85 L35 85 Z" fill={getFillColor('Upper Back')} stroke={getStrokeColor('Upper Back')} strokeWidth="0.5" />
                        {/* Lower Back */}
                        <rect x="42" y="85" width="16" height="15" fill={getFillColor('Lower Back')} stroke={getStrokeColor('Lower Back')} strokeWidth="0.5" />
                        {/* Glutes */}
                        <path d="M32 100 Q50 90 68 100 L65 120 Q50 125 35 120 Z" fill={getFillColor('Glutes')} stroke={getStrokeColor('Glutes')} strokeWidth="0.5" />
                        {/* Hamstrings */}
                        <path d="M32 125 L48 125 L45 165 L35 165 Z" fill={getFillColor('Hamstrings')} stroke={getStrokeColor('Hamstrings')} strokeWidth="0.5" />
                        <path d="M52 125 L68 125 L65 165 L55 165 Z" fill={getFillColor('Hamstrings')} stroke={getStrokeColor('Hamstrings')} strokeWidth="0.5" />
                        {/* Traps */}
                        <path d="M40 35 L50 30 L60 35 L50 50 Z" fill={getFillColor('Traps')} stroke={getStrokeColor('Traps')} strokeWidth="0.5" />
                        {/* Triceps */}
                        <path d="M22 55 Q18 75 25 90" fill="none" stroke={getFillColor('Triceps')} strokeWidth="4" strokeLinecap="round" />
                        <path d="M78 55 Q82 75 75 90" fill="none" stroke={getFillColor('Triceps')} strokeWidth="4" strokeLinecap="round" />

                        {/* Outline Body (Back) */}
                        <path d="M50 20 L55 25 L55 35 L70 40 L75 100 L70 160 L60 195 L52 195 L50 100 L48 195 L40 195 L30 160 L25 100 L30 40 L45 35 L45 25 Z" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    </svg>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-8 flex gap-6 border-t border-white/5 pt-6 w-full justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00f2ff]"></div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Primary</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#08acd6]"></div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Secondary</span>
                </div>
            </div>
        </div>
    );
}
