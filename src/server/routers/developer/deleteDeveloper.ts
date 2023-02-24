import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../../prismadb";
import { requireLoggedInProcedure } from "../../trpc";

export const deleteDeveloper = requireLoggedInProcedure
  .input(z.object({ developerId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    // ログインユーザーが開発者か確認する
    const developer = await db.appThemeDeveloper.findFirst({
      where: { id: input.developerId, userId: ctx.session.user.id },
    });
    if (!developer) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    await db.appThemeDeveloper.delete({
      where: { id: input.developerId },
    });
  });
