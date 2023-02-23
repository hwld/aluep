import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../prismadb";
import { requireLoggedInProcedure } from "../../trpc";

export const likeTheme = requireLoggedInProcedure
  .input(z.object({ themeId: z.string().min(1), like: z.boolean() }))
  .mutation(async ({ input, ctx }) => {
    const theme = await prisma.appTheme.findUnique({
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

    if (input.like) {
      // いいね
      await prisma.appThemeLike.create({
        data: {
          appTheme: { connect: { id: theme.id } },
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    } else {
      // いいね解除
      await prisma.appThemeLike.delete({
        where: {
          userId_appThemeId: {
            appThemeId: input.themeId,
            userId: ctx.session.user.id,
          },
        },
      });
    }
  });
