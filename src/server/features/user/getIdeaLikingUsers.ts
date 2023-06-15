import { z } from "zod";
import { pageLimit } from "../../../share/consts";
import { pagingSchema } from "../../../share/schema";
import { sortedInSameOrder } from "../../../share/utils";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { IdeaLikingUser } from "../../models/ideaLike";
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

    const likingUserId = ideaLikesPerPage.map(({ userId }) => userId);

    //ユーザーの情報を取得する
    const users = await findManyUsers({
      where: { id: { in: likingUserId } },
    });

    //userIdsに並び順を合わせる
    const sortedUsers = sortedInSameOrder({
      target: users,
      base: likingUserId,
      getKey: (t) => t.id,
    });

    //usersにceratedAt(いいねをした日)をつける
    const IdeaLikingUsers: IdeaLikingUser[] = sortedUsers.map((user, i) => ({
      ...user,
      likedDate: ideaLikesPerPage[i].createdAt,
    }));

    return { list: IdeaLikingUsers, allPages };
  });
