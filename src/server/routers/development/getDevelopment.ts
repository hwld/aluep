import { z } from "zod";
import { publicProcedure } from "../../lib/trpc";
import { findThemeDevelopment } from "../../models/themeDevelopment";

export const getDevelopment = publicProcedure
  .input(z.object({ developmentId: z.string().min(1).max(100) }))
  .query(async ({ input, ctx }) => {
    const development = await findThemeDevelopment(
      input.developmentId,
      ctx.session?.user.id
    );
    return development;
  });
