import { findManyDevs } from "@/server/finders/dev";
import { publicProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export const getInProgresDevsByUser = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input: { userId }, ctx }) => {
    const devs = await findManyDevs({
      where: { userId, status: "IN_PROGRESS" },
      loggedInUserId: ctx.session?.user.id,
    });

    return devs;
  });
