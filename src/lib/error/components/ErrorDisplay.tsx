'use client';

import { AlertCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ErrorSeverity } from '../utils/error-types';

interface ErrorDisplayProps {
  message: string;
  title?: string;
  severity?: ErrorSeverity;
}

const severityConfig = {
  [ErrorSeverity.LOW]: {
    icon: AlertCircle,
    variant: 'default' as const,
  },
  [ErrorSeverity.MEDIUM]: {
    icon: AlertTriangle,
    variant: 'default' as const,
  },
  [ErrorSeverity.HIGH]: {
    icon: AlertTriangle,
    variant: 'destructive' as const,
  },
  [ErrorSeverity.CRITICAL]: {
    icon: XCircle,
    variant: 'destructive' as const,
  },
};

export function ErrorDisplay({
  message,
  title = 'Error',
  severity = ErrorSeverity.MEDIUM,
}: ErrorDisplayProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <Alert variant={config.variant}>
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
