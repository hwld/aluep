import { Prisma } from "@prisma/client";
import { z } from "zod";
import { pageLimit } from "../../../share/consts";
import { pagingSchema } from "../../../share/schema";
import { sortedInSameOrder } from "../../../share/utils";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { DevelopmentLikingUser } from "../../models/developmentLike";
import { findManyUsers } from "../../models/user";

export const getDevelopmentLikingUsers = publicProcedure
  .input(z.object({ developmentId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page } }) => {
    const [developmentLikesPerPage, { allPages }] = await paginate({
      finder: db.developmentLike.findMany,
      finderInput: {
        where: { developmentId: input.developmentId },
        orderBy: { createdAt: "desc" },
      } satisfies Prisma.DevelopmentLikeFindManyArgs,
      counter: db.developmentLike.count,
      pagingData: { page, limit: pageLimit.ideaLikingUsers },
    });

    const likingUserId = developmentLikesPerPage.map(({ userId }) => userId);

    const users = await findManyUsers({ where: { id: { in: likingUserId } } });

    const sortedUsers = sortedInSameOrder({
      target: users,
      base: likingUserId,
      getKey: (t) => t.id,
    });

    const developmentLikingUsers: DevelopmentLikingUser[] = sortedUsers.map(
      (user, i) => ({
        ...user,
        likedDate: developmentLikesPerPage[i].createdAt,
      })
    );

    return { list: developmentLikingUsers, allPages };
  });
