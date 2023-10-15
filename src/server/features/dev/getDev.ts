import { findDev } from "@/server/finders/dev";
import { publicProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export const getDev = publicProcedure
  .input(z.object({ devId: z.string().min(1).max(100) }))
  .query(async ({ input, ctx }) => {
    const dev = await findDev(input.devId, ctx.session?.user.id);
    return dev;
  });
