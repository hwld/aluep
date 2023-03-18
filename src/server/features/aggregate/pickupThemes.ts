import { z } from "zod";
import { themeOrderSchema } from "../../../share/schema";
import { publicProcedure } from "../../lib/trpc";
import { pickUpThemes as pickUp } from "../../models/theme";

export const pickUpThemes = publicProcedure
  .input(z.object({ order: themeOrderSchema }))
  .query(async ({ input }) => {
    const themes = await pickUp(input.order, 6);
    return themes;
  });
