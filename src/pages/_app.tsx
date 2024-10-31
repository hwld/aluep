import { trpc } from "@/client/lib/trpc";
import "@/client/style/global.css";
import { PageProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import "@mantine/carousel/styles.layer.css";
import "@mantine/core/styles.layer.css";
import "@mantine/notifications/styles.layer.css";
import "@mantine/nprogress/styles.layer.css";
import "@mantine/tiptap/styles.layer.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppProps } from "next/app";
import Head from "next/head";
import { Noto_Sans_JP } from "next/font/google";
import React from "react";
import { AppErrorBoundary } from "@/client/ui/ErrorBoundary/ErrorBoundary";

export const font = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

function App({
  Component,
  pageProps: { isSideBarOpen, ...others },
}: AppProps<PageProps>) {
  const getLayout: NonNullable<React.FC["getLayout"]> =
    (Component as any).getLayout ?? ((page) => page);

  return (
    <AppErrorBoundary>
      <Head>
        <title>Aluep</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta
          name="description"
          content="Aluepはアプリ開発のお題を投稿・検索するためのサービスです。投稿者は他の開発者を参考にするためにお題を投稿することができ、開発者は作りたいアプリを見つけることができます。"
        />
        <meta
          name="google-site-verification"
          content="G0JQ3h-VhmlLPCpmRn_9QWm60jiSIVy9F6UGjxnb_cc"
        />
      </Head>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      {getLayout(<Component {...others} />, {
        isSideBarOpen,
      })}
    </AppErrorBoundary>
  );
}

export default trpc.withTRPC(App);
