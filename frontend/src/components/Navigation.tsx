'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useRef, useEffect } from 'react';
import CartIcon from './CartIcon';
import NotificationBell from './NotificationBell';
import { motion } from 'framer-motion';

export default function Navigation() {
    const { user, logout, isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [managementOpen, setManagementOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setManagementOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const isTrainerOrAdmin = user?.roles?.includes('trainer') || user?.roles?.includes('admin');
    const isAdmin = user?.roles?.includes('admin');
    const isTrainer = user?.roles?.includes('trainer');
    const isScottMarquis = user?.email === 'samarquis4@gmail.com' || user?.email === 'lisa.baumgard@tidalpower.com';
    const { isDemoModeEnabled, toggleDemoMode } = useDemoMode();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-card-border transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
                        <img
                            src="/logo.jpg"
                            alt="Tidal Power Fitness Logo"
                            className="h-10 w-auto object-contain"
                        />
                        <span className="text-foreground font-bold text-base lg:text-lg hidden lg:block">Tidal Power Fitness</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                        <Link
                            href="/classes"
                            className="text-gray-500 dark:text-gray-300 hover:text-foreground text-xs lg:text-sm transition-colors font-medium flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/5"
                            title="Classes"
                        >
                            <span className="text-lg">🗓️</span>
                            <span className="hidden xl:inline">Classes</span>
                        </Link>
                        {isAuthenticated && (
                            <>
                                <Link
                                    href="/leaderboard"
                                    className="text-gray-500 dark:text-gray-300 hover:text-foreground text-xs lg:text-sm transition-colors font-medium flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/5"
                                    title="Leaderboard"
                                >
                                    <span className="text-lg">🏆</span>
                                    <span className="hidden xl:inline">Leaderboard</span>
                                </Link>
                                <Link
                                    href="/challenges"
                                    className="text-gray-500 dark:text-gray-300 hover:text-foreground text-xs lg:text-sm transition-colors font-medium flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/5"
                                    title="Challenges"
                                >
                                    <span className="text-lg">🎯</span>
                                    <span className="hidden xl:inline">Challenges</span>
                                </Link>
                            </>
                        )}
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-1 lg:space-x-3">
                                {/* My Program */}
                                <Link
                                    href="/programs/my-program"
                                    className="text-gray-500 dark:text-gray-300 hover:text-foreground text-xs lg:text-sm transition-colors font-medium flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/5"
                                    title="My Program"
                                >
                                    <span className="text-lg">📋</span>
                                    <span className="hidden xl:inline">My Program</span>
                                </Link>

                                {/* My Bookings */}
                                <Link
                                    href="/bookings"
                                    className="text-gray-500 dark:text-gray-300 hover:text-foreground text-xs lg:text-sm transition-colors font-medium flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/5"
                                    title="My Bookings"
                                >
                                    <span className="text-lg">🎟️</span>
                                    <span className="hidden xl:inline">My Bookings</span>
                                </Link>
                                
                                {/* Workout History */}
                                <Link
                                    href="/workouts/history"
                                    className="text-gray-500 dark:text-gray-300 hover:text-foreground text-xs lg:text-sm transition-colors font-medium flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/5"
                                    title="Workouts"
                                >
                                    <span className="text-lg">💪</span>
                                    <span className="hidden xl:inline">Workouts</span>
                                </Link>

                                {isTrainerOrAdmin && (
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            onClick={() => setManagementOpen(!managementOpen)}
                                            className="flex items-center space-x-1 text-gray-500 dark:text-gray-300 hover:text-foreground transition-colors font-semibold focus:outline-none px-2 py-1 rounded-md hover:bg-white/5 text-xs lg:text-sm"
                                        >
                                            <span className="text-lg">⚙️</span>
                                            <span className="hidden lg:inline">Management</span>
                                            <svg className={`w-4 h-4 transition-transform ${managementOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {managementOpen && (
                                            <div className="absolute right-0 mt-2 w-56 bg-card dark:bg-[#1a1a1a] border border-card-border rounded-lg shadow-2xl py-2 z-50 text-foreground ring-1 ring-black/10">

                                                <div className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-white/5 mb-1">
                                                    Training
                                                </div>
                                                <Link href="/admin/exercises" className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-white/10 hover:text-foreground" onClick={() => setManagementOpen(false)}>Manage Exercises</Link>
                                                <Link href="/exercises" className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-white/10 hover:text-foreground" onClick={() => setManagementOpen(false)}>Exercise Library</Link>
                                                <Link href="/workouts/templates" className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-white/10 hover:text-foreground" onClick={() => setManagementOpen(false)}>Workouts</Link>
                                                <Link href="/workouts/assign" className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-white/10 hover:text-foreground" onClick={() => setManagementOpen(false)}>Assign Workout</Link>
                                                <Link href="/workouts/history" className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-white/10 hover:text-foreground" onClick={() => setManagementOpen(false)}>History</Link>

                                                {isTrainer && (
                                                    <>
                                                        <Link href="/trainer" className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-white/10 hover:text-foreground" onClick={() => setManagementOpen(false)}>Trainer Dashboard</Link>
                                                        <Link href="/trainer/availability" className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-white/10 hover:text-foreground" onClick={() => setManagementOpen(false)}>My Availability</Link>
                                                        <Link href="/trainer/reports" className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-white/10 hover:text-foreground" onClick={() => setManagementOpen(false)}>Attendance Reports</Link>
                                                        <Link href="/trainer/analytics" className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-white/10 hover:text-foreground" onClick={() => setManagementOpen(false)}>Trainer Analytics</Link>
                                                    </>
                                                )}

                                                {isAdmin && (
                                                    <>
                                                        <div className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-2 border-t border-card-border pt-2 bg-gray-50 dark:bg-white/5 mb-1">
                                                            Admin
                                                        </div>
                                                        <Link href="/admin/analytics" className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-white/10 hover:text-foreground" onClick={() => setManagementOpen(false)}>Business Analytics</Link>
                                                        <Link href="/admin/classes" className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-white/10 hover:text-foreground" onClick={() => setManagementOpen(false)}>Classes</Link>
                                                        <Link href="/admin/trainers" className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-white/10 hover:text-foreground" onClick={() => setManagementOpen(false)}>Trainers</Link>
                                                        <Link href="/admin/users" className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-white/10 hover:text-foreground" onClick={() => setManagementOpen(false)}>Users</Link>
                                                        <Link href="/admin/calendar" className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-white/10 hover:text-foreground" onClick={() => setManagementOpen(false)}>Calendar</Link>
                                                        <Link href="/admin/reference-data" className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-white/10 hover:text-foreground" onClick={() => setManagementOpen(false)}>Reference Data</Link>
                                                        <Link href="/admin/migrations" className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-white/10 hover:text-foreground" onClick={() => setManagementOpen(false)}>Migrations</Link>
                                                        <Link href="/admin/demo-users" className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-white/10 hover:text-foreground" onClick={() => setManagementOpen(false)}>Demo Users</Link>
                                                        <Link href="/admin/changelog" className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-white/10 hover:text-foreground" onClick={() => setManagementOpen(false)}>Changelog</Link>
                                                        {isScottMarquis && (
                                                            <button
                                                                onClick={() => {
                                                                    toggleDemoMode();
                                                                    setManagementOpen(false);
                                                                }}
                                                                className={`block w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${isDemoModeEnabled ? 'bg-green-600 hover:bg-green-700 text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-white/10 hover:text-foreground'}`}
                                                            >
                                                                {isDemoModeEnabled ? 'Demo Mode: ON' : 'Demo Mode: OFF'}
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <Link
                                    href="/packages"
                                    className="text-gray-500 dark:text-gray-300 hover:text-foreground text-sm transition-colors font-medium flex items-center gap-1 group/tokens"
                                >
                                    Packages
                                    {user?.credits !== undefined && (
                                        <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full group-hover/tokens:border-turquoise-surf/50 transition-all ml-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-turquoise-surf animate-pulse"></span>
                                            <span className="text-xs font-bold text-foreground">{user.credits}</span>
                                            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Credits</span>
                                        </span>
                                    )}
                                </Link>
                                <NotificationBell />
                                <CartIcon />
                                
                                {/* Theme Toggle */}
                                <motion.button
                                    onClick={toggleTheme}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                    aria-label="Toggle Theme"
                                >
                                    {theme === 'dark' ? (
                                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                        </svg>
                                    )}
                                </motion.button>

                                <Link
                                    href="/profile"
                                    className="text-gray-500 dark:text-gray-300 hover:text-foreground text-sm transition-colors font-medium"
                                >
                                    {user?.first_name}
                                </Link>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/packages"
                                    className="text-gray-500 dark:text-gray-300 hover:text-foreground transition-colors"
                                >
                                    Packages
                                </Link>
                                {/* Theme Toggle (Guest) */}
                                <motion.button
                                    onClick={toggleTheme}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                    aria-label="Toggle Theme"
                                >
                                    {theme === 'dark' ? (
                                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                        </svg>
                                    )}
                                </motion.button>
                                <Link
                                    href="/login"
                                    className="text-gray-500 dark:text-gray-300 hover:text-foreground transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white rounded-lg transition-all"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-foreground p-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-background/95 border-t border-card-border max-h-[80vh] overflow-y-auto">
                    <div className="px-4 py-4 space-y-3">
                        <Link
                            href="/"
                            className="block text-gray-500 dark:text-gray-300 hover:text-foreground transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        {/* Theme Toggle Mobile */}
                         <button
                            onClick={toggleTheme}
                            className="flex items-center space-x-2 text-gray-500 dark:text-gray-300 hover:text-foreground py-2 w-full text-left"
                        >
                            {theme === 'dark' ? (
                                <>
                                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <span>Switch to Light Mode</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                    <span>Switch to Dark Mode</span>
                                </>
                            )}
                        </button>

                        <Link
                            href="/classes"
                            className="block text-gray-500 dark:text-gray-300 hover:text-foreground transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Classes
                        </Link>

                        {!isAuthenticated && (
                            <>
                                <Link
                                    href="/trainers"
                                    className="block text-gray-500 dark:text-gray-300 hover:text-foreground transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Trainers
                                </Link>
                                <Link
                                    href="/contact"
                                    className="block text-gray-500 dark:text-gray-300 hover:text-foreground transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Contact
                                </Link>
                                <Link
                                    href="/packages"
                                    className="block text-gray-500 dark:text-gray-300 hover:text-foreground transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Packages
                                </Link>
                            </>
                        )}

                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/bookings"
                                    className="block text-gray-500 dark:text-gray-300 hover:text-foreground transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    My Bookings
                                </Link>
                                <Link
                                    href="/workouts/history"
                                    className="block text-gray-500 dark:text-gray-300 hover:text-foreground transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Workouts
                                </Link>
                                {isAdmin && (
                                    <div className="space-y-2 pl-4 border-l-2 border-cerulean/30">
                                        <div className="text-xs font-bold text-pacific-cyan uppercase">Admin</div>
                                        <Link href="/admin/classes" className="block text-gray-500 dark:text-gray-300 hover:text-foreground py-1" onClick={() => setMobileMenuOpen(false)}>Classes</Link>
                                        <Link href="/admin/trainers" className="block text-gray-500 dark:text-gray-300 hover:text-foreground py-1" onClick={() => setMobileMenuOpen(false)}>Trainers</Link>
                                        <Link href="/admin/users" className="block text-gray-500 dark:text-gray-300 hover:text-foreground py-1" onClick={() => setMobileMenuOpen(false)}>Users</Link>
                                        <Link href="/admin/calendar" className="block text-gray-500 dark:text-gray-300 hover:text-foreground py-1" onClick={() => setMobileMenuOpen(false)}>Calendar</Link>
                                        <Link href="/admin/reference-data" className="block text-gray-500 dark:text-gray-300 hover:text-foreground py-1" onClick={() => setMobileMenuOpen(false)}>Reference Data</Link>
                                        <Link href="/admin/migrations" className="block text-gray-500 dark:text-gray-300 hover:text-foreground py-1" onClick={() => setMobileMenuOpen(false)}>Migrations</Link>
                                        <Link href="/admin/demo-users" className="block text-gray-500 dark:text-gray-300 hover:text-foreground py-1" onClick={() => setMobileMenuOpen(false)}>Demo Users</Link>
                                        <Link href="/admin/changelog" className="block text-gray-500 dark:text-gray-300 hover:text-foreground py-1" onClick={() => setMobileMenuOpen(false)}>Changelog</Link>
                                        {isScottMarquis && (
                                            <button
                                                onClick={() => {
                                                    toggleDemoMode();
                                                    setMobileMenuOpen(false);
                                                }}
                                                className={`block w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${isDemoModeEnabled ? 'bg-green-600 hover:bg-green-700 text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-white/10 hover:text-foreground'}`}
                                            >
                                                {isDemoModeEnabled ? 'Demo Mode: ON' : 'Demo Mode: OFF'}
                                            </button>
                                        )}
                                    </div>
                                )}

                                {isTrainerOrAdmin && (
                                    <div className="space-y-2 pl-4 border-l-2 border-blue-600/30">
                                        <div className="text-xs font-bold text-blue-500 uppercase">Training</div>
                                        <Link href="/admin/exercises" className="block text-gray-500 dark:text-gray-300 hover:text-foreground py-1" onClick={() => setMobileMenuOpen(false)}>Exercises</Link>
                                        <Link href="/workouts/templates" className="block text-gray-500 dark:text-gray-300 hover:text-foreground py-1" onClick={() => setMobileMenuOpen(false)}>Workouts</Link>
                                        <Link href="/workouts/assign" className="block text-gray-500 dark:text-gray-300 hover:text-foreground py-1" onClick={() => setMobileMenuOpen(false)}>Assign Workout</Link>
                                        <Link href="/workouts/history" className="block text-gray-500 dark:text-gray-300 hover:text-foreground py-1" onClick={() => setMobileMenuOpen(false)}>History</Link>
                                        {isTrainer && (
                                            <>
                                                <Link href="/trainer" className="block text-gray-500 dark:text-gray-300 hover:text-foreground py-1" onClick={() => setMobileMenuOpen(false)}>Trainer Dashboard</Link>
                                                <Link href="/trainer/availability" className="block text-gray-500 dark:text-gray-300 hover:text-foreground py-1" onClick={() => setMobileMenuOpen(false)}>My Availability</Link>
                                            </>
                                        )}
                                    </div>
                                )}

                                <div className="pt-4 border-t border-card-border">
                                    <Link
                                        href="/profile"
                                        className="block text-gray-500 dark:text-gray-300 hover:text-foreground py-2 font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Profile: {user?.first_name} {user?.last_name}
                                    </Link>
                                    <div className="flex gap-4 mt-4 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                                        <Link href="/privacy" onClick={() => setMobileMenuOpen(false)}>Privacy</Link>
                                        <Link href="/terms" onClick={() => setMobileMenuOpen(false)}>Terms</Link>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="w-full mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="pt-4 border-t border-card-border space-y-3">
                                <Link
                                    href="/login"
                                    className="block text-gray-500 dark:text-gray-300 hover:text-foreground transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="block px-4 py-2 bg-gradient-to-r from-cerulean to-pacific-cyan text-white rounded-lg text-center"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                                <div className="flex gap-4 pt-4 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                                    <Link href="/privacy" onClick={() => setMobileMenuOpen(false)}>Privacy</Link>
                                    <Link href="/terms" onClick={() => setMobileMenuOpen(false)}>Terms</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
