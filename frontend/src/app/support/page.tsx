'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { BlackGlassCard, CTAButton, PulseIndicator } from '@/components/ui';
import { motion } from 'framer-motion';

export default function SupportFeedbackPage() {
    const { user, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        type: 'bug' as 'bug' | 'feature' | 'review',
        priority: 'medium',
        title: '',
        description: '',
    });
    const [isSubmitting, setIsLoading] = useState(false);
    const [successData, setSuccessData] = useState<{ id: string; github_url?: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.submitFeedback({
                ...formData,
                metadata: {
                    browser: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
                    url: typeof window !== 'undefined' ? window.location.href : 'unknown',
                    role: user?.roles?.[0]
                }
            });

            if (response.data) {
                setSuccessData(response.data);
                setFormData({ type: 'bug', priority: 'medium', title: '', description: '' });
            } else {
                setError(response.error || 'Failed to submit request');
            }
        } catch (err) {
            setError('A network error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <BlackGlassCard className="max-w-md text-center p-12">
                    <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
                    <p className="text-gray-400 mb-8">Please log in to submit feedback or report issues.</p>
                    <CTAButton variant="primary" href="/login?redirect=/support">Sign In</CTAButton>
                </BlackGlassCard>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 logo-watermark">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter italic">
                            SYSTEM <span className="text-gradient">SUPPORT</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-xl mx-auto">
                            Help us build the vault. Report bugs, suggest features, or review the platform.
                        </p>
                    </motion.div>
                </header>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left: Instructions */}
                    <div className="md:col-span-1 space-y-6">
                        <BlackGlassCard className="p-6">
                            <h3 className="font-bold text-turquoise-surf uppercase tracking-widest text-xs mb-4">Workflow</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm text-gray-400">
                                    <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-white shrink-0">1</span>
                                    Submit your report via this form.
                                </li>
                                <li className="flex gap-3 text-sm text-gray-400">
                                    <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-white shrink-0">2</span>
                                    An automated GitHub Issue is created.
                                </li>
                                <li className="flex gap-3 text-sm text-gray-400">
                                    <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-white shrink-0">3</span>
                                    The engineering team is notified instantly.
                                </li>
                            </ul>
                        </BlackGlassCard>

                        <div className="p-6 rounded-2xl bg-gradient-to-br from-cerulean/20 to-pacific-cyan/10 border border-pacific-cyan/20">
                            <h4 className="font-bold mb-2">Priority Levels</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                <span className="text-white font-bold">Urgent:</span> System crashes or data loss.<br/>
                                <span className="text-white font-bold">High:</span> Broken features.<br/>
                                <span className="text-white font-bold">Medium:</span> UX polish or minor bugs.
                            </p>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="md:col-span-2">
                        {successData ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full"
                            >
                                <BlackGlassCard className="h-full flex flex-col items-center justify-center p-12 text-center border-green-500/30">
                                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/50">
                                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h2 className="text-3xl font-black mb-4 tracking-tighter uppercase">Request Logged</h2>
                                    <p className="text-gray-400 mb-8">
                                        Thank you! Your feedback has been saved locally and a ticket has been opened on GitHub.
                                    </p>
                                    {successData.github_url && (
                                        <a 
                                            href={successData.github_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold flex items-center gap-2 transition-all mb-6"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                            View GitHub Issue
                                        </a>
                                    )}
                                    <button 
                                        onClick={() => setSuccessData(null)}
                                        className="text-turquoise-surf font-bold uppercase tracking-widest text-xs hover:underline"
                                    >
                                        Submit Another
                                    </button>
                                </BlackGlassCard>
                            </motion.div>
                        ) : (
                            <BlackGlassCard className="p-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Type</label>
                                            <select
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pacific-cyan outline-none transition-all"
                                            >
                                                <option value="bug">🐛 Bug Report</option>
                                                <option value="feature">✨ Feature Request</option>
                                                <option value="review">📝 Site Review</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Priority</label>
                                            <select
                                                value={formData.priority}
                                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pacific-cyan outline-none transition-all"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                                <option value="urgent">Urgent</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Short summary of the issue or idea"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pacific-cyan outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Details</label>
                                        <textarea
                                            required
                                            rows={6}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Provide as much context as possible..."
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pacific-cyan outline-none transition-all resize-none"
                                        />
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-gradient-to-r from-cerulean to-pacific-cyan text-white font-black rounded-2xl text-lg uppercase tracking-widest transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(8,172,214,0.3)] disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                                        ) : (
                                            'Send to Engineering'
                                        )}
                                    </button>
                                </form>
                            </BlackGlassCard>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
