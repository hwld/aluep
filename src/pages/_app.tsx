import { RequireLoginModalProvider } from "@/client/features/session/RequireLoginModalProvider";
import { theme } from "@/client/style/theme";
import { AppLayout } from "@/client/ui/AppLayout";
import { AppNavigationProgress } from "@/client/ui/AppNavigationProgress";
import { ErrorBoundary } from "@/client/ui/ErrorBoundary";
import { PageProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";
import superjson from "superjson";

export default function App(props: AppProps<PageProps>) {
  const {
    Component,
    pageProps: { stringifiedDehydratedState, ...pageProps },
  } = props;
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false },
        },
      })
  );

  return (
    <ErrorBoundary>
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

      <QueryClientProvider client={queryClient}>
        <Hydrate state={superjson.parse(stringifiedDehydratedState || "{}")}>
          <MantineProvider theme={theme}>
            <ModalsProvider>
              <RequireLoginModalProvider>
                <Notifications />
                <AppLayout>
                  <AppNavigationProgress />
                  <Component {...pageProps} />
                </AppLayout>
              </RequireLoginModalProvider>
            </ModalsProvider>
          </MantineProvider>
        </Hydrate>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
