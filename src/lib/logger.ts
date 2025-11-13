/**
 * Conditional Logger - Only logs in development environment
 * Prevents sensitive information from being logged in production
 */

const isDevelopment = import.meta.env.DEV;

interface Logger {
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  debug: (...args: any[]) => void;
  group: (label: string, fn: () => void) => void;
  table: (data: any) => void;
  startTimer: (label: string) => { end: () => void };
}

export const logger: Logger = {
  /**
   * Log general information (only in development)
   */
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log errors (only in development)
   * In production, errors should be sent to error tracking service (Sentry)
   */
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
    // TODO: In production, send to Sentry or error tracking service
    // if (!isDevelopment && typeof Sentry !== 'undefined') {
    //   Sentry.captureException(args[0]);
    // }
  },

  /**
   * Log warnings (only in development)
   */
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log debug information (only in development)
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  /**
   * Group logs together (only in development)
   */
  group: (label: string, fn: () => void) => {
    if (isDevelopment) {
      console.group(label);
      fn();
      console.groupEnd();
    }
  },

  /**
   * Log table data (only in development)
   */
  table: (data: any) => {
    if (isDevelopment) {
      console.table(data);
    }
  },

  /**
   * Performance timer for measuring execution time
   * Usage:
   *   const timer = logger.startTimer('operation name');
   *   // ... do work
   *   timer.end();
   */
  startTimer: (label: string) => {
    const start = performance.now();
    
    return {
      end: () => {
        if (isDevelopment) {
          const end = performance.now();
          console.log(`⏱️ ${label} took ${(end - start).toFixed(2)}ms`);
        }
      },
    };
  },
};
