import { z } from "zod";
import { pageSchema } from "../../../share/schema";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";

export const getFavoritedUsers = publicProcedure
  .input(z.object({ favoriteByUserId: z.string(), page: pageSchema }))
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

    const [favoritedUsersPerPage, { allPages }] = await paginate({
      finderInput: { where: { id: { in: favoritedUserIds } } },
      finder: db.user.findMany,
      counter: db.user.count,
      pagingData: { page, limit: 50 },
    });

    return { list: favoritedUsersPerPage, allPages };
  });
