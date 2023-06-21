import { z } from "zod";
import { publicProcedure } from "../../lib/trpc";
import { findManyIdeaComments } from "../../models/ideaComment";

export const getAllIdeaComments = publicProcedure
  .input(z.object({ ideaId: z.string().min(1) }))
  .query(async ({ input }) => {
    const comments = await findManyIdeaComments({
      where: { ideaId: input.ideaId },
    });

    return comments;
  });
