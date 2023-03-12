import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

export const likeDevelopment = requireLoggedInProcedure
  .input(
    z.object({
      developmentId: z.string().min(1).max(100),
      like: z.boolean(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const development = await db.appThemeDevelopment.findUnique({
      where: { id: input.developmentId },
    });
    // 指定されたdevelopmentが存在しない場合
    if (!development) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    // 開発者自身が自分にいいねすることはできない
    if (development.userId == ctx.session.user.id) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    if (input.like) {
      // いいね
      await db.appThemeDevelopmentLike.create({
        data: {
          development: { connect: { id: development.id } },
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    } else {
      // いいね解除
      await db.appThemeDevelopmentLike.delete({
        where: {
          userId_developmentId: {
            developmentId: input.developmentId,
            userId: ctx.session.user.id,
          },
        },
      });
    }
  });
