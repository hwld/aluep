import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  themeCreateInputSchema,
  themeUpdateInputSchema
} from "../../share/schema";
import {
  findManyThemes,
  findTheme,
  searchThemes,
  Theme
} from "../models/theme";
import { findThemeDevelopers, ThemeDeveloper } from "../models/themeDeveloper";
import { findAllThemeTags, ThemeTag } from "../models/themeTag";
import { prisma } from "../prismadb";
import { publicProcedure, requireLoggedInProcedure, router } from "../trpc";

export const themeRoute = router({
  // すべてのお題を取得する
  getAll: publicProcedure.query(async (): Promise<Theme[]> => {
    const allThemes = await findManyThemes();
    return allThemes;
  }),

  // すべてのタグを取得する
  getAllTags: publicProcedure.query(async (): Promise<ThemeTag[]> => {
    const allTags = await findAllThemeTags();
    return allTags;
  }),

  // idを指定してタグを取得する
  get: publicProcedure
    .input(z.object({ themeId: z.string() }))
    .query(async ({ input }): Promise<Theme> => {
      const theme = await findTheme({ id: input.themeId });

      if (!theme) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return theme;
    }),

  // お題を検索する
  search: publicProcedure
    .input(
      z.object({
        keyword: z.string(),
        tagIds: z.array(z.string().min(1)),
      })
    )
    .query(async ({ input }): Promise<Theme[]> => {
      const themes = await searchThemes({
        keyword: input.keyword,
        tagIds: input.tagIds,
      });

      return themes;
    }),

  // お題を作成する
  create: requireLoggedInProcedure
    .input(themeCreateInputSchema)
    .mutation(async ({ input, ctx }) => {
      await prisma.appTheme.create({
        data: {
          title: input.title,
          description: input.description,
          tags: { connect: input.tags.map((tag) => ({ id: tag })) },
          userId: ctx.session.user.id,
        },
      });
    }),

  // お題を更新する
  update: requireLoggedInProcedure
    .input(themeUpdateInputSchema)
    .mutation(async ({ input, ctx }) => {
      // ログインユーザーが投稿したお題が存在するか確認する
      const existingTheme = await prisma.appTheme.findFirst({
        where: { id: input.themeId, userId: ctx.session.user.id },
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

  // お題を削除する
  delete: requireLoggedInProcedure
    .input(z.object({ themeId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      // ログインユーザーが登録しているお題か確認する
      const theme = await prisma.appTheme.findUnique({
        where: { id: input.themeId },
      });
      if (ctx.session.user.id !== theme?.userId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      await prisma.appTheme.delete({ where: { id: input.themeId } });
    }),

  // お題に参加する
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
          user: { connect: { id: ctx.session.user.id } },
          githubUrl: input.githubUrl,
          comment: input.comment,
        },
      });
    }),

  // お題にいいねする
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
    }),

  // ログインユーザーが指定されたidのお題をいいねしているか
  liked: publicProcedure
    .input(z.object({ themeId: z.string().min(1) }))
    .query(async ({ input, ctx }): Promise<boolean> => {
      const loggedInUser = ctx.session?.user;
      if (!loggedInUser) {
        return false;
      }

      const like = await prisma.appThemeLike.findUnique({
        where: {
          userId_appThemeId: {
            appThemeId: input.themeId,
            userId: loggedInUser.id,
          },
        },
      });

      return Boolean(like);
    }),

  // 指定されたお題の参加者を取得する
  getAllDevelopers: publicProcedure
    .input(z.object({ themeId: z.string().min(1) }))
    .query(async ({ input, ctx }): Promise<ThemeDeveloper[]> => {
      const developers = findThemeDevelopers({
        where: { appThemeId: input.themeId },
        loggedInUserId: ctx.session?.user.id,
      });
      return developers;
    }),

  // 指定されたお題をいいねしたユーザーを取得する
  getLikedUsers: publicProcedure
    .input(z.object({ themeId: z.string() }))
    .query(async ({ input }) => {
      const users = await prisma.user.findMany({
        where: { appThemeLikes: { some: { appThemeId: input.themeId } } },
      });

      return users;
    }),
});
