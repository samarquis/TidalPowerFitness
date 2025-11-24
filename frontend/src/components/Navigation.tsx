'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Navigation() {
    const { user, logout, isAuthenticated } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                        <span className="text-white font-bold text-lg hidden sm:block">Tidal Power Fitness, LLC</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                            Home
                        </Link>
                        <Link href="/trainers" className="text-gray-300 hover:text-white transition-colors">
                            Trainers
                        </Link>

                        <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                            Contact
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-400 text-sm">
                                    {user?.first_name} {user?.last_name}
                                </span>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
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
                <div className="md:hidden bg-black/95 border-t border-white/10">
                    <div className="px-4 py-4 space-y-3">
                        <Link href="/" className="block text-gray-300 hover:text-white transition-colors py-2">
                            Home
                        </Link>
                        <Link href="/trainers" className="block text-gray-300 hover:text-white transition-colors py-2">
                            Trainers
                        </Link>

                        <Link href="/contact" className="block text-gray-300 hover:text-white transition-colors py-2">
                            Contact
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <div className="text-gray-400 text-sm py-2">
                                    {user?.first_name} {user?.last_name}
                                </div>
                                <button
                                    onClick={logout}
                                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="block text-gray-300 hover:text-white transition-colors py-2">
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="block px-4 py-2 bg-gradient-to-r from-teal-6 to-teal-6 text-white rounded-lg text-center"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
