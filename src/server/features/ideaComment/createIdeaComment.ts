import { createIdeaCommentInputSchema } from "@/models/ideaComment";
import { db } from "@/server/lib/prismadb";
import { requireLoggedInProcedure } from "@/server/lib/trpc";

export const createIdeaComment = requireLoggedInProcedure
  .input(createIdeaCommentInputSchema)
  .mutation(async ({ input, ctx }) => {
    const comment = await db.ideaComment.create({
      data: {
        ideaId: input.ideaId,
        text: input.text,
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
