import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import SuperJSON from "superjson";
import { AppRouter } from "../server/routers/_app";

// TODO: 環境ごとにURLを設定する
function getBaseUrl() {
  return "http://localhost:3000";
}

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: `${getBaseUrl()}/api/trpc` })],
  transformer: SuperJSON,
});
