import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error to console in development
        if (import.meta.env.DEV) {
            console.error('Error caught by boundary:', error, errorInfo);
        }

        // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
        // Example:
        // Sentry.captureException(error, { extra: errorInfo });

        this.setState({
            errorInfo
        });
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
        window.location.href = '/';
    };

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-forest-900 px-4">
                    <div className="max-w-md w-full glass-card p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-red-500/20 rounded-full">
                                <AlertTriangle className="w-12 h-12 text-red-400" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-4">
                            Oops! Something went wrong
                        </h1>

                        <p className="text-forest-300 mb-6">
                            We're sorry, but something unexpected happened. Our team has been notified and we're working on a fix.
                        </p>

                        {import.meta.env.DEV && this.state.error && (
                            <details className="text-left mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                <summary className="cursor-pointer text-red-400 font-semibold mb-2">
                                    Error Details (Dev Only)
                                </summary>
                                <pre className="text-xs text-red-300 overflow-auto">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="px-6 py-3 bg-forest-accent text-forest-900 font-bold rounded-lg hover:bg-white transition-colors"
                            >
                                Return to Home
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 border border-forest-600 text-white font-medium rounded-lg hover:bg-forest-800 transition-colors"
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
