import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { pageSchema } from "../../share/schema";
import { paginate } from "../lib/paginate";
import { findManyThemes } from "../models/theme";
import { prisma } from "../prismadb";
import { publicProcedure, router } from "../trpc";

export const userRoute = router({
  //すべてのテーマからthemeのidがユーザidのthemeを取り出す
  getPostTheme: publicProcedure
    .input(z.object({ userId: z.string(), page: pageSchema }))
    .query(async ({ input, input: { page } }) => {
      const { data: postThemes, allPages } = await paginate({
        finder: findManyThemes,
        finderInput: { where: { userId: input.userId } },
        counter: prisma.appTheme.count,
        pagingData: { page, limit: 6 },
      });

      return { postThemes, allPages };
    }),

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
        pagingData: { page, limit: 6 },
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
        pagingData: { page, limit: 6 },
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
        });
        //検索結果がn件以上の場合の処理
        if (searchUsers.length >= 10) {
          const overSearchUsers = [...Array(10)].map((_, i) => {
            return searchUsers[i];
          });
          return overSearchUsers;
        } else {
          return searchUsers;
        }
      }
    }),
});
