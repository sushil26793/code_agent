'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { ErrorLogger } from '../utils/error-logger';
import { InlineError } from '../components/InlineError';

interface QueryErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<FallbackProps>;
  queryName?: string;
}

export function QueryErrorBoundary({
  children,
  fallback: FallbackComponent = InlineError,
  queryName,
}: QueryErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          onError={(error) => {
            ErrorLogger.log(error, {
              component: 'QueryErrorBoundary',
              action: 'query_failed',
              metadata: { queryName },
            });
          }}
          FallbackComponent={FallbackComponent}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
