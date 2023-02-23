import { z } from "zod";
import { prisma } from "../../prismadb";
import { requireLoggedInProcedure } from "../../trpc";

export const unfavoriteUser = requireLoggedInProcedure
  .input(z.object({ userId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    await prisma.favoriteUser.delete({
      where: {
        userId_favoritedUserId: {
          userId: input.userId,
          favoritedUserId: ctx.session.user.id,
        },
      },
    });
  });
