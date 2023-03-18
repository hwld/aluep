import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

export const deleteDevelopment = requireLoggedInProcedure
  .input(z.object({ developmentId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    // ログインユーザーが開発者か確認する
    const development = await db.appThemeDevelopment.findFirst({
      where: { id: input.developmentId, userId: ctx.session.user.id },
    });
    if (!development) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    await db.appThemeDevelopment.delete({
      where: { id: input.developmentId },
    });
  });
