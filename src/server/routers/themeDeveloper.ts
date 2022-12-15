import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { themeJoinFormSchema } from "../../share/schema";
import { sleep } from "../lib/utils";
import { findThemeDeveloper } from "../models/themeDeveloper";
import { prisma } from "../prismadb";
import { publicProcedure, requireLoggedInProcedure, router } from "../trpc";

export const themeDeveloperRoute = router({
  // 開発者を取得する
  get: publicProcedure
    .input(z.object({ developerId: z.string().min(1).max(100) }))
    .query(async ({ input, ctx }) => {
      const developer = await findThemeDeveloper(
        input.developerId,
        ctx.session?.user.id
      );
      return developer;
    }),

  // 開発者を削除する
  delete: requireLoggedInProcedure
    .input(z.object({ developerId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // ログインユーザーが開発者か確認する
      const developer = await prisma.appThemeDeveloper.findFirst({
        where: { id: input.developerId, userId: ctx.session.user.id },
      });
      if (!developer) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      await prisma.appThemeDeveloper.delete({
        where: { id: input.developerId },
      });

      // TODO
      await sleep(3000);
    }),

  // 開発者を更新する
  update: requireLoggedInProcedure
    .input(themeJoinFormSchema)
    .mutation(async ({ input, ctx }) => {
      // ログインユーザーが開発者か確認する
      const developer = await prisma.appThemeDeveloper.findFirst({
        where: { appThemeId: input.themeId, userId: ctx.session.user.id },
      });
      if (!developer) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      await prisma.appThemeDeveloper.update({
        where: { id: developer.id },
        data: { githubUrl: input.githubUrl, comment: input.comment },
      });
    }),

  // 開発者にいいねする
  like: requireLoggedInProcedure
    .input(
      z.object({
        developerId: z.string().min(1).max(100),
        like: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const developer = await prisma.appThemeDeveloper.findUnique({
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
        await prisma.appThemeDeveloperLike.create({
          data: {
            developer: { connect: { id: developer.id } },
            user: { connect: { id: ctx.session.user.id } },
          },
        });
      } else {
        // いいね解除
        await prisma.appThemeDeveloperLike.delete({
          where: {
            userId_developerId: {
              developerId: input.developerId,
              userId: ctx.session.user.id,
            },
          },
        });
      }
    }),
});
