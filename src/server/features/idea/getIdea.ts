import { publicProcedure } from "@/server/lib/trpc";
import { Idea, findIdea } from "@/server/models/idea";
import { z } from "zod";

export const getIdea = publicProcedure
  .input(z.object({ ideaId: z.string() }))
  .query(async ({ input }): Promise<Idea | undefined> => {
    const idea = await findIdea({ id: input.ideaId });
    return idea;
  });
