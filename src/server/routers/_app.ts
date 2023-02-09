import { publicProcedure, router } from "../trpc";
import { githubRoute } from "./github";
import { meRoute } from "./me";
import { reportRouter } from "./report";
import { themeRoute } from "./theme";
import { themeDeveloperRoute } from "./themeDeveloper";
import { userRoute } from "./user";

export const appRouter = router({
  me: meRoute,
  user: userRoute,
  theme: themeRoute,
  themeDeveloper: themeDeveloperRoute,
  github: githubRoute,
  session: publicProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),
  report: reportRouter,
});

export type AppRouter = typeof appRouter;
