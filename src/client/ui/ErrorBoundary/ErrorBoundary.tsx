import { font } from "@/pages/_app";
import clsx from "clsx";
import React, { PropsWithChildren } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import classes from "./ErrorBoundary.module.css";

export const ErrorFallback: React.FC<FallbackProps> = ({
  resetErrorBoundary,
}) => {
  return (
    <div className={clsx(font.className, classes.root)}>
      <div className={classes.content}>
        <h1 className={classes["error-title"]}>Client Error</h1>
        <p className={classes["error-message"]}>
          申し訳ありませんが、クライアント側で予期せぬ問題が発生したため、エラーページを表示しています
          <br />
          下のボタンから画面の更新を試してみてください。
          <br />
          問題が解決しない場合は、
          <a className={classes.link} href="mailto:aluep.app@gmail.com">
            aluep.app@gmail.com
          </a>
          までお問い合わせください。
        </p>

        <button
          className={classes["reset-button"]}
          onClick={resetErrorBoundary}
        >
          更新する
        </button>
      </div>
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
