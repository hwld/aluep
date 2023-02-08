import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  JoinData,
  pageSchema,
  themeCommentFormSchema,
  themeFormSchema,
  themeJoinFormSchema,
  themeOrderSchema,
  themePeriodSchema,
  themeUpdateFormSchema,
} from "../../share/schema";
import { paginate } from "../lib/paginate";
import {
  findManyThemes,
  findTheme,
  pickUpThemes,
  searchThemes,
  Theme,
} from "../models/theme";
import { findManyThemeComments } from "../models/themeComment";
import { findManyThemeDevelopers } from "../models/themeDeveloper";
import { findAllThemeTags, ThemeTag } from "../models/themeTag";
import { UserAndDeveloperLikes, UserAndThemeLikes } from "../models/user";
import { prisma } from "../prismadb";
import { publicProcedure, requireLoggedInProcedure, router } from "../trpc";

export const themeRoute = router({
  //ページを指定して、開発者を取得する
  getDeveloperAllpage: publicProcedure
    .input(z.object({ themeId: z.string(), page: pageSchema }))
    .query(async ({ input: { page }, input, ctx }) => {
      const { data: developers, allPages } = await paginate({
        finderInput: {
          where: { appThemeId: input.themeId },
          loggedInUserId: ctx.session?.user.id,
        },
        finder: findManyThemeDevelopers,
        counter: ({ loggedInUserId, ...others }) =>
          prisma.appThemeDeveloper.count(others),
        pagingData: { page, limit: 20 },
      });

      return { developers, allPages };
    }),

  // すべてのタグを取得する
  getAllTags: publicProcedure.query(async (): Promise<ThemeTag[]> => {
    const allTags = await findAllThemeTags();
    return allTags;
  }),

  // idを指定してテーマを取得する
  get: publicProcedure
    .input(z.object({ themeId: z.string() }))
    .query(async ({ input }): Promise<Theme | undefined> => {
      const theme = await findTheme({ id: input.themeId });
      return theme;
    }),

  // お題を検索する
  search: publicProcedure
    .input(
      z.object({
        keyword: z.string(),
        tagIds: z.array(z.string().min(1)),
        order: themeOrderSchema,
        period: themePeriodSchema,
        page: pageSchema,
      })
    )
    .query(
      async ({ input }): Promise<{ themes: Theme[]; allPages: number }> => {
        const paginatedThemes = await searchThemes(
          {
            keyword: input.keyword,
            tagIds: input.tagIds,
            order: input.order,
            period: input.period,
          },
          { page: input.page, limit: 24 }
        );

        return paginatedThemes;
      }
    ),
  pickUp: publicProcedure
    .input(z.object({ order: themeOrderSchema }))
    .query(async ({ input }) => {
      const pickedUpThemes = await pickUpThemes(input.order, 6);
      return pickedUpThemes;
    }),

  // お題を作成する
  create: requireLoggedInProcedure
    .input(themeFormSchema)
    .mutation(async ({ input, ctx }) => {
      const theme = await prisma.appTheme.create({
        data: {
          title: input.title,
          description: input.description,
          tags: { create: input.tags.map((id) => ({ tagId: id })) },
          userId: ctx.session.user.id,
        },
      });

      return { themeId: theme.id };
    }),

  // お題を更新する
  update: requireLoggedInProcedure
    .input(themeUpdateFormSchema)
    .mutation(async ({ input, ctx }) => {
      // ログインユーザーが投稿したお題が存在するか確認する
      const existingTheme = await prisma.appTheme.findFirst({
        where: { id: input.themeId, userId: ctx.session.user.id },
      });
      if (!existingTheme) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      // 更新前のタグを全部外す
      const deleteAllTags = prisma.appThemeTagOnAppTheme.deleteMany({
        where: { themeId: input.themeId },
      });

      // 入力されたタグを全て付ける
      const attachTags = prisma.appTheme.update({
        where: { id: input.themeId },
        data: {
          title: input.title,
          description: input.description,
          tags: { create: input.tags.map((tagId) => ({ tagId })) },
        },
      });

      // トランザクションを使用する
      await prisma.$transaction([deleteAllTags, attachTags]);
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
    .input(themeJoinFormSchema)
    .mutation(async ({ input, ctx }) => {
      await prisma.appThemeDeveloper.create({
        data: {
          appTheme: { connect: { id: input.themeId } },
          user: { connect: { id: ctx.session.user.id } },
          githubUrl: input.githubUrl,
          comment: input.comment ?? "",
        },
      });
    }),

  // ログインユーザーが指定されたお題に参加しているか
  joined: publicProcedure
    .input(z.object({ themeId: z.string() }))
    .query(async ({ input, ctx }): Promise<JoinData> => {
      const loggedInUser = ctx.session?.user;
      if (!loggedInUser) {
        return { joined: false };
      }

      const developer = await prisma.appThemeDeveloper.findUnique({
        where: {
          userId_appThemeId: {
            userId: loggedInUser.id,
            appThemeId: input.themeId,
          },
        },
        select: { id: true },
      });
      if (!developer) {
        return { joined: false };
      }

      return { joined: true, developerId: developer.id };
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

  // 指定されたお題をいいねしたユーザーを取得する
  getThemeLikingUsers: publicProcedure
    .input(z.object({ themeId: z.string(), page: pageSchema }))
    .query(async ({ input }) => {
      const { data: use, allPages } = await paginate({
        finder: prisma.appThemeLike.findMany,
        finderInput: {
          where: { appThemeId: input.themeId },
          orderBy: { createdAt: "desc" as const },
        },
        counter: prisma.appThemeLike.count,
        pagingData: { page: input.page, limit: 20 },
      });

      const userIds = use.map(({ userId }) => userId);

      //ユーザーの情報を取得する
      const usered = await prisma.user.findMany({
        where: { id: { in: userIds } },
      });

      //userIdsに並び順を合わせる
      const sortusers = usered.sort((a, b) => {
        return userIds.indexOf(a.id) - userIds.indexOf(b.id);
      });

      //usersにceratedAt(いいねをした日)をつける
      const users = sortusers.map((user, i) => ({
        ...user,
        themeLikeCreated: new Date(use[i]?.createdAt) ?? 0,
      }));

      return { users, allPages };
    }),

  // 1カ月間でいいねが多かった投稿を取得する
  getTop10LikesThemesInThisMonth: publicProcedure.query(async () => {
    const themes = await prisma.$transaction(async (tx) => {
      // お題のidのリストを取得する
      type ThemeIdObjs = { themeId: string }[];
      const themeIdObjs = await tx.$queryRaw<ThemeIdObjs>`
        SELECT
          Theme.id as themeId
          , COUNT(ThemeLike.id) as likeCount
          , MIN(Theme.createdAt) as firstPostDatetime
        FROM
          AppThemeLike as ThemeLike
          LEFT JOIN AppTheme as Theme
            ON (ThemeLike.appThemeId = Theme.id)
        WHERE
          Theme.createdAt > (NOW() - INTERVAL 1 MONTh)
        GROUP BY
          Theme.id
        ORDER BY
          likeCount DESC
          , firstPostDatetime ASC
        LIMIT
          10
      `;
      const themeIds = themeIdObjs.map(({ themeId }) => themeId);

      const themes = await findManyThemes(
        { where: { id: { in: themeIds } } },
        tx
      );

      // themeIdsに並び順を合わせる
      const sortedThemes = themes.sort((a, b) => {
        return themeIds.indexOf(a.id) - themeIds.indexOf(b.id);
      });

      return sortedThemes;
    });

    return themes;
  }),

  // 1カ月間でいいねが多かった開発者ユーザーTop10を取得する
  getTop10LikesDevelopersInThisMonth: publicProcedure.query(async () => {
    const developerUsers: UserAndDeveloperLikes[] = await prisma.$transaction(
      async (tx) => {
        // ユーザーidのリストを取得する
        type RawDeveloperUser = { userId: string; likeCount: BigInt }[];
        const rawDeveloperUser = await tx.$queryRaw<RawDeveloperUser>`
        SELECT
          User.id as userId
          , COUNT(DevLike.id) as likeCount
          , MIN(Developer.createdAt) as firstDevelopDatetime
        FROM
          AppThemeDeveloperLike as DevLike
          LEFT JOIN AppThemeDeveloper as Developer
            ON (DevLike.developerId = Developer.id)
          LEFT JOIN User
            ON (Developer.userId = User.id)
        WHERE
          DevLike.createdAt > (NOW() - INTERVAL 1 MONTH)
        GROUP BY
          User.id
        ORDER BY
          likeCount DESC
          , firstDevelopDatetime ASC
        LIMIT
          10
      `;
        const developerUserIds = rawDeveloperUser.map(({ userId }) => userId);

        // ユーザーを取得する
        const users = await tx.user.findMany({
          where: { id: { in: developerUserIds } },
        });

        // developerUserIdsはランキング順どおりになっているが、prismaでinを通すと順番が不定になるので、
        // developeruserIdsの順に並び変える
        const sortedUsers = users.sort((a, b) => {
          return (
            developerUserIds.indexOf(a.id) - developerUserIds.indexOf(b.id)
          );
        });

        // sortedUsersにlikeCountをつける
        const usersAndDeveloperLikes = sortedUsers.map(
          (user, i): UserAndDeveloperLikes => ({
            ...user,
            developerLikes: Number(rawDeveloperUser[i]?.likeCount) ?? 0,
          })
        );

        return usersAndDeveloperLikes;
      }
    );

    return developerUsers;
  }),

  // 1カ月間でいいねが多かった投稿者Top10を取得する
  getTop10LikesPostersInThisMonth: publicProcedure.query(async () => {
    const posterUsers: UserAndThemeLikes[] = await prisma.$transaction(
      async (tx) => {
        type RawPosterUser = { userId: string; likeCount: BigInt }[];
        // このクエリが原因?
        const rawPosterUser = await tx.$queryRaw<RawPosterUser>`
          SELECT
            User.id as userId
            , COUNT(ThemeLike.id) as likeCount
            , MIN(Theme.createdAt) as firstPostDatetime
          FROM
            AppThemeLike as ThemeLike
            LEFT JOIN AppTheme as Theme
              ON (ThemeLike.appThemeId = Theme.id)
            LEFT JOIN User
              ON (Theme.userId = User.id)
          WHERE
            ThemeLike.createdAt > (NOW() - INTERVAL 1 MONTH)
          GROUP BY
            User.id
          ORDER BY
            likeCount DESC
            , firstPostDatetime ASC
          LIMIT
            10
        `;

        const posterUserIds = rawPosterUser.map(({ userId }) => userId);

        // ユーザーを取得する
        const users = await tx.user.findMany({
          where: { id: { in: posterUserIds } },
        });

        // posterUserIdsはランキング順通りになっているが、prismaでinを通すと順番が不定になるので
        // posterUseridsの順に並び変える
        const sortedUsers = users.sort((a, b) => {
          return posterUserIds.indexOf(a.id) - posterUserIds.indexOf(b.id);
        });

        const usersAndThemeLikes = sortedUsers.map(
          (user, i): UserAndThemeLikes => ({
            ...user,
            themeLikes: Number(rawPosterUser[i]?.likeCount) ?? 0,
          })
        );

        return usersAndThemeLikes;
      }
    );

    return posterUsers;
  }),

  // お題にコメントを投稿する
  comment: requireLoggedInProcedure
    .input(themeCommentFormSchema)
    .mutation(async ({ input, ctx }) => {
      const comment = await prisma.appThemeComment.create({
        data: {
          themeId: input.themeId,
          comment: input.comment,
          fromUserId: ctx.session.user.id,
          // 返信元が指定されていればParentChildを作成する
          ...(input.inReplyToCommentId
            ? {
                asChild: {
                  create: { parentCommentId: input.inReplyToCommentId },
                },
              }
            : {}),
        },
      });

      return { commentId: comment.id };
    }),

  // お題につけたコメントを削除する
  deleteComment: requireLoggedInProcedure
    .input(z.object({ commentId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      // ログインユーザーが投稿したコメントか確認する
      const comment = await prisma.appThemeComment.findUnique({
        where: { id: input.commentId },
      });
      if (ctx.session.user.id !== comment?.fromUserId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      await prisma.appThemeComment.delete({ where: { id: input.commentId } });
    }),

  getManyComments: publicProcedure
    .input(z.object({ themeId: z.string().min(1) }))
    .query(async ({ input }) => {
      const comments = await findManyThemeComments({
        where: { themeId: input.themeId },
        orderBy: { createdAt: "asc" },
      });

      return comments;
    }),
});
