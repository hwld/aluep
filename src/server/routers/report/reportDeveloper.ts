import { reportDeveloperFormSchema } from "../../../share/schema";
import { buildReportedUser, reportToSlack } from "../../lib/reportToSlack";
import { publicProcedure } from "../../lib/trpc";

export const reportDeveloper = publicProcedure
  .input(reportDeveloperFormSchema)
  .mutation(async ({ input, ctx }) => {
    const loggedInUser = ctx.session?.user;
    const request = ctx.req;

    await reportToSlack({
      title: "開発情報の通報",
      reportDetail: input.reportDetail,
      reportedUser: buildReportedUser(request, loggedInUser),
      fields: [
        {
          name: "通報対象の開発情報",
          value: `<${input.targetDeveloepr.url}|${
            input.targetDeveloepr.name ?? "不明なユーザー名"
          }>`,
        },
      ],
    });
  });
