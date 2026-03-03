import { Component, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center p-8">
          <div className="max-w-md text-center space-y-6">
            <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
            <p className="text-gray-400">
              An unexpected error occurred. Please reload the page to continue.
            </p>
            {this.state.error && (
              <pre className="text-left text-xs text-gray-500 bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-4 overflow-auto max-h-40">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-[#00A9E0] hover:bg-[#0090c0] text-white font-medium rounded-lg transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
