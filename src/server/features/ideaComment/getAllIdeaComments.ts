import { findManyIdeaComments } from "@/server/finders/ideaComment";
import { publicProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export const getAllIdeaComments = publicProcedure
  .input(z.object({ ideaId: z.string().min(1) }))
  .query(async ({ input }) => {
    const comments = await findManyIdeaComments({
      where: (comments, { eq }) => {
        return eq(comments.ideaId, input.ideaId);
      },
    });

    return comments;
  });
