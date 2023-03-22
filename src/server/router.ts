import { aggregateRoute } from "./features/aggregate/router";
import { developmentRoute } from "./features/development/router";
import { ideaRoute } from "./features/idea/router";
import { ideaCommentRoute } from "./features/ideaComment/router";
import { meRoute } from "./features/me/router";
import { reportRouter } from "./features/report/router";
import { userRoute } from "./features/user/router";
import { publicProcedure, router } from "./lib/trpc";

export const appRouter = router({
  me: meRoute,
  aggregate: aggregateRoute,
  user: userRoute,
  idea: ideaRoute,
  ideaComment: ideaCommentRoute,
  development: developmentRoute,
  session: publicProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),
  report: reportRouter,
});

export type AppRouter = typeof appRouter;
