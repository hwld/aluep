import { reportThemeCommentFormSchema } from "../../../share/schema";
import { buildReportedUser, reportToSlack } from "../../lib/reportToSlack";
import { publicProcedure } from "../../trpc";

export const reportThemeComment = publicProcedure
  .input(reportThemeCommentFormSchema)
  .mutation(async ({ input, ctx }) => {
    const loggedInUser = ctx.session?.user;
    const request = ctx.req;

    await reportToSlack({
      title: "お題コメントの通報",
      reportDetail: input.reportDetail,
      reportedUser: buildReportedUser(request, loggedInUser),
      fields: [
        {
          name: "通報対象のお題コメント",
          value: `<${input.targetCommentUrl}|コメントへのリンク>`,
        },
      ],
    });
  });
