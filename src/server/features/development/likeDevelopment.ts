import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

export const likeDevelopment = requireLoggedInProcedure
  .input(
    z.object({
      developmentId: z.string().min(1).max(100),
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

    const createdLike = await db.appThemeDevelopmentLike.create({
      data: {
        development: { connect: { id: development.id } },
        user: { connect: { id: ctx.session.user.id } },
      },
    });

    return { likedDevelopmentId: createdLike.developmentId };
  });
