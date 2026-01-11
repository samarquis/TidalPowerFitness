// src/components/ErrorBoundary.tsx
'use client';

import React, { Component, ReactNode } from 'react';

import Link from 'next/link';

import { apiClient } from '@/lib/api';

interface Props {
    children: ReactNode;
    componentName?: string;
}

interface State {
    hasError: boolean;
    errorInfo?: string;
    reportedId?: string;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error) {
        return { hasError: true };
    }

    async componentDidCatch(error: Error, errorInfo: any) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        // Report to backend
        try {
            const response = await apiClient.reportError({
                message: error.message,
                stack_trace: error.stack,
                component_name: this.props.componentName || 'Unknown Component',
                url: typeof window !== 'undefined' ? window.location.href : '',
                browser_info: {
                    userAgent: navigator.userAgent,
                    componentStack: errorInfo.componentStack
                }
            });

            if (response.data?.id) {
                this.setState({ reportedId: response.data.id });
            }
        } catch (reportError) {
            console.error('Failed to report error to backend:', reportError);
        }

        this.setState({ errorInfo: error.toString() });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-black text-white p-4">
                    <div className="max-w-md w-full glass-card p-12 text-center border-red-500/20">
                        <div className="text-5xl mb-6">⚡</div>
                        <h1 className="text-3xl font-black mb-4 tracking-tighter uppercase italic">
                            SYSTEM <span className="text-gradient">ERROR</span>
                        </h1>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            A critical error occurred in the vault. Our automated sentry has logged the issue and notified engineering.
                        </p>
                        
                        {this.state.reportedId && (
                            <div className="mb-8 p-3 bg-white/5 rounded-lg border border-white/10">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Error Ticket ID</p>
                                <code className="text-xs text-turquoise-surf">{this.state.reportedId}</code>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => window.location.reload()}
                                className="btn-primary w-full py-4"
                            >
                                Reload Vault
                            </button>
                            <Link href="/" className="text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
                                Return Home
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
