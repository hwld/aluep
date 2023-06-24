import { publicProcedure } from "@/server/lib/trpc";
import { findDevelopment } from "@/server/models/development";
import { z } from "zod";

export const getDevelopment = publicProcedure
  .input(z.object({ developmentId: z.string().min(1).max(100) }))
  .query(async ({ input, ctx }) => {
    const development = await findDevelopment(
      input.developmentId,
      ctx.session?.user.id
    );
    return development;
  });
