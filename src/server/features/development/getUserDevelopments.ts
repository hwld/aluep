import { Prisma } from "@prisma/client";
import { z } from "zod";
import { UserDevelopment } from "../../../client/features/user/UserDetail/UserDevelopmentCard";
import { pageLimit } from "../../../share/consts";
import { pagingSchema } from "../../../share/schema";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";

export const getUserDevelopments = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page } }) => {
    const [developments, { allPages }] = await paginate({
      finder: db.development.findMany,
      finderInput: {
        where: { userId: input.userId },
        include: { likes: true, idea: true, status: true },
      } satisfies Prisma.DevelopmentFindManyArgs,
      counter: ({ include, ...others }) => db.development.count(others),
      pagingData: { page, limit: pageLimit.userDevelopments },
    });

    const summaries = developments.map((d): UserDevelopment => {
      return {
        ideaId: d.ideaId,
        ideaTitle: d.idea.title,
        developmentId: d.id,
        developerId: d.userId,
        githubUrl: d.githubUrl,
        developmentLikes: d.likes.length,
        developmentStatus: d.status,
        createdAt: d.createdAt.toUTCString(),
      };
    });

    return { list: summaries, allPages };
  });
