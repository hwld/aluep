import { reportDevMemoInputSchema } from "@/models/report";
import {
  buildReportedUser,
  reportToDiscord,
} from "@/server/lib/reportToDiscord";
import { publicProcedure } from "@/server/lib/trpc";

export const reportDevMemo = publicProcedure
  .input(reportDevMemoInputSchema)
  .mutation(async ({ input: report, ctx }) => {
    const loggedInUser = ctx.session?.user;
    const request = ctx.req;

    await reportToDiscord({
      type: "devMemo",
      reportedUser: buildReportedUser(request, loggedInUser),
      report,
    });
  });
