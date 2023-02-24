import * as trpcNext from "@trpc/server/adapters/next";
import { createTRPCContext } from "../../../server/lib/trpc";
import { appRouter } from "../../../server/routers";

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
});
