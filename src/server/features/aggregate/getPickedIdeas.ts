import { ideaOrderSchema } from "@/models/idea";
import { publicProcedure } from "@/server/lib/trpc";
import { pickUpIdeas as pickUp } from "@/server/repositories/idea";
import { z } from "zod";

export const getPickedIdeas = publicProcedure
  .input(z.object({ order: ideaOrderSchema }))
  .query(async ({ input }) => {
    const ideas = await pickUp(input.order, 6);
    return ideas;
  });
