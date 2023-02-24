import { z } from "zod";
import { db } from "../../prismadb";
import { publicProcedure } from "../../trpc";

export const getUser = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    const user = await db.user.findFirst({ where: { id: input.userId } });
    return user;
  });
