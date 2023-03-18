import { aggregateRoute } from "./features/aggregate/router";
import { developmentRoute } from "./features/development/router";
import { githubRoute } from "./features/github/router";
import { meRoute } from "./features/me/router";
import { reportRouter } from "./features/report/router";
import { themeRoute } from "./features/theme/router";
import { themeCommentRoute } from "./features/themeComment/router";
import { userRoute } from "./features/user/router";
import { publicProcedure, router } from "./lib/trpc";

export const appRouter = router({
  me: meRoute,
  aggregate: aggregateRoute,
  user: userRoute,
  theme: themeRoute,
  themeComment: themeCommentRoute,
  development: developmentRoute,
  github: githubRoute,
  session: publicProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),
  report: reportRouter,
});

export type AppRouter = typeof appRouter;
