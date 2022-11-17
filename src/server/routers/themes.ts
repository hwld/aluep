import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../prismadb";
import { publicProcedure, requireLoggedInProcedure, router } from "../trpc";

export const themesRoute = router({
  search: publicProcedure
    .input(
      z.object({ keyword: z.string(), tagIds: z.array(z.string().min(1)) })
    )
    .query(async ({ input }) => {
      // キーワード、タグがどちらも指定されていなければ空の配列を返す
      if (input.keyword === "" && input.tagIds.length === 0) {
        return [];
      }

      // タイトル、説明少なくとも一方にinput.keywordが含まれるお題を先に取得する。
      const rawThemesContainsKeyword = await prisma.appTheme.findMany({
        where: {
          OR: [
            { title: { contains: input.keyword } },
            { description: { contains: input.keyword } },
          ],
        },
        include: { tags: true, user: true },
      });
      console.log(rawThemesContainsKeyword);

      // input.tagsをすべて持つお題に絞り込む。
      // 一つのクエリで行いたかったがやる方法がない？
      const rawThemes = rawThemesContainsKeyword.filter((theme) => {
        // お題に含まれているすべてのタグId
        const themeTagIds = theme.tags.map(({ id }) => id);

        return input.tagIds.every((id) => themeTagIds.includes(id));
      });

      const themes = rawThemes.map(
        ({ id, title, description, createdAt, updatedAt, tags, user }) => ({
          id,
          title,
          description,
          user: { id: user.id, name: user.name, image: user.image },
          tags: tags.map(({ id, name }) => ({ id, name })),
          createdAt: createdAt.toLocaleString(),
          updatedAt: updatedAt.toLocaleString(),
        })
      );

      return themes;
    }),
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

  join: requireLoggedInProcedure
    .input(
      z.object({
        themeId: z.string().min(1),
        githubUrl: z.string().regex(/https:\/\/github.com\/[^\/]+\/[^\/]+/),
        comment: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await prisma.appThemeDeveloper.create({
        data: {
          appTheme: { connect: { id: input.themeId } },
          user: { connect: { id: ctx.loggedInUser.id } },
          githubUrl: input.githubUrl,
          comment: input.comment,
        },
      });
    }),

  like: requireLoggedInProcedure
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
      if (theme.userId == ctx.loggedInUser.id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      if (input.like) {
        // いいね
        await prisma.appThemeLike.create({
          data: {
            appTheme: { connect: { id: theme.id } },
            user: { connect: { id: ctx.loggedInUser.id } },
          },
        });
      } else {
        // いいね解除
        await prisma.appThemeLike.delete({
          where: {
            userId_appThemeId: {
              appThemeId: input.themeId,
              userId: ctx.loggedInUser.id,
            },
          },
        });
      }
    }),
});
