import { publicProcedure, router } from "../trpc";
import { githubRoute } from "./github";
import { meRoute } from "./me";
import { themeRoute } from "./theme";
import { themeDeveloperRoute } from "./themeDeveloper";

export const appRouter = router({
  me: meRoute,
  theme: themeRoute,
  themeDeveloper: themeDeveloperRoute,
  github: githubRoute,
  session: publicProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),
});

export type AppRouter = typeof appRouter;
