import { Idea } from "@/models/idea";
import { _findIdea } from "@/server/finders/idea";
import { publicProcedure } from "@/server/lib/trpc";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import * as schema from "@/server/dbSchema";

export const getIdea = publicProcedure
  .input(z.object({ ideaId: z.string() }))
  .query(async ({ input, ctx }): Promise<Idea> => {
    const idea = await _findIdea({
      args: { where: eq(schema.ideas.id, input.ideaId) },
      loggedInUserId: ctx.session?.user.id,
    });

    if (!idea) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return idea;
  });
