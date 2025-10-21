'use client';

import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { ErrorLogger } from '../utils/error-logger';
import { ErrorFallback } from '../components/ErrorFallback';
import { InlineError } from '../components/InlineError';

interface ComponentErrorBoundaryProps {
  children: React.ReactNode;
  componentName: string;
  fallback?: React.ComponentType<FallbackProps>;
  inline?: boolean;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export function ComponentErrorBoundary({
  children,
  componentName,
  fallback,
  inline = false,
  onError,
}: ComponentErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    ErrorLogger.logComponentError(error, componentName, {
      componentStack: errorInfo.componentStack,
    });
    
    onError?.(error, errorInfo);
  };

  const FallbackComponent = fallback || (inline ? InlineError : ErrorFallback);

  return (
    <ErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={handleError}
      onReset={() => {
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
