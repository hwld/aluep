import {
  reportToDiscord,
  buildReportedUser,
} from "@/server/lib/reportToDiscord";
import { publicProcedure } from "@/server/lib/trpc";
import { reportUserInputSchema } from "@/share/schema/report";

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
