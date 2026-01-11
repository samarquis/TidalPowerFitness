'use client';

import { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    created_at: string;
}

export default function NotificationBell() {
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const response = await apiClient.getUnreadNotifications();
            if (response.data) {
                setNotifications(response.data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            const loadData = async () => {
                await fetchNotifications();
            };
            loadData();
            // Poll for new notifications every 60 seconds
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const markRead = async (id: string) => {
        try {
            await apiClient.markNotificationRead(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error('Error marking notification read:', error);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="View notifications"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {notifications.length}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                        <div className="px-4 py-4 border-b border-white/5 bg-white/5">
                            <h3 className="text-sm font-bold text-white">Notifications</h3>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="px-4 py-12 text-center text-gray-500">
                                    <div className="text-2xl mb-2">🎉</div>
                                    <p className="text-xs">All caught up!</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {notifications.map((notification) => (
                                        <div 
                                            key={notification.id} 
                                            className="px-4 py-4 hover:bg-white/[0.02] transition-colors relative group"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-xs font-bold text-turquoise-surf uppercase tracking-wider">{notification.title}</h4>
                                                <button 
                                                    onClick={() => markRead(notification.id)}
                                                    className="text-[10px] text-gray-600 hover:text-white transition-colors"
                                                >
                                                    Mark read
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-300 leading-snug">{notification.message}</p>
                                            <p className="text-[10px] text-gray-600 mt-2">
                                                {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="px-4 py-2 border-t border-white/5 bg-white/5 text-center">
                                <button 
                                    onClick={() => {
                                        notifications.forEach(n => markRead(n.id));
                                        setIsOpen(false);
                                    }}
                                    className="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
