'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';

export default function Navigation() {
    const { user, logout, isAuthenticated } = useAuth();
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

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3">
                        <img
                            src="/logo.jpg"
                            alt="Tidal Power Fitness Logo"
                            className="h-12 w-auto object-contain"
                        />
                        <span className="text-white font-bold text-lg hidden sm:block">Tidal Power Fitness</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                {/* Management Dropdown */}
                                {isTrainerOrAdmin && (
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            onClick={() => setManagementOpen(!managementOpen)}
                                            className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors font-semibold focus:outline-none"
                                        >
                                            <span>Management</span>
                                            <svg className={`w-4 h-4 transition-transform ${managementOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {managementOpen && (
                                            <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-white/10 rounded-lg shadow-xl py-2 z-50">

                                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Training
                                                </div>
                                                <Link href="/admin/exercises" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white" onClick={() => setManagementOpen(false)}>Manage Exercises</Link>
                                                <Link href="/exercises" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white" onClick={() => setManagementOpen(false)}>Exercise Library</Link>
                                                <Link href="/workouts/templates" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white" onClick={() => setManagementOpen(false)}>Workouts</Link>
                                                <Link href="/workouts/assign" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white" onClick={() => setManagementOpen(false)}>Assign Workout</Link>
                                                <Link href="/workouts/history" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white" onClick={() => setManagementOpen(false)}>History</Link>

                                                {isTrainer && (
                                                    <Link href="/trainer/availability" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white" onClick={() => setManagementOpen(false)}>My Availability</Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <Link
                                    href="/packages"
                                    className="text-gray-300 hover:text-white text-sm transition-colors font-medium"
                                >
                                    Packages
                                </Link>
                                <Link
                                    href="/profile"
                                    className="text-gray-300 hover:text-white text-sm transition-colors font-medium"
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
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    Packages
                                </Link>
                                <Link
                                    href="/login"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 bg-gradient-to-r from-teal-6 to-teal-6 hover:from-teal-700 hover:to-teal-700 text-white rounded-lg transition-all"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-white p-2"
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
                <div className="md:hidden bg-black/95 border-t border-white/10 max-h-[80vh] overflow-y-auto">
                    <div className="px-4 py-4 space-y-3">
                        <Link
                            href="/"
                            className="block text-gray-300 hover:text-white transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>

                        {!isAuthenticated && (
                            <>
                                <Link
                                    href="/trainers"
                                    className="block text-gray-300 hover:text-white transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Trainers
                                </Link>
                                <Link
                                    href="/classes"
                                    className="block text-gray-300 hover:text-white transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Classes
                                </Link>
                                <Link
                                    href="/contact"
                                    className="block text-gray-300 hover:text-white transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Contact
                                </Link>
                                <Link
                                    href="/packages"
                                    className="block text-gray-300 hover:text-white transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Packages
                                </Link>
                            </>
                        )}

                        {isAuthenticated ? (
                            <>
                                {isAdmin && (
                                    <div className="space-y-2 pl-4 border-l-2 border-teal-600/30">
                                        <div className="text-xs font-bold text-teal-500 uppercase">Admin</div>
                                        <Link href="/admin/classes" className="block text-gray-400 hover:text-white py-1" onClick={() => setMobileMenuOpen(false)}>Classes</Link>
                                        <Link href="/admin/trainers" className="block text-gray-400 hover:text-white py-1" onClick={() => setMobileMenuOpen(false)}>Trainers</Link>
                                        <Link href="/admin/users" className="block text-gray-400 hover:text-white py-1" onClick={() => setMobileMenuOpen(false)}>Users</Link>
                                        <Link href="/admin/calendar" className="block text-gray-400 hover:text-white py-1" onClick={() => setMobileMenuOpen(false)}>Calendar</Link>
                                        <Link href="/admin/reference-data" className="block text-gray-400 hover:text-white py-1" onClick={() => setMobileMenuOpen(false)}>Reference Data</Link>
                                    </div>
                                )}

                                {isTrainerOrAdmin && (
                                    <div className="space-y-2 pl-4 border-l-2 border-blue-600/30">
                                        <div className="text-xs font-bold text-blue-500 uppercase">Training</div>
                                        <Link href="/admin/exercises" className="block text-gray-400 hover:text-white py-1" onClick={() => setMobileMenuOpen(false)}>Exercises</Link>
                                        <Link href="/workouts/templates" className="block text-gray-400 hover:text-white py-1" onClick={() => setMobileMenuOpen(false)}>Workouts</Link>
                                        <Link href="/workouts/assign" className="block text-gray-400 hover:text-white py-1" onClick={() => setMobileMenuOpen(false)}>Assign Workout</Link>
                                        <Link href="/workouts/history" className="block text-gray-400 hover:text-white py-1" onClick={() => setMobileMenuOpen(false)}>History</Link>
                                        {isTrainer && (
                                            <Link href="/trainer/availability" className="block text-gray-400 hover:text-white py-1" onClick={() => setMobileMenuOpen(false)}>My Availability</Link>
                                        )}
                                    </div>
                                )}

                                <div className="pt-4 border-t border-white/10">
                                    <Link
                                        href="/packages"
                                        className="block text-gray-300 hover:text-white py-2 font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Packages
                                    </Link>
                                    <Link
                                        href="/profile"
                                        className="block text-gray-300 hover:text-white py-2 font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Profile: {user?.first_name} {user?.last_name}
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="w-full mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="pt-4 border-t border-white/10 space-y-3">
                                <Link
                                    href="/login"
                                    className="block text-gray-300 hover:text-white transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="block px-4 py-2 bg-gradient-to-r from-teal-6 to-teal-6 text-white rounded-lg text-center"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
