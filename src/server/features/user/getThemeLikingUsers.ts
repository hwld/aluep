import { z } from "zod";
import { pageLimit } from "../../../share/consts";
import { pagingSchema } from "../../../share/schema";
import { sortedInSameOrder } from "../../../share/utils";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { findManyUsers } from "../../models/user";

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
      pagingData: { page: input.page, limit: pageLimit.themeLikingUsers },
    });

    const userIds = themeLikesPerPage.map(({ userId }) => userId);

    //ユーザーの情報を取得する
    const users = await findManyUsers({ where: { id: { in: userIds } } });

    //userIdsに並び順を合わせる
    const sortedUsers = sortedInSameOrder({
      target: users,
      base: userIds,
      getKey: (t) => t.id,
    });

    //usersにceratedAt(いいねをした日)をつける
    const userWithCreatedAts = sortedUsers.map((user, i) => ({
      ...user,
      themeLikeCreated: new Date(themeLikesPerPage[i]?.createdAt) ?? 0,
    }));

    return { list: userWithCreatedAts, allPages };
  });
