import { AppRouter } from "@/server/router";
import { httpLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { createTRPCMsw } from "msw-trpc";
import SuperJSON from "superjson";

const apiUrl = "http://localhost:6006/api/trpc";

export const mockTRPC = createTRPCReact<AppRouter>();
export const mockTRPCClient = mockTRPC.createClient({
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
  transformer: { output: SuperJSON, input: SuperJSON },
});
