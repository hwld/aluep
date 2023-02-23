import { z } from "zod";
import { prisma } from "../../prismadb";
import { requireLoggedInProcedure } from "../../trpc";

export const favoriteUser = requireLoggedInProcedure
  .input(z.object({ userId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    await prisma.favoriteUser.create({
      data: {
        userId: input.userId,
        favoritedUserId: ctx.session.user.id,
      },
    });
  });
