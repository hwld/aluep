import { AppRouter } from "@/server/router";
import { createTRPCProxyClient, httpLink } from "@trpc/client";
import { createTRPCMsw } from "msw-trpc";
import SuperJSON from "superjson";

const apiUrl = "http://localhost:6006/api/trpc";

/**
 *  Storybook用にHttpBatchを無効にしたtRPCのclient
 */
export const trpc = createTRPCProxyClient<AppRouter>({
  // HTTP Batchを無効にしたリンク
  links: [httpLink({ url: apiUrl })],
  transformer: SuperJSON,
});

/**
 * mswのhandlerとして使用するtRPCのclient
 * 上はStorybookの上で動いているコンポーネントのtrpcをモックするが、
 * こちらはStorybookのmswのハンドラとして使用する
 */
export const trpcMsw = createTRPCMsw<AppRouter>({
  baseUrl: apiUrl,
});
