import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../prismadb";
import { requireLoggedInProcedure } from "../../trpc";

export const deleteComment = requireLoggedInProcedure
  .input(z.object({ commentId: z.string().min(1) }))
  .mutation(async ({ input, ctx }) => {
    // ログインユーザーが投稿したコメントか確認する
    const comment = await prisma.appThemeComment.findUnique({
      where: { id: input.commentId },
    });
    if (ctx.session.user.id !== comment?.fromUserId) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    await prisma.appThemeComment.delete({ where: { id: input.commentId } });
  });
