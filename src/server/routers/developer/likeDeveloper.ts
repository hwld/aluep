import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../../prismadb";
import { requireLoggedInProcedure } from "../../trpc";

export const likeDeveloper = requireLoggedInProcedure
  .input(
    z.object({
      developerId: z.string().min(1).max(100),
      like: z.boolean(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const developer = await db.appThemeDeveloper.findUnique({
      where: { id: input.developerId },
    });
    // 指定されたdeveloperが存在しない場合
    if (!developer) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    // 開発者自身が自分にいいねすることはできない
    if (developer.userId == ctx.session.user.id) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    if (input.like) {
      // いいね
      await db.appThemeDeveloperLike.create({
        data: {
          developer: { connect: { id: developer.id } },
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    } else {
      // いいね解除
      await db.appThemeDeveloperLike.delete({
        where: {
          userId_developerId: {
            developerId: input.developerId,
            userId: ctx.session.user.id,
          },
        },
      });
    }
  });
