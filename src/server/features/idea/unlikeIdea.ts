import { z } from "zod";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

export const unlikeIdea = requireLoggedInProcedure
  .input(z.object({ ideaId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const deletedLike = await db.ideaLike.delete({
      where: {
        userId_ideaId: {
          ideaId: input.ideaId,
          userId: ctx.session.user.id,
        },
      },
    });

    return { ideaId: deletedLike.ideaId };
  });
