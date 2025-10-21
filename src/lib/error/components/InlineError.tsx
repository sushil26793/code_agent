'use client';

import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FallbackProps } from 'react-error-boundary';

interface InlineErrorProps extends FallbackProps {
  title?: string;
  showRetry?: boolean;
}

export function InlineError({
  error,
  resetErrorBoundary,
  title = 'Something went wrong',
  showRetry = true,
}: InlineErrorProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span className="text-sm">
          {error.message || 'An unexpected error occurred'}
        </span>
        {showRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetErrorBoundary}
            className="ml-4"
          >
            <RefreshCcw className="mr-2 h-3 w-3" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
