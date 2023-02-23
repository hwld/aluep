import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../prismadb";
import { requireLoggedInProcedure } from "../../trpc";

export const deleteDeveloper = requireLoggedInProcedure
  .input(z.object({ developerId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    // ログインユーザーが開発者か確認する
    const developer = await prisma.appThemeDeveloper.findFirst({
      where: { id: input.developerId, userId: ctx.session.user.id },
    });
    if (!developer) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    await prisma.appThemeDeveloper.delete({
      where: { id: input.developerId },
    });
  });
