import {
  reportToDiscord,
  buildReportedUser,
} from "@/server/lib/reportToDiscord";
import { publicProcedure } from "@/server/lib/trpc";
import { reportDevelopmentInputSchema } from "@/share/schema/report";

export const reportDevelopment = publicProcedure
  .input(reportDevelopmentInputSchema)
  .mutation(async ({ input: report, ctx }) => {
    const loggedInUser = ctx.session?.user;
    const request = ctx.req;

    await reportToDiscord({
      type: "development",
      reportedUser: buildReportedUser(request, loggedInUser),
      report,
    });
  });
