import { z } from "zod";
import { pageSchema } from "../../../share/schema";
import { paginate } from "../../lib/paginate";
import { findManyThemes } from "../../models/theme";
import { prisma } from "../../prismadb";
import { publicProcedure } from "../../trpc";

export const getPostedThemesByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pageSchema }))
  .query(async ({ input, input: { page } }) => {
    const { data: postThemes, allPages } = await paginate({
      finder: findManyThemes,
      finderInput: { where: { userId: input.userId } },
      counter: prisma.appTheme.count,
      pagingData: { page, limit: 18 },
    });

    return { postThemes, allPages };
  });
