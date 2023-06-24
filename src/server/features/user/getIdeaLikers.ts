import { z } from "zod";
import { pageLimit } from "../../../share/consts";
import { pagingSchema } from "../../../share/schema/util";
import { sortedInSameOrder } from "../../../share/utils";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { IdeaLiker } from "../../models/ideaLike";
import { findManyUsers } from "../../models/user";

export const getIdeaLikers = publicProcedure
  .input(z.object({ ideaId: z.string(), page: pagingSchema }))
  .query(async ({ input }) => {
    const [ideaLikes, { allPages }] = await paginate({
      finder: db.ideaLike.findMany,
      finderInput: {
        where: { ideaId: input.ideaId },
        orderBy: { createdAt: "desc" as const },
      },
      counter: db.ideaLike.count,
      pagingData: { page: input.page, limit: pageLimit.ideaLikers },
    });

    const likerId = ideaLikes.map(({ userId }) => userId);

    //ユーザーの情報を取得する
    const users = await findManyUsers({
      where: { id: { in: likerId } },
    });

    //userIdsに並び順を合わせる
    const sortedUsers = sortedInSameOrder({
      target: users,
      base: likerId,
      getKey: (t) => t.id,
    });

    //usersにceratedAt(いいねをした日)をつける
    const IdeaLikers: IdeaLiker[] = sortedUsers.map((user, i) => ({
      ...user,
      likedDate: ideaLikes[i].createdAt,
    }));

    return { list: IdeaLikers, allPages };
  });
