import { ideaOrderSchema } from "@/models/idea";
import { pickUpIdeas as pickUp } from "@/server/finders/idea";
import { publicProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export const getPickedIdeas = publicProcedure
  .input(z.object({ order: ideaOrderSchema }))
  .query(async ({ input, ctx }) => {
    const ideas = await pickUp({
      order: input.order,
      limit: 6,
      loggedInUserId: ctx.session?.user.id,
    });

    return ideas;
  });
