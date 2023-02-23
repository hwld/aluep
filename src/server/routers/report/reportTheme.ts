import { reportThemeFormSchema } from "../../../share/schema";
import { buildReportedUser, reportToSlack } from "../../lib/reportToSlack";
import { publicProcedure } from "../../trpc";

export const reportTheme = publicProcedure
  .input(reportThemeFormSchema)
  .mutation(async ({ input, ctx }) => {
    const loggedInUser = ctx.session?.user;
    const request = ctx.req;

    await reportToSlack({
      title: "お題の通報",
      reportDetail: input.reportDetail,
      reportedUser: buildReportedUser(request, loggedInUser),
      fields: [
        {
          name: "通報対象のお題",
          value: `<${input.targetTheme.url}|${input.targetTheme.title}>`,
        },
      ],
    });
  });
