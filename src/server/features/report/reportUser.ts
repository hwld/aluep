import { reportUserInputSchema } from "@/models/report";
import {
  buildReportedUser,
  reportToDiscord,
} from "@/server/lib/reportToDiscord";
import { publicProcedure } from "@/server/lib/trpc";

export const reportUser = publicProcedure
  .input(reportUserInputSchema)
  .mutation(async ({ input: report, ctx }) => {
    const loggedInUser = ctx.session?.user;
    const request = ctx.req;

    await reportToDiscord({
      type: "user",
      reportedUser: buildReportedUser(request, loggedInUser),
      report,
    });
  });
