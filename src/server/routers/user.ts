import { TRPCError } from "@trpc/server";
import { string, z } from "zod";
import { pageSchema } from "../../share/schema";
import { paginate } from "../lib/paginate";
import { findManyThemes } from "../models/theme";
import { prisma } from "../prismadb";
import { publicProcedure, requireLoggedInProcedure, router } from "../trpc";

export const userRoute = router({
  /** 指定されたユーザーが投稿したお題を取得する */
  getPostTheme: publicProcedure
    .input(z.object({ userId: z.string(), page: pageSchema }))
    .query(async ({ input, input: { page } }) => {
      const { data: postThemes, allPages } = await paginate({
        finder: findManyThemes,
        finderInput: { where: { userId: input.userId } },
        counter: prisma.appTheme.count,
        pagingData: { page, limit: 18 },
      });

      return { postThemes, allPages };
    }),

  /** 指定されたユーザが参加しているお題を取得する */
  getJoinTheme: publicProcedure
    .input(z.object({ userId: z.string(), page: pageSchema }))
    .query(async ({ input, input: { page } }) => {
      //すべての開発者からユーザを抽出
      const joinTheme = await prisma.appThemeDeveloper.findMany({
        where: { userId: input.userId },
      });
      //テーマのidだけを抽出
      const joinThemeList = joinTheme.map((theme) => theme.appThemeId);

      const { data: joinPostedTheme, allPages } = await paginate({
        finder: findManyThemes,
        finderInput: { where: { id: { in: joinThemeList } } },
        counter: prisma.appTheme.count,
        pagingData: { page, limit: 18 },
      });

      return { joinPostedTheme, allPages };
    }),

  /** 指定されたユーザがいいねしたお題を取得する */
  getLikeTheme: publicProcedure
    .input(z.object({ userId: z.string(), page: pageSchema }))
    .query(async ({ input, input: { page } }) => {
      //お題にいいねしてあるモデルの中から自分のIDを取得
      const likeThemeIds = await prisma.appThemeLike.findMany({
        select: { appThemeId: true },
        where: { userId: input.userId },
      });
      const likeThemeList = likeThemeIds.map((like) => like.appThemeId);

      const { data: likePostedTheme, allPages } = await paginate({
        finder: findManyThemes,
        finderInput: { where: { id: { in: likeThemeList } } },
        counter: prisma.appTheme.count,
        pagingData: { page, limit: 18 },
      });

      return { likePostedTheme, allPages };
    }),

  /** 指定されたユーザーが投稿したお題についた「いいね」をすべて取得する */
  getThemeLike: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      //whereで条件に一致するidを取得
      const postThemeIds = await prisma.appTheme.findMany({
        select: { id: true },
        where: { userId: input.userId },
      });
      const ids = postThemeIds.map((like) => like.id);
      const likes = await prisma.appThemeLike.count({
        where: { appThemeId: { in: ids } },
      });
      return likes;
    }),

  getThemeDeveloperLike: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const postThemeIds = await prisma.appThemeDeveloper.findMany({
        select: { id: true },
        where: { userId: input.userId },
      });
      const ids = postThemeIds.map((like) => like.id);
      const likes = await prisma.appThemeDeveloperLike.count({
        where: { developerId: { in: ids } },
      });
      return likes;
    }),

  get: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findFirst({ where: { id: input.userId } });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return user;
    }),

  //ユーザ名を検索する
  searchUser: publicProcedure
    .input(
      z.object({
        userName: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (input.userName === "") {
        return [];
      } else {
        const searchUsers = await prisma.user.findMany({
          where: { name: { contains: input.userName } },
          take: 30,
        });

        return searchUsers;
      }
    }),

  //お気に入りを登録
  crateFavorite: requireLoggedInProcedure
    .input(z.object({ userId: z.string(), favoriteUserId: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.favoriteUser.create({
        data: {
          userId: input.userId,
          favoritedUserId: input.favoriteUserId,
        },
      });
    }),

  //お気に入りの解除
  deleteFavorite: requireLoggedInProcedure
    .input(z.object({ userId: z.string(), favoriteUserId: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.favoriteUser.delete({
        where: {
          userId_favoritedUserId: {
            userId: input.userId,
            favoritedUserId: input.favoriteUserId,
          },
        },
      });
    }),

  //お気に入りしているか
  favorited: publicProcedure
    .input(z.object({ userId: z.string(), favoriteUserId: z.string() }))
    .query(async ({ input }): Promise<boolean> => {
      const favorite = await prisma.favoriteUser.findUnique({
        where: {
          userId_favoritedUserId: {
            userId: input.userId,
            favoritedUserId: input.favoriteUserId,
          },
        },
      });
      return Boolean(favorite);
    }),

  //自分がお気に入りしている人数の合計
  favoritedSum: publicProcedure
    .input(z.object({ favoriteUserId: string() }))
    .query(async ({ input }) => {
      const favoritedSum = await prisma.favoriteUser.count({
        where: {
          favoritedUserId: input.favoriteUserId,
        },
      });
      if (favoritedSum === 0) {
        return 0;
      }
      return favoritedSum;
    }),

  //他人がお気に入りしている人数の合計
  favoritedAnotherSum: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const favoritedSum = await prisma.favoriteUser.count({
        where: {
          favoritedUserId: input.userId,
        },
      });
      if (favoritedSum === 0) {
        return 0;
      }
      return favoritedSum;
    }),

  //お気に入りリストの表示
  favoriteList: publicProcedure
    .input(z.object({ favoriteUserId: string(), page: pageSchema }))
    .query(async ({ input, input: { page } }) => {
      const favoriteList = await prisma.favoriteUser.findMany({
        select: { userId: true },
        where: { favoritedUserId: input.favoriteUserId },
      });

      const ids = favoriteList.map((favorite) => favorite.userId);

      const { data: pagefavo, allPages } = await paginate({
        finderInput: { where: { id: { in: ids } } },
        finder: prisma.user.findMany,
        counter: prisma.user.count,
        pagingData: { page, limit: 5 },
      });

      return { pagefavo, allPages };
    }),
});
