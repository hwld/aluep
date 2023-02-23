import { z } from "zod";
import { findManyThemeComments } from "../../models/themeComment";
import { publicProcedure } from "../../trpc";

export const getAllComments = publicProcedure
  .input(z.object({ themeId: z.string().min(1) }))
  .query(async ({ input }) => {
    const comments = await findManyThemeComments({
      where: { themeId: input.themeId },
      orderBy: { createdAt: "asc" },
    });

    return comments;
  });
