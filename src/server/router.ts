import { aggregateRoute } from "@/server/features/aggregate/router";
import { developmentRoute } from "@/server/features/development/router";
import { developmentMemoRoute } from "@/server/features/developmentMemo/router";
import { ideaRoute } from "@/server/features/idea/router";
import { ideaCommentRoute } from "@/server/features/ideaComment/router";
import { meRoute } from "@/server/features/me/router";
import { reportRouter } from "@/server/features/report/router";
import { userRoute } from "@/server/features/user/router";
import { publicProcedure, router } from "@/server/lib/trpc";

export const appRouter = router({
  me: meRoute,
  aggregate: aggregateRoute,
  user: userRoute,
  idea: ideaRoute,
  ideaComment: ideaCommentRoute,
  development: developmentRoute,
  developmentMemo: developmentMemoRoute,
  session: publicProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),
  report: reportRouter,
});

export type AppRouter = typeof appRouter;
