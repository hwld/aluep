import { reportIdeaCommentFormSchema } from "../../../share/schema/report";
import { buildReportedUser, reportToDiscord } from "../../lib/reportToDiscord";
import { publicProcedure } from "../../lib/trpc";

export const reportIdeaComment = publicProcedure
  .input(reportIdeaCommentFormSchema)
  .mutation(async ({ input: report, ctx }) => {
    const loggedInUser = ctx.session?.user;
    const request = ctx.req;

    await reportToDiscord({
      type: "ideaComment",
      reportedUser: buildReportedUser(request, loggedInUser),
      report,
    });
  });
