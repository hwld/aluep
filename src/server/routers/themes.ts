import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../prismadb";
import { publicProcedure, requireLoggedInProcedure, router } from "../trpc";

export type AppThemeWithUserWithTags = {
  id: string;
  title: string;
  description: string;
  tags: { id: string; name: string }[];
  user: { id: string; image: string | null; name: string | null };
  createdAt: string;
  updatedAt: string;
};

export const themesRoute = router({
  // すべてのお題を取得する
  getAll: publicProcedure.query(
    async (): Promise<AppThemeWithUserWithTags[]> => {
      const rawThemes = await prisma.appTheme.findMany({
        include: { tags: true, user: true },
      });
      const themes = rawThemes.map(
        ({ id, title, description, tags, createdAt, updatedAt, user }) => ({
          id,
          title,
          description,
          tags: tags.map(({ id, name }) => ({ id, name })),
          user: { id: user.id, image: user.image, name: user.name },
          createdAt: createdAt.toUTCString(),
          updatedAt: updatedAt.toUTCString(),
        })
      );

      return themes;
    }
  ),

  // すべてのタグを取得する
  getAllTags: publicProcedure.query(async () => {
    const rawTags = await prisma.appThemeTag.findMany();
    const allTags = rawTags.map(({ id, name }) => ({ id, name }));

    return allTags;
  }),

  // idを指定してタグを取得する
  get: publicProcedure
    .input(z.object({ themeId: z.string() }))
    .query(async ({ input }) => {
      const rawTheme = await prisma.appTheme.findUnique({
        where: { id: input.themeId },
        include: {
          tags: true,
          user: true,
          likes: true,
        },
      });

      if (!rawTheme) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const theme = {
        id: rawTheme.id,
        title: rawTheme.title,
        tags: rawTheme.tags.map(({ id, name }) => ({ id, name })),
        description: rawTheme.description,
        createdAt: rawTheme.createdAt.toUTCString(),
        updatedAt: rawTheme.updatedAt.toUTCString(),
        user: {
          id: rawTheme.user.id,
          name: rawTheme.user.name,
          image: rawTheme.user.image,
        },
        likes: rawTheme.likes.length,
      };

      return theme;
    }),

  // お題を検索する
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

  // お題を作成する
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
          userId: ctx.session.user.id,
        },
      });
    }),

  // お題を更新する
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
    .query(async ({ input, ctx }) => {
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
    .query(async ({ input, ctx }) => {
      const rawDevelopers = await prisma.appThemeDeveloper.findMany({
        where: { appThemeId: input.themeId },
        include: { user: true, likes: true },
      });

      const developers = rawDevelopers.map(
        ({ id, user, githubUrl, comment, createdAt, likes }) => ({
          id,
          userid: user.id,
          name: user.name,
          image: user.image,
          githubUrl,
          comment,
          likes: likes.length,
          // ログインユーザーがいいねしているか
          liked: likes.find((like) => like.userId === ctx.session?.user.id)
            ? true
            : false,
          createdAt: createdAt.toUTCString(),
        })
      );

      return developers;
    }),
});
