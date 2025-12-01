'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // To check if Scott Marquis is logged in

interface DemoModeContextType {
    isDemoModeEnabled: boolean;
    toggleDemoMode: () => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export const DemoModeProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const isScottMarquis = user?.email === 'samarquis4@gmail.com';

    // Initialize state from local storage or default to false
    const [isDemoModeEnabled, setIsDemoModeEnabled] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const storedValue = localStorage.getItem('isDemoModeEnabled');
            return storedValue ? JSON.parse(storedValue) : false;
        }
        return false;
    });

    // Persist state to local storage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('isDemoModeEnabled', JSON.stringify(isDemoModeEnabled));
        }
    }, [isDemoModeEnabled]);

    const toggleDemoMode = () => {
        if (isScottMarquis) { // Only allow Scott Marquis to toggle
            setIsDemoModeEnabled(prev => !prev);
        } else {
            console.warn("Only Scott Marquis can toggle demo mode.");
        }
    };

    return (
        <DemoModeContext.Provider value={{ isDemoModeEnabled, toggleDemoMode }}>
            {children}
        </DemoModeContext.Provider>
    );
};

export const useDemoMode = () => {
    const context = useContext(DemoModeContext);
    if (context === undefined) {
        throw new Error('useDemoMode must be used within a DemoModeProvider');
    }
    return context;
};
