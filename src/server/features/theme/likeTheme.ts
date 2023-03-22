import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

export const likeTheme = requireLoggedInProcedure
  .input(z.object({ themeId: z.string().min(1) }))
  .mutation(async ({ input, ctx }) => {
    const theme = await db.appTheme.findUnique({
      where: { id: input.themeId },
    });
    // 指定されたthemeが存在しない場合
    if (!theme) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    // 投稿者が自分のお題にいいねすることはできない
    if (theme.userId == ctx.session.user.id) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    // いいね
    const createdLike = await db.appThemeLike.create({
      data: {
        appTheme: { connect: { id: theme.id } },
        user: { connect: { id: ctx.session.user.id } },
      },
    });

    return { themeId: createdLike.appThemeId };
  });
