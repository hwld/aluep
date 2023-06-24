import { z } from "zod";
import { pageLimit } from "../../../share/consts";
import { pagingSchema } from "../../../share/schema/util";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { findManyUsers } from "../../models/user";

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
      finder: findManyUsers,
      counter: db.user.count,
      pagingData: { page, limit: pageLimit.favoritedUsers },
    });

    return { list: favoritedUsers, allPages };
  });
