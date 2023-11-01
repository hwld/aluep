import { findManyUsers } from "@/server/finders/user";
import { paginate } from "@/server/lib/paginate";
import { db } from "@/server/lib/prismadb";
import { publicProcedure } from "@/server/lib/trpc";
import { PAGE_LIMIT } from "@/share/consts";
import { pagingSchema } from "@/share/paging";
import { z } from "zod";

export const getFavoritedUsers = publicProcedure
  .input(z.object({ favoriteByUserId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page } }) => {
    const favoritedUserObj = await db.favoriteUser.findMany({
      select: { favoritedUserId: true },
      where: {
        favoriteByUserId: input.favoriteByUserId,
      },
    });

    const favoritedUserIds = favoritedUserObj.map(
      (favorite) => favorite.favoritedUserId
    );

    const [favoritedUsers, { allPages }] = await paginate({
      finderInput: { where: { id: { in: favoritedUserIds } } },
      finder: ({ input, ...args }) => findManyUsers({ ...input, ...args }),
      counter: db.user.count,
      pagingData: { page, limit: PAGE_LIMIT.favoritedUsers },
    });

    return { list: favoritedUsers, allPages };
  });
