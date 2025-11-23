import React, { useEffect } from 'react';
import { trackError } from '@/lib/analytics-advanced';

/**
 * Hook to track and handle errors with additional context
 */
export const useErrorTracking = () => {
  const trackErrorWithContext = (error: Error, context?: Record<string, any>) => {
    trackError(error, {
      ...context,
      url: window.location.href,
      userAgent: navigator.userAgent,
    });
  };

  // Set up global error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      trackErrorWithContext(event.error, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackErrorWithContext(
        new Error(event.reason?.message || 'Unhandled Promise Rejection'),
        {
          reason: event.reason,
          promise: event.promise,
        }
      );
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return { trackError: trackErrorWithContext };
};
