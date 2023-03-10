import { z } from "zod";
import { pageLimit } from "../../../share/consts";
import { pagingSchema } from "../../../share/schema";
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
    const sortusers = users.sort((a, b) => {
      return userIds.indexOf(a.id) - userIds.indexOf(b.id);
    });

    //usersにceratedAt(いいねをした日)をつける
    const userWithCreatedAts = sortusers.map((user, i) => ({
      ...user,
      themeLikeCreated: new Date(themeLikesPerPage[i]?.createdAt) ?? 0,
    }));

    return { list: userWithCreatedAts, allPages };
  });
