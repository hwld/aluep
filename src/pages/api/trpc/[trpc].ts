import { createTRPCContext } from "@/server/lib/trpc";
import { appRouter } from "@/server/router";
import * as trpcNext from "@trpc/server/adapters/next";

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError: ({ error }) => {
    console.error(error);
  },
});
