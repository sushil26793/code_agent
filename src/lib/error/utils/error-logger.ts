import { ErrorContext } from "./error-types";



export class ErrorLogger {
    static log(error: Error, context?: ErrorContext) {
        const errorInfo = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            context,
            timeStamp: new Date().toISOString()
        }

        // Log to console in development

        if (process.env.NODE_ENV === "development") {
            console.error('Error logged:', errorInfo);

        }
        return errorInfo;

    }


    static logComponentError(
        error: Error,
        componentName: string,
        additionalContext?: Record<string, unknown>
    ) {
        this.log(error, { component: componentName, ...additionalContext })
    }
}