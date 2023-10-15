import { IdeaLiker } from "@/models/ideaLike";
import { findManyUsers } from "@/server/finders/user";
import { paginate } from "@/server/lib/paginate";
import { db } from "@/server/lib/prismadb";
import { publicProcedure } from "@/server/lib/trpc";
import { pageLimit } from "@/share/consts";
import { pagingSchema } from "@/share/paging";
import { sortedInSameOrder } from "@/share/utils";
import { z } from "zod";

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
