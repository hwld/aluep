import { DevLikers } from "@/models/devLike";
import { findManyUsers } from "@/server/finders/user";
import { paginate } from "@/server/lib/paginate";
import { db } from "@/server/lib/prismadb";
import { publicProcedure } from "@/server/lib/trpc";
import { PAGE_LIMIT } from "@/share/consts";
import { pagingSchema } from "@/share/paging";
import { sortedInSameOrder } from "@/share/utils";
import { z } from "zod";

export const getDevLikers = publicProcedure
  .input(z.object({ devId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page } }) => {
    const [devLikes, { allPages }] = await paginate(
      db.developmentLike.findMany,
      {
        finderInput: {
          where: { developmentId: input.devId },
          orderBy: { createdAt: "desc" as const },
        },
        counter: db.developmentLike.count,
        pagingData: { page, limit: PAGE_LIMIT.ideaLikers },
      }
    );

    const likerId = devLikes.map(({ userId }) => userId);

    const users = await findManyUsers({ where: { id: { in: likerId } } });

    const sortedUsers = sortedInSameOrder({
      target: users,
      base: likerId,
      getKey: (t) => t.id,
    });

    const devLikers: DevLikers[] = sortedUsers.map((user, i) => ({
      ...user,
      likedDate: devLikes[i].createdAt,
    }));

    return { list: devLikers, allPages };
  });
