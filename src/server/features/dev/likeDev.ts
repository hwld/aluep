import { db } from "@/server/lib/prismadb";
import { requireLoggedInProcedure } from "@/server/lib/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const likeDev = requireLoggedInProcedure
  .input(
    z.object({
      devId: z.string().min(1).max(100),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const dev = await db.development.findUnique({
      where: { id: input.devId },
    });
    // 指定されたdevが存在しない場合
    if (!dev) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    // 開発者自身が自分にいいねすることはできない
    if (dev.userId == ctx.session.user.id) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    const createdLike = await db.developmentLike.create({
      data: {
        development: { connect: { id: dev.id } },
        user: { connect: { id: ctx.session.user.id } },
      },
    });

    return { likedDevId: createdLike.developmentId };
  });
