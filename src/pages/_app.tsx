import { RequireLoginModalProvider } from "@/client/features/session/RequireLoginModalProvider";
import { trpc } from "@/client/lib/trpc";
import "@/client/style/global.css";
import { theme } from "@/client/style/theme";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { AppNavigationProgress } from "@/client/ui/AppNavigationProgress";
import { ErrorBoundary } from "@/client/ui/ErrorBoundary";
import "@mantine/carousel/styles.layer.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.layer.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/nprogress/styles.layer.css";
import "@mantine/tiptap/styles.layer.css";
import { AppProps } from "next/app";
import Head from "next/head";

function App({ Component }: AppProps) {
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

      <MantineProvider theme={theme}>
        <ModalsProvider>
          <RequireLoginModalProvider>
            <Notifications />
            <AppLayout>
              <AppNavigationProgress />
              <Component />
            </AppLayout>
          </RequireLoginModalProvider>
        </ModalsProvider>
      </MantineProvider>
    </ErrorBoundary>
  );
}

export default trpc.withTRPC(App);
