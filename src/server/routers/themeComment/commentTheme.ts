import { themeCommentFormSchema } from "../../../share/schema";
import { db } from "../../prismadb";
import { requireLoggedInProcedure } from "../../trpc";

export const commentTheme = requireLoggedInProcedure
  .input(themeCommentFormSchema)
  .mutation(async ({ input, ctx }) => {
    const comment = await db.appThemeComment.create({
      data: {
        themeId: input.themeId,
        comment: input.comment,
        fromUserId: ctx.session.user.id,
        // 返信元が指定されていればParentChildを作成する
        ...(input.inReplyToCommentId
          ? {
              asChild: {
                create: { parentCommentId: input.inReplyToCommentId },
              },
            }
          : {}),
      },
    });

    return { commentId: comment.id };
  });
