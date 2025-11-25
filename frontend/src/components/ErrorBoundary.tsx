// src/components/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    errorInfo?: string;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ errorInfo: error.toString() });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-black text-white">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
                        <p className="mb-2">Please try refreshing the page.</p>
                        {this.state.errorInfo && (
                            <pre className="text-xs whitespace-pre-wrap text-gray-400">
                                {this.state.errorInfo}
                            </pre>
                        )}
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
