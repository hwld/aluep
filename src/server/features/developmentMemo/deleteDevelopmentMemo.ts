import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

export const deleteDevelopmentMemo = requireLoggedInProcedure
  .input(z.object({ developmentMemoId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const memo = await db.developmentMemo.findUnique({
      where: { id: input.developmentMemoId },
    });

    if (memo?.fromUserId !== ctx.session.user.id) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    const deletedMemo = await db.developmentMemo.delete({
      where: { id: input.developmentMemoId },
    });

    return deletedMemo;
  });
