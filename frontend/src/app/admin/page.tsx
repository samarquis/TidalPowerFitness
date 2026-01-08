'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const adminLinks = [
    { title: 'Trainer Dashboard', href: '/trainer', icon: '🏋️‍♂️', description: 'View the platform as a trainer.' },
    { title: 'User Dashboard', href: '/?bypassRedirect=true', icon: '👤', description: 'View the platform as a client/user.' },
    { title: 'Business Analytics', href: '/admin/analytics', icon: '📊', description: 'Revenue, attendance, and growth metrics.' },
    { title: 'Class Management', href: '/admin/classes', icon: '🗓️', description: 'Schedule and manage classes.' },
    { title: 'Trainer Management', href: '/admin/trainers', icon: '💪', description: 'Manage trainer profiles and availability.' },
    { title: 'User Management', href: '/admin/users', icon: '👥', description: 'Manage user accounts and roles.' },
    { title: 'Calendar View', href: '/admin/calendar', icon: '📅', description: 'Master calendar view of all sessions.' },
    { title: 'Reference Data', href: '/admin/reference-data', icon: '🗂️', description: 'Manage workout types, exercises, etc.' },
    { title: 'Package Management', href: '/admin/packages', icon: '🎟️', description: 'Manage token packages and pricing.' },
    { title: 'Demo Users', href: '/admin/demo-users', icon: '🧪', description: 'Generate demo data and users.' },
    { title: 'System Migrations', href: '/admin/migrations', icon: '🏗️', description: 'Database schema migrations status.' },
    { title: 'Changelog', href: '/admin/changelog', icon: '📝', description: 'View system updates and version history.' },
];

export default function AdminDashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-background page-container">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Admin <span className="text-gradient">Dashboard</span>
                    </h1>
                    <p className="text-gray-400 text-lg">Welcome back, {user?.first_name}. Manage the entire platform from here.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adminLinks.map((link) => (
                        <Link 
                            key={link.href} 
                            href={link.href}
                            className="glass-card p-6 group hover:border-turquoise-surf/30 transition-all duration-300 flex flex-col h-full"
                        >
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 w-fit">{link.icon}</div>
                            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-turquoise-surf transition-colors">
                                {link.title}
                            </h2>
                            <p className="text-gray-400 text-sm flex-grow">
                                {link.description}
                            </p>
                            <div className="mt-4 flex items-center text-turquoise-surf text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                Access Module →
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
