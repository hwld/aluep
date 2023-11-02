import { findDev } from "@/server/finders/dev";
import { publicProcedure } from "@/server/lib/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const getDev = publicProcedure
  .input(z.object({ devId: z.string().min(1).max(100) }))
  .query(async ({ input, ctx }) => {
    const dev = await findDev({
      where: { id: input.devId },
      loggedInUserId: ctx.session?.user.id,
    });

    if (!dev) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return dev;
  });
