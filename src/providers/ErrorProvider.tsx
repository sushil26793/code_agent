'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorLogger } from '@/lib/error/utils/error-logger';
import { ErrorFallback } from '@/lib/error/components/ErrorFallback';

export function ErrorProvider({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        ErrorLogger.log(error, {
          component: 'GlobalErrorBoundary',
          metadata: {
            componentStack: errorInfo.componentStack,
          },
        });
      }}
      onReset={() => {
        window.location.href = '/';
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
