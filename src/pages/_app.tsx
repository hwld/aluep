import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";
import superjson from "superjson";
import { AppLayout } from "../client/components/AppLayout";
import "../client/style/global.css";
import { theme } from "../client/style/theme";
import { PageProps } from "../server/lib/GetServerSidePropsWithReactQuery";

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
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <QueryClientProvider client={queryClient}>
        <Hydrate state={superjson.parse(stringifiedDehydratedState || "{}")}>
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
