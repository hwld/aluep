import { z } from "zod";
import { pagingSchema } from "../../../share/schema";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";

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

    const [favoritedUsersPerPage, { allPages }] = await paginate({
      finderInput: { where: { id: { in: favoritedUserIds } } },
      finder: db.user.findMany,
      counter: db.user.count,
      // TODO: 他のAPIもそうだが、ページごとのアイテム数を定数ファイルに分けたい
      pagingData: { page, limit: 50 },
    });

    return { list: favoritedUsersPerPage, allPages };
  });
