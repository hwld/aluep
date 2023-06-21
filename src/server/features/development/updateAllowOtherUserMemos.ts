import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

export const updateAllowOtherUserMemos = requireLoggedInProcedure
  .input(
    z.object({ developmentId: z.string(), allowOtherUserMemos: z.boolean() })
  )
  .mutation(async ({ input, ctx }) => {
    const development = await db.development.findUnique({
      where: { id: input.developmentId },
    });

    if (development?.userId !== ctx.session.user.id) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    const updated = await db.development.update({
      data: { allowOtherUserMemos: input.allowOtherUserMemos },
      where: { id: input.developmentId },
    });

    return updated;
  });
