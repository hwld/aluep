import { AppProps } from "next/app";
import Head from "next/head";
import { Box, MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { NotificationsProvider } from "@mantine/notifications";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";
import { theme } from "../client/theme";
import { AppLayout } from "../client/components/AppLayout";

export default function App(props: AppProps) {
  const {
    Component,
    pageProps: { dehydratedState, ...pageProps },
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
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        {/* TODO: next.jsのフォント最適化について調べる */}
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700;900&display=swap"
          rel="stylesheet"
        /> */}
      </Head>

      <QueryClientProvider client={queryClient}>
        <Hydrate state={dehydratedState}>
          <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
            <NotificationsProvider>
              <AppLayout>
                <Component {...pageProps} />
              </AppLayout>
            </NotificationsProvider>
          </MantineProvider>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}
