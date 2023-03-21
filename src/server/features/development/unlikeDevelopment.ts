import { z } from "zod";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

export const unlikeDevelopment = requireLoggedInProcedure
  .input(z.object({ developmentId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    // TODO: 存在しないdevelopmentLikeを削除しようとしたときの挙動を確かめる
    const deletedLike = await db.appThemeDevelopmentLike.delete({
      where: {
        userId_developmentId: {
          developmentId: input.developmentId,
          userId: ctx.session.user.id,
        },
      },
    });

    return { deletedId: deletedLike.developmentId };
  });
