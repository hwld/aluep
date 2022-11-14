import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../prismadb";
import { requireLoggedInProcedure, router } from "../trpc";

export const themesRoute = router({
  create: requireLoggedInProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        tags: z.array(z.string().min(1)),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await prisma.appTheme.create({
        data: {
          title: input.title,
          description: input.description,
          tags: { connect: input.tags.map((tag) => ({ id: tag })) },
          userId: ctx.loggedInUser.id,
        },
      });
    }),

  update: requireLoggedInProcedure
    .input(
      z.object({
        themeId: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
        tags: z.array(z.string().min(1)),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // ログインユーザーが投稿したお題が存在するか確認する
      const existingTheme = await prisma.appTheme.findFirst({
        where: { id: input.themeId, userId: ctx.loggedInUser.id },
      });
      if (!existingTheme) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      await prisma.appTheme.update({
        where: { id: input.themeId },
        data: {
          title: input.title,
          description: input.description,
          tags: {
            set: input.tags.map((t) => ({ id: t })),
          },
        },
      });
    }),

  delete: requireLoggedInProcedure
    .input(z.object({ themeId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      // ログインユーザーが登録しているお題か確認する
      const theme = await prisma.appTheme.findUnique({
        where: { id: input.themeId },
      });
      if (ctx.loggedInUser.id !== theme?.userId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      await prisma.appTheme.delete({ where: { id: input.themeId } });
    }),
});
