import { Prisma } from "@prisma/client";
import { z } from "zod";
import { pageLimit } from "../../../share/consts";
import { pagingSchema } from "../../../share/schema";
import { sortedInSameOrder } from "../../../share/utils";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { DevelopmentLikers } from "../../models/developmentLike";
import { findManyUsers } from "../../models/user";

export const getDevelopmentLikers = publicProcedure
  .input(z.object({ developmentId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page } }) => {
    const [developmentLikes, { allPages }] = await paginate({
      finder: db.developmentLike.findMany,
      finderInput: {
        where: { developmentId: input.developmentId },
        orderBy: { createdAt: "desc" },
      } satisfies Prisma.DevelopmentLikeFindManyArgs,
      counter: db.developmentLike.count,
      pagingData: { page, limit: pageLimit.ideaLikers },
    });

    const likerId = developmentLikes.map(({ userId }) => userId);

    const users = await findManyUsers({ where: { id: { in: likerId } } });

    const sortedUsers = sortedInSameOrder({
      target: users,
      base: likerId,
      getKey: (t) => t.id,
    });

    const developmentLikers: DevelopmentLikers[] = sortedUsers.map(
      (user, i) => ({
        ...user,
        likedDate: developmentLikes[i].createdAt,
      })
    );

    return { list: developmentLikers, allPages };
  });
