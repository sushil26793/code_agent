// 'use client';

// import { AlertTriangle } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { FallbackProps } from 'react-error-boundary';

// export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
//   return (
//     <div className="flex items-center justify-center min-h-[400px] p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <AlertTriangle className="h-5 w-5 text-destructive" />
//             <CardTitle>Oops! Something went wrong</CardTitle>
//           </div>
//           <CardDescription>
//             We encountered an error while loading this section
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="rounded-md bg-muted p-4">
//             <p className="text-sm font-mono text-muted-foreground">
//               {error.message}
//             </p>
//           </div>
//         </CardContent>
//         <CardFooter className="flex gap-2">
//           <Button onClick={resetErrorBoundary} variant="default">
//             Try Again
//           </Button>
//           <Button
//             onClick={() => (window.location.href = '/')}
//             variant="outline"
//           >
//             Go Home
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }




'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FallbackProps } from 'react-error-boundary';

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex items-center justify-center w-full h-full p-4 bg-gradient-to-b from-background via-muted/10 to-background">
      <Card className="w-full max-w-md border border-border/50 shadow-xl rounded-2xl bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 shadow-inner">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-lg sm:text-xl font-semibold tracking-tight">
            Oops! Something went wrong
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            We encountered an issue while loading this section.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg bg-muted/40 px-4 py-3 border border-border/30 text-center">
            <p className="text-sm font-mono text-muted-foreground break-all leading-relaxed">
              {error.message || 'An unexpected error occurred.'}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={resetErrorBoundary}
            className="w-full sm:w-auto px-6 shadow-md hover:shadow-lg transition-all duration-200"
          >
            Try Again
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            variant="outline"
            className="w-full sm:w-auto px-6 hover:bg-accent/20 transition-all duration-200"
          >
            Go Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
