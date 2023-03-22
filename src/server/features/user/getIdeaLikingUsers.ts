import { z } from "zod";
import { pageLimit } from "../../../share/consts";
import { pagingSchema } from "../../../share/schema";
import { sortedInSameOrder } from "../../../share/utils";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { findManyUsers } from "../../models/user";

export const getIdeaLikingUsers = publicProcedure
  .input(z.object({ ideaId: z.string(), page: pagingSchema }))
  .query(async ({ input }) => {
    const [ideaLikesPerPage, { allPages }] = await paginate({
      finder: db.ideaLike.findMany,
      finderInput: {
        where: { ideaId: input.ideaId },
        orderBy: { createdAt: "desc" as const },
      },
      counter: db.ideaLike.count,
      pagingData: { page: input.page, limit: pageLimit.ideaLikingUsers },
    });

    const userIds = ideaLikesPerPage.map(({ userId }) => userId);

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
      ideaLikeCreated: new Date(ideaLikesPerPage[i]?.createdAt) ?? 0,
    }));

    return { list: userWithCreatedAts, allPages };
  });
