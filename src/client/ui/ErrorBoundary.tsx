import React, { ErrorInfo, PropsWithChildren } from "react";

type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<
  PropsWithChildren,
  { hasError: boolean }
> {
  public state: State = { hasError: false };

  static getDerivedStateFromError(_: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2 style={{ fontFamily: "sans-serif" }}>エラーが発生しました。</h2>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            更新する
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
