import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

export const deleteTheme = requireLoggedInProcedure
  .input(z.object({ themeId: z.string().min(1) }))
  .mutation(async ({ input, ctx }) => {
    // ログインユーザーが登録しているお題か確認する
    const theme = await db.appTheme.findUnique({
      where: { id: input.themeId },
    });
    if (ctx.session.user.id !== theme?.userId) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    await db.appTheme.delete({ where: { id: input.themeId } });
  });
