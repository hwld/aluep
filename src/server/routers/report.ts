import { z } from "zod";
import { reportThemeFormSchema } from "../../share/schema";
import { reportToSlack } from "../lib/reportToSlack";
import { publicProcedure, router } from "../trpc";

export const reportRouter = router({
  /**お題を通報する */
  theme: publicProcedure
    .input(reportThemeFormSchema)
    .mutation(async ({ input, ctx }) => {
      await reportToSlack({
        title: "お題への通報",
        reportDetail: input.reportDetail,
        reportedUser: input.reportedUser,
        fields: [
          {
            name: "通報対象のお題",
            value: `<${input.targetThemeUrl}|お題へのリンク>`,
          },
        ],
      });
    }),

  /**お題のコメントを通報する */
  themeComment: publicProcedure.input(z.object({})).mutation(async () => {}),

  /**開発情報を通報する */
  developer: publicProcedure.input(z.object({})).mutation(async () => {}),

  /**ユーザーを通報する */
  user: publicProcedure.input(z.object({})).mutation(async () => {}),
});
