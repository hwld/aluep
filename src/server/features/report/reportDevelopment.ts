import { reportDevelopmentFormSchema } from "../../../share/schema";
import { buildReportedUser, reportToDiscord } from "../../lib/reportToDiscord";
import { publicProcedure } from "../../lib/trpc";

export const reportDevelopment = publicProcedure
  .input(reportDevelopmentFormSchema)
  .mutation(async ({ input: report, ctx }) => {
    const loggedInUser = ctx.session?.user;
    const request = ctx.req;

    await reportToDiscord({
      type: "development",
      reportedUser: buildReportedUser(request, loggedInUser),
      report,
    });
  });
