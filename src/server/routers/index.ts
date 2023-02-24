import { publicProcedure, router } from "../trpc";
import { aggregateRoute } from "./aggregate";
import { developerRoute } from "./developer";
import { githubRoute } from "./github";
import { meRoute } from "./me";
import { reportRouter } from "./report";
import { themeRoute } from "./theme";
import { themeCommentRoute } from "./themeComment";
import { userRoute } from "./user";

export const appRouter = router({
  me: meRoute,
  aggregate: aggregateRoute,
  user: userRoute,
  theme: themeRoute,
  themeComment: themeCommentRoute,
  developer: developerRoute,
  github: githubRoute,
  session: publicProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),
  report: reportRouter,
});

export type AppRouter = typeof appRouter;
