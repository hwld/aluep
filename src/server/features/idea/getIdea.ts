import { Idea } from "@/models/idea";
import { findIdea } from "@/server/finders/idea";
import { publicProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export const getIdea = publicProcedure
  .input(z.object({ ideaId: z.string() }))
  .query(async ({ input, ctx }): Promise<Idea | undefined> => {
    const idea = await findIdea({
      where: { id: input.ideaId },
      loggedInUserId: ctx.session?.user.id,
    });
    return idea;
  });
