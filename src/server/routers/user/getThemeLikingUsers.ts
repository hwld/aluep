import { z } from "zod";
import { pagingSchema } from "../../../share/schema";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";

export const getThemeLikingUsers = publicProcedure
  .input(z.object({ themeId: z.string(), page: pagingSchema }))
  .query(async ({ input }) => {
    const [themeLikesPerPage, { allPages }] = await paginate({
      finder: db.appThemeLike.findMany,
      finderInput: {
        where: { appThemeId: input.themeId },
        orderBy: { createdAt: "desc" as const },
      },
      counter: db.appThemeLike.count,
      pagingData: { page: input.page, limit: 20 },
    });

    const userIds = themeLikesPerPage.map(({ userId }) => userId);

    //ユーザーの情報を取得する
    const usered = await db.user.findMany({
      where: { id: { in: userIds } },
    });

    //userIdsに並び順を合わせる
    const sortusers = usered.sort((a, b) => {
      return userIds.indexOf(a.id) - userIds.indexOf(b.id);
    });

    //usersにceratedAt(いいねをした日)をつける
    const users = sortusers.map((user, i) => ({
      ...user,
      themeLikeCreated: new Date(themeLikesPerPage[i]?.createdAt) ?? 0,
    }));

    return { list: users, allPages };
  });
