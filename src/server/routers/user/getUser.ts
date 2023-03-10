import { z } from "zod";
import { publicProcedure } from "../../lib/trpc";
import { findUser } from "../../models/user";

export const getUser = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    const user = await findUser({ where: { id: input.userId } });
    return user;
  });
