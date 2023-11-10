import React, { PropsWithChildren } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

const ErrorFallback: React.FC<FallbackProps> = ({ resetErrorBoundary }) => {
  return (
    <div>
      <h1>error</h1>
      <button onClick={resetErrorBoundary}>更新する</button>
    </div>
  );
};

export const AppErrorBoundary: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error("Uncaught error:", error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
