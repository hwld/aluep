import { reportDevelopmentMemoInputSchema } from "@/models/report";
import {
  buildReportedUser,
  reportToDiscord,
} from "@/server/lib/reportToDiscord";
import { publicProcedure } from "@/server/lib/trpc";

export const reportDevelopmentMemo = publicProcedure
  .input(reportDevelopmentMemoInputSchema)
  .mutation(async ({ input: report, ctx }) => {
    const loggedInUser = ctx.session?.user;
    const request = ctx.req;

    await reportToDiscord({
      type: "developmentMemo",
      reportedUser: buildReportedUser(request, loggedInUser),
      report,
    });
  });
