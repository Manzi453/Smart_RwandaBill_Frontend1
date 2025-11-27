import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4"
        >
          <Card className="w-full max-w-md border-red-200">
            <CardHeader className="text-center">
              <motion.div
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              </motion.div>
              <CardTitle className="text-red-600">
                Oops! Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error Message */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm font-mono text-red-700">
                  {this.state.error?.message || "An unexpected error occurred"}
                </p>
              </div>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === "development" && this.state.errorInfo && (
                <details className="text-xs">
                  <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground">
                    Error Details
                  </summary>
                  <pre className="mt-2 p-2 bg-muted rounded overflow-auto max-h-40 text-xs">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              {/* Help Text */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  💡 Try refreshing the page or going back to the home page. If the
                  problem persists, please contact support.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-4">
                <Button
                  onClick={this.handleReset}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Page
                </Button>
                <Button
                  onClick={this.handleHome}
                  variant="outline"
                  className="w-full"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    }

    return this.props.children;
  }
}
