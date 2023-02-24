import { z } from "zod";
import { pageSchema } from "../../../share/schema";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";

export const favoritedUsers = publicProcedure
  .input(z.object({ favoriteUserId: z.string(), page: pageSchema }))
  .query(async ({ input, input: { page } }) => {
    const favoriteList = await db.favoriteUser.findMany({
      select: { userId: true },
      where: { favoritedUserId: input.favoriteUserId },
    });

    const ids = favoriteList.map((favorite) => favorite.userId);

    const { data: pagefavo, allPages } = await paginate({
      finderInput: { where: { id: { in: ids } } },
      finder: db.user.findMany,
      counter: db.user.count,
      pagingData: { page, limit: 50 },
    });

    return { pagefavo, allPages };
  });
