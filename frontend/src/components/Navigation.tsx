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
    const { user, logout, isAuthenticated, spoofRole } = useAuth();
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

    const isAdmin = user?.roles?.includes('admin');
    const isTrainer = user?.roles?.includes('trainer');
    const isScottMarquis = user?.email === 'samarquis4@gmail.com' || user?.email === 'lisa.baumgard@tidalpower.com';
    const { isDemoModeEnabled, toggleDemoMode } = useDemoMode();

    const getDashboardLink = () => {
        if (isAdmin) return '/admin';
        if (isTrainer) return '/trainer';
        return '/';
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-card-border transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo & Dashboard Link */}
                    <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-8 min-w-0">
                        <Link href="/" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                            <img
                                src="/logo.jpg"
                                alt="Tidal Power Fitness Logo"
                                className="h-8 sm:h-10 w-auto object-contain"
                            />
                            <span className="text-foreground font-bold text-sm sm:text-base lg:text-lg hidden sm:block truncate max-w-[120px] lg:max-w-none">Tidal Power Fitness</span>
                        </Link>

                        {isAuthenticated && (
                            <div className="flex items-center space-x-2 sm:space-x-4 overflow-hidden">
                                <Link 
                                    href={getDashboardLink()}
                                    className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-turquoise-surf hover:text-pacific-cyan transition-colors whitespace-nowrap"
                                >
                                    Dashboard
                                </Link>
                                <Link 
                                    href="/support"
                                    className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors whitespace-nowrap flex items-center gap-1"
                                >
                                    <span className="hidden xl:inline">Support</span>
                                    <span className="xl:hidden" title="Support">🚀</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Desktop Right Actions */}
                    <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                        {isAuthenticated ? (
                            <>
                                {/* Credit Counter */}
                                <Link
                                    href="/packages"
                                    className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 lg:px-3 py-1.5 rounded-full hover:border-turquoise-surf/50 transition-all group"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-turquoise-surf animate-pulse"></span>
                                    <span className="text-xs font-bold text-foreground">{user?.credits || 0}</span>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold group-hover:text-turquoise-surf transition-colors hidden lg:inline">Tokens</span>
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

                                <div className="h-6 w-px bg-white/10 mx-2"></div>

                                {/* Dev Tools Dropdown (Only for Scott/Admin) */}
                                {isScottMarquis && (
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            onClick={() => setManagementOpen(!managementOpen)}
                                            className="p-2 text-gray-500 hover:text-turquoise-surf transition-colors"
                                            title="Dev Tools"
                                        >
                                            <span className="text-xl">⚙️</span>
                                        </button>

                                        {managementOpen && (
                                            <div className="absolute right-0 mt-2 w-56 bg-card dark:bg-[#1a1a1a] border border-card-border rounded-lg shadow-2xl py-2 z-50 text-foreground ring-1 ring-black/10">
                                                <div className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-white/5 mb-1">
                                                    Dev Roles
                                                </div>
                                                <div className="px-4 py-2 grid grid-cols-2 gap-1">
                                                    <button onClick={() => { spoofRole('admin'); setManagementOpen(false); }} className={`text-[10px] px-2 py-1.5 rounded font-bold uppercase transition-all ${user?.roles?.[0] === 'admin' ? 'bg-cerulean text-black' : 'bg-cerulean/10 text-cerulean hover:bg-cerulean/30'}`}>Admin</button>
                                                    <button onClick={() => { spoofRole('trainer'); setManagementOpen(false); }} className={`text-[10px] px-2 py-1.5 rounded font-bold uppercase transition-all ${user?.roles?.[0] === 'trainer' ? 'bg-pacific-cyan text-black' : 'bg-pacific-cyan/10 text-pacific-cyan hover:bg-pacific-cyan/30'}`}>Trainer</button>
                                                    <button onClick={() => { spoofRole('client'); setManagementOpen(false); }} className={`text-[10px] px-2 py-1.5 rounded font-bold uppercase transition-all ${user?.roles?.[0] === 'client' ? 'bg-turquoise-surf text-black' : 'bg-turquoise-surf/10 text-turquoise-surf hover:bg-turquoise-surf/30'}`}>Client</button>
                                                    <button onClick={() => { spoofRole('real'); setManagementOpen(false); }} className={`text-[10px] px-2 py-1.5 rounded font-bold uppercase transition-all ${!['admin', 'trainer', 'client'].includes(user?.roles?.[0] || '') ? 'bg-gray-600 text-white' : 'bg-gray-600/10 text-gray-400 hover:bg-gray-600/30'}`}>Reset</button>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        toggleDemoMode();
                                                        setManagementOpen(false);
                                                    }}
                                                    className={`block w-full text-left px-4 py-2 text-sm font-semibold transition-colors mt-1 ${isDemoModeEnabled ? 'bg-green-600 hover:bg-green-700 text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-white/10 hover:text-foreground'}`}
                                                >
                                                    {isDemoModeEnabled ? 'Demo Mode: ON' : 'Demo Mode: OFF'}
                                                </button>
                                                <Link
                                                    href="/support"
                                                    onClick={() => setManagementOpen(false)}
                                                    className="block w-full text-left px-4 py-2 text-sm font-semibold transition-colors text-turquoise-surf hover:bg-white/10 hover:text-pacific-cyan border-t border-white/5 mt-1"
                                                >
                                                    🚀 Support & Feedback
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <Link
                                    href="/profile"
                                    className="text-foreground font-bold text-sm hover:text-turquoise-surf transition-colors"
                                >
                                    {user?.first_name}
                                </Link>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-all text-xs font-bold uppercase tracking-widest border border-red-600/20"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/packages"
                                    className="text-gray-500 dark:text-gray-300 hover:text-foreground transition-colors font-bold text-sm uppercase tracking-wider"
                                >
                                    Pricing
                                </Link>
                                <motion.button
                                    onClick={toggleTheme}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    {theme === 'dark' ? '🌙' : '☀️'}
                                </motion.button>
                                <Link
                                    href="/login"
                                    className="text-gray-500 dark:text-gray-300 hover:text-foreground transition-colors font-bold text-sm uppercase tracking-wider"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-6 py-2 bg-turquoise-surf text-black font-black rounded-lg transition-all hover:scale-105 uppercase tracking-widest text-xs"
                                >
                                    Join Now
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
                <div className="md:hidden bg-background/95 border-t border-card-border p-4 space-y-4 shadow-2xl">
                    {isAuthenticated ? (
                        <>
                            <Link 
                                href={getDashboardLink()}
                                className="block w-full p-4 bg-turquoise-surf/10 border border-turquoise-surf/30 text-turquoise-surf font-black uppercase text-center rounded-xl"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <Link
                                    href="/packages"
                                    className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/10"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="text-xl font-bold text-foreground">{user?.credits || 0}</span>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase">Tokens</span>
                                </Link>
                                <button
                                    onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
                                    className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/10"
                                >
                                    <span className="text-xl">{theme === 'dark' ? '🌙' : '☀️'}</span>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase">Theme</span>
                                </button>
                            </div>

                            <Link
                                href="/profile"
                                className="block p-4 bg-white/5 rounded-xl text-center font-bold text-foreground"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                My Profile
                            </Link>

                            <Link
                                href="/support"
                                className="block p-4 bg-turquoise-surf/5 border border-turquoise-surf/20 rounded-xl text-center font-bold text-turquoise-surf"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Support & Feedback
                            </Link>

                            <button
                                onClick={logout}
                                className="w-full p-4 bg-red-600 text-white font-black uppercase rounded-xl shadow-lg shadow-red-600/20"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <Link
                                href="/login"
                                className="block w-full p-4 bg-white/5 text-center font-bold text-foreground rounded-xl"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="block w-full p-4 bg-turquoise-surf text-black text-center font-black uppercase rounded-xl shadow-lg shadow-turquoise-surf/20"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Join Now
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}