import { Routes } from "../../share/routes";
import {
  reportDeveloperFormSchema,
  reportThemeCommentFormSchema,
  reportThemeFormSchema,
  reportUserSchema,
} from "../../share/schema";
import { reportToSlack } from "../lib/reportToSlack";
import { publicProcedure, router } from "../trpc";

export const reportRouter = router({
  /**お題を通報する */
  theme: publicProcedure
    .input(reportThemeFormSchema)
    .mutation(async ({ input, ctx }) => {
      const loggedInUser = ctx.session?.user;

      await reportToSlack({
        title: "お題の通報",
        reportDetail: input.reportDetail,
        reportedUser: loggedInUser
          ? {
              url: Routes.userDetail(loggedInUser.id),
              name: loggedInUser.name || "不明なユーザー名",
            }
          : undefined,
        fields: [
          {
            name: "通報対象のお題",
            value: `<${input.targetTheme.url}|${input.targetTheme.title}>`,
          },
        ],
      });
    }),

  /**お題のコメントを通報する */
  themeComment: publicProcedure
    .input(reportThemeCommentFormSchema)
    .mutation(async ({ input, ctx }) => {
      const loggedInUser = ctx.session?.user;

      await reportToSlack({
        title: "お題コメントの通報",
        reportDetail: input.reportDetail,
        reportedUser: loggedInUser
          ? {
              url: Routes.userDetail(loggedInUser.id),
              name: loggedInUser.name || "不明なユーザー名",
            }
          : undefined,
        fields: [
          {
            name: "通報対象のお題コメント",
            value: `<${input.targetCommentUrl}|コメントへのリンク>`,
          },
        ],
      });
    }),

  /**開発情報を通報する */
  developer: publicProcedure
    .input(reportDeveloperFormSchema)
    .mutation(async ({ input, ctx }) => {
      const loggedInUser = ctx.session?.user;

      await reportToSlack({
        title: "開発情報の通報",
        reportDetail: input.reportDetail,
        reportedUser: loggedInUser
          ? {
              url: Routes.userDetail(loggedInUser.id),
              name: loggedInUser.name || "不明なユーザー名",
            }
          : undefined,
        fields: [
          {
            name: "通報対象の開発情報",
            value: `<${input.targetDeveloepr.url}|${input.targetDeveloepr.name}>`,
          },
        ],
      });
    }),

  /**ユーザーを通報する */
  user: publicProcedure
    .input(reportUserSchema)
    .mutation(async ({ input, ctx }) => {
      const loggedInUser = ctx.session?.user;

      await reportToSlack({
        title: "ユーザーの通報",
        reportDetail: input.reportDetail,
        reportedUser: loggedInUser
          ? {
              url: Routes.userDetail(loggedInUser.id),
              name: loggedInUser.name || "不明なユーザー名",
            }
          : undefined,
        fields: [
          {
            name: "通報対象のユーザー",
            value: `<${input.targetUser.url}|${input.targetUser.name}>`,
          },
        ],
      });
    }),
});
