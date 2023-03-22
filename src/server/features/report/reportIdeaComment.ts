import { reportIdeaCommentFormSchema } from "../../../share/schema";
import { buildReportedUser, reportToSlack } from "../../lib/reportToSlack";
import { publicProcedure } from "../../lib/trpc";

export const reportIdeaComment = publicProcedure
  .input(reportIdeaCommentFormSchema)
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
