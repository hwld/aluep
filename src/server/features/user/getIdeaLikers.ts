import { IdeaLiker } from "@/models/ideaLike";
import { publicProcedure } from "@/server/lib/trpc";
import { pagingSchema } from "@/share/paging";
import { z } from "zod";

export const getIdeaLikers = publicProcedure
  .input(z.object({ ideaId: z.string(), page: pagingSchema }))
  .query(async (): Promise<{ list: IdeaLiker[]; allPages: number }> => {
    // const [ideaLikes, { allPages }] = await paginate({
    //   finder: ({ input, ...args }) =>
    //     db.ideaLike.findMany({ ...input, ...args }),
    //   finderInput: {
    //     where: { ideaId: input.ideaId },
    //     orderBy: { createdAt: "desc" as const },
    //   },
    //   counter: db.ideaLike.count,
    //   pagingData: { page: input.page, limit: PAGE_LIMIT.ideaLikers },
    // });

    // const likerId = ideaLikes.map(({ userId }) => userId);

    // //ユーザーの情報を取得する
    // const users = likerId.length
    //   ? await findManyUsers({
    //       where: (users, { inArray }) => {
    //         return inArray(users.id, likerId);
    //       },
    //     })
    //   : [];

    // //userIdsに並び順を合わせる
    // const sortedUsers = sortedInSameOrder({
    //   target: users,
    //   base: likerId,
    //   getKey: (t) => t.id,
    // });

    // //usersにceratedAt(いいねをした日)をつける
    // const IdeaLikers: IdeaLiker[] = sortedUsers.map((user, i) => ({
    //   ...user,
    //   likedDate: ideaLikes[i].createdAt,
    // }));

    // return { list: IdeaLikers, allPages };
    return { list: [], allPages: 0 };
  });
