import { reportIdeaFormSchema } from "../../../share/schema";
import { buildReportedUser, reportToDiscord } from "../../lib/reportToDiscord";
import { publicProcedure } from "../../lib/trpc";

export const reportIdea = publicProcedure
  .input(reportIdeaFormSchema)
  .mutation(async ({ input: report, ctx }) => {
    const loggedInUser = ctx.session?.user;
    const request = ctx.req;

    await reportToDiscord({
      type: "idea",
      reportedUser: buildReportedUser(request, loggedInUser),
      report,
    });
  });
