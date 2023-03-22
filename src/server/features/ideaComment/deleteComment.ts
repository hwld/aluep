import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

export const deleteComment = requireLoggedInProcedure
  .input(z.object({ commentId: z.string().min(1) }))
  .mutation(async ({ input, ctx }) => {
    // ログインユーザーが投稿したコメントか確認する
    const comment = await db.ideaComment.findUnique({
      where: { id: input.commentId },
    });
    if (ctx.session.user.id !== comment?.fromUserId) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    await db.ideaComment.delete({ where: { id: input.commentId } });
  });
