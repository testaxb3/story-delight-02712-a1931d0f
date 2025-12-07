import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class QuizErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Quiz Error Boundary caught error:', error, errorInfo);
    }
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleGoHome = () => {
    // Use replace for clean navigation without history issues
    window.location.replace('/');
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex items-center justify-center bg-background px-6"
        >
          <div className="max-w-md w-full space-y-8">
            {/* Error icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className="flex justify-center"
            >
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
            </motion.div>

            {/* Error message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center space-y-3"
            >
              <h2 className="text-3xl font-black text-foreground font-relative">
                Oops! Something went wrong
              </h2>
              <p className="text-base text-muted-foreground">
                We encountered an error while processing your quiz. Don't worry, your data is safe.
              </p>
            </motion.div>

            {/* Error details (development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-destructive/5 border border-destructive/20 rounded-xl p-4"
              >
                <p className="text-xs font-mono text-destructive break-all">
                  {this.state.error.toString()}
                </p>
              </motion.div>
            )}

            {/* Action buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <Button
                onClick={this.handleReset}
                className="w-full h-12 bg-foreground text-background hover:bg-foreground/90"
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>

              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="w-full h-12"
                size="lg"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </motion.div>

            {/* Help text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-xs text-muted-foreground"
            >
              If the problem persists, please contact support.
            </motion.p>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}