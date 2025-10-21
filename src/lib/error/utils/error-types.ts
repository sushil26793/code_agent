export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export class AppError extends Error {
  constructor(
    message: string,
    public severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    public context?: ErrorContext
  ) {
    super(message);
    this.name = 'AppError';
    // Important for instanceof to work properly
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ApiError extends AppError {
  constructor(
    message: string,
    public statusCode: number,
    context?: ErrorContext
  ) {
    super(message, ErrorSeverity.HIGH, context);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ComponentError extends AppError {
  constructor(
    message: string,
    componentName: string,
    context?: ErrorContext
  ) {
    super(message, ErrorSeverity.MEDIUM, {
      ...context,
      component: componentName
    });
    this.name = 'ComponentError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
