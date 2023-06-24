import {
  reportToDiscord,
  buildReportedUser,
} from "@/server/lib/reportToDiscord";
import { publicProcedure } from "@/server/lib/trpc";
import { reportIdeaCommentInputSchema } from "@/share/schema/report";

export const reportIdeaComment = publicProcedure
  .input(reportIdeaCommentInputSchema)
  .mutation(async ({ input: report, ctx }) => {
    const loggedInUser = ctx.session?.user;
    const request = ctx.req;

    await reportToDiscord({
      type: "ideaComment",
      reportedUser: buildReportedUser(request, loggedInUser),
      report,
    });
  });
