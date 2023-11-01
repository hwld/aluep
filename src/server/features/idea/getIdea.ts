import { Idea } from "@/models/idea";
import { findIdea } from "@/server/finders/idea";
import { publicProcedure } from "@/server/lib/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const getIdea = publicProcedure
  .input(z.object({ ideaId: z.string() }))
  .query(async ({ input, ctx }): Promise<Idea> => {
    const idea = await findIdea({
      args: { where: (ideas, { eq }) => eq(ideas.id, input.ideaId) },
      loggedInUserId: ctx.session?.user.id,
    });

    if (!idea) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return idea;
  });
