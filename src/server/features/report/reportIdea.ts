import { reportIdeaInputSchema } from "@/models/report";
import {
  buildReportedUser,
  reportToDiscord,
} from "@/server/lib/reportToDiscord";
import { publicProcedure } from "@/server/lib/trpc";

export const reportIdea = publicProcedure
  .input(reportIdeaInputSchema)
  .mutation(async ({ input: report, ctx }) => {
    const loggedInUser = ctx.session?.user;
    const request = ctx.req;

    await reportToDiscord({
      type: "idea",
      reportedUser: buildReportedUser(request, loggedInUser),
      report,
    });
  });
