import { reportDevelopmentMemoFormSchema } from "../../../share/schema/report";
import { buildReportedUser, reportToDiscord } from "../../lib/reportToDiscord";
import { publicProcedure } from "../../lib/trpc";

export const reportDevelopmentMemo = publicProcedure
  .input(reportDevelopmentMemoFormSchema)
  .mutation(async ({ input: report, ctx }) => {
    const loggedInUser = ctx.session?.user;
    const request = ctx.req;

    await reportToDiscord({
      type: "developmentMemo",
      reportedUser: buildReportedUser(request, loggedInUser),
      report,
    });
  });
