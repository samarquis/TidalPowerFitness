'use client';

import { useEffect } from 'react';
import { apiClient } from '@/lib/api';

export default function GlobalErrorListener() {
    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            // Ignore cross-origin script errors which provide no info
            if (event.message === 'Script error.') return;

            apiClient.reportError({
                message: event.message,
                stack_trace: event.error?.stack,
                url: window.location.href,
                component_name: 'Global Window Listener',
                browser_info: {
                    userAgent: navigator.userAgent,
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno
                }
            }).catch(err => console.error('Failed to report global error:', err));
        };

        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            apiClient.reportError({
                message: `Unhandled Promise Rejection: ${event.reason?.message || String(event.reason)}`,
                stack_trace: event.reason?.stack,
                url: window.location.href,
                component_name: 'Global Promise Listener',
                browser_info: {
                    userAgent: navigator.userAgent
                }
            }).catch(err => console.error('Failed to report unhandled rejection:', err));
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, []);

    return null; // This component doesn't render anything
}
