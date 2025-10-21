'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { ErrorLogger } from '../utils/error-logger';
import { ApiError } from '../utils/error-types';

export function useErrorHandler() {
  const handleError = useCallback((error: Error | ApiError, context?: string) => {
    ErrorLogger.log(error, { action: context });

    // Type guard to check if error is ApiError
    if (error instanceof ApiError) {
      // Now TypeScript knows error is ApiError with statusCode
      if (error.statusCode >= 500) {
        toast.error('Server Error', {
          description: 'Something went wrong on our end. Please try again later.',
        });
      } else if (error.statusCode === 404) {
        toast.error('Not Found', {
          description: error.message,
        });
      } else {
        toast.error('Error', {
          description: error.message,
        });
      }
    } else {
      toast.error('Error', {
        description: error.message || 'An unexpected error occurred',
      });
    }
  }, []);

  return { handleError };
}
