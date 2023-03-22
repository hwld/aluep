import { z } from "zod";
import { publicProcedure } from "../../lib/trpc";
import { findIdea, Idea } from "../../models/idea";

export const getIdea = publicProcedure
  .input(z.object({ ideaId: z.string() }))
  .query(async ({ input }): Promise<Idea | undefined> => {
    const idea = await findIdea({ id: input.ideaId });
    return idea;
  });
