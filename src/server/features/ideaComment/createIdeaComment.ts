import { createIdeaCommentInputSchema } from "../../../share/schema/ideaComment";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

export const createIdeaComment = requireLoggedInProcedure
  .input(createIdeaCommentInputSchema)
  .mutation(async ({ input, ctx }) => {
    const comment = await db.ideaComment.create({
      data: {
        ideaId: input.ideaId,
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
