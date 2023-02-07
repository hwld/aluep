import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { useState } from "react";
import superjson from "superjson";
import { AppLayout } from "../client/components/AppLayout";
import { AppNavigationProgress } from "../client/components/AppNavigationProgress";
import { RequireLoginModalProvider } from "../client/contexts/RequireLoginModalProvider";
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
      {/* idは環境変数で付けたほうが柔軟性があるけど、めんどくさいのでとりあえず・・・ */}
      {/* また、next.jsではクライアントサイドのルーティングが多いので、これだけだと正しく測定できない。 */}
      {/* 参考:(https://github.com/vercel/next.js/tree/canary/examples/with-google-analytics) */}
      {/* Google tag (gtag.js)  */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-Q6CPPR70ZM" />
      <Script
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-Q6CPPR70ZM');
          `,
        }}
      />
      <Head>
        <title>Atopose</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta
          name="google-site-verification"
          content="_asspesaHdXrFgIrOfHxy_aSen_ECuxyphxcl-TqBtI"
        />
      </Head>

      <QueryClientProvider client={queryClient}>
        <Hydrate state={superjson.parse(stringifiedDehydratedState || "{}")}>
          <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
            <NotificationsProvider position="bottom-center">
              <ModalsProvider>
                <RequireLoginModalProvider>
                  <AppLayout>
                    <AppNavigationProgress />
                    <Component {...pageProps} />
                  </AppLayout>
                </RequireLoginModalProvider>
              </ModalsProvider>
            </NotificationsProvider>
          </MantineProvider>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}
