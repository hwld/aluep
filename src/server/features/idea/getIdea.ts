import { Idea } from "@/models/idea";
import { publicProcedure } from "@/server/lib/trpc";
import { findIdea } from "@/server/repositories/idea";
import { z } from "zod";

export const getIdea = publicProcedure
  .input(z.object({ ideaId: z.string() }))
  .query(async ({ input }): Promise<Idea | undefined> => {
    const idea = await findIdea({ id: input.ideaId });
    return idea;
  });
