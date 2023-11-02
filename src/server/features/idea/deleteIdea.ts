import { db } from "@/server/lib/prismadb";
import { requireLoggedInProcedure } from "@/server/lib/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const deleteIdea = requireLoggedInProcedure
  .input(z.object({ ideaId: z.string().min(1) }))
  .mutation(async ({ input, ctx }) => {
    // ログインユーザーが登録しているお題か確認する
    const idea = await db.idea.findUnique({
      where: { id: input.ideaId },
    });
    if (ctx.session.user.id !== idea?.userId) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    const deleted = await db.idea.delete({ where: { id: input.ideaId } });

    return deleted;
  });
