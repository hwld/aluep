import { z } from "zod";
import { ideaOrderSchema } from "../../../share/schema/idea";
import { publicProcedure } from "../../lib/trpc";
import { pickUpIdeas as pickUp } from "../../models/idea";

export const getPickedIdeas = publicProcedure
  .input(z.object({ order: ideaOrderSchema }))
  .query(async ({ input }) => {
    const ideas = await pickUp(input.order, 6);
    return ideas;
  });
