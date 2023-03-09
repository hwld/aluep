import { reportUserFormSchema } from "../../../share/schema";
import { buildReportedUser, reportToSlack } from "../../lib/reportToSlack";
import { publicProcedure } from "../../lib/trpc";

export const reportUser = publicProcedure
  .input(reportUserFormSchema)
  .mutation(async ({ input, ctx }) => {
    const loggedInUser = ctx.session?.user;
    const request = ctx.req;

    await reportToSlack({
      title: "ユーザーの通報",
      reportDetail: input.reportDetail,
      reportedUser: buildReportedUser(request, loggedInUser),
      fields: [
        {
          name: "通報対象のユーザー",
          value: `<${input.targetUser.url}|${input.targetUser.name}>`,
        },
      ],
    });
  });
