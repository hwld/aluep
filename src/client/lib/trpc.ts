import { AppRouter } from "@/server/router";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import SuperJSON from "superjson";

function getBaseUrl() {
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_URL;
  } else {
    return "http://localhost:3000";
  }
}

export const __trpc_old = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: `${getBaseUrl()}/api/trpc` })],
  transformer: SuperJSON,
});

export const trpc = createTRPCNext<AppRouter>({
  config: () => {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      transformer: SuperJSON,
      queryClientConfig: {
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false },
        },
      },
    };
  },
  ssr: false,
});
