import { User } from "@/models/user";
import { publicProcedure } from "@/server/lib/trpc";
import { pagingSchema } from "@/share/paging";
import { z } from "zod";

export const getFavoritedUsers = publicProcedure
  .input(z.object({ favoriteByUserId: z.string(), page: pagingSchema }))
  .query(async (): Promise<{ list: User[]; allPages: number }> => {
    // TODO
    // const favoritedUserObj = await db.favoriteUser.findMany({
    //   select: { favoritedUserId: true },
    //   where: {
    //     favoriteByUserId: input.favoriteByUserId,
    //   },
    // });

    // const favoritedUserIds = favoritedUserObj.map(
    //   (favorite) => favorite.favoritedUserId
    // );

    // const [favoritedUsers, { allPages }] = await paginate({
    //   finderInput: { where: { id: { in: favoritedUserIds } } },
    //   finder: ({ input, ...args }) => findManyUsers({ ...input, ...args }),
    //   counter: db.user.count,
    //   pagingData: { page, limit: PAGE_LIMIT.favoritedUsers },
    // });

    return { list: [], allPages: 0 };
  });
