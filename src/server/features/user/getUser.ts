import { publicProcedure } from "@/server/lib/trpc";
import { findUser } from "@/server/models/user";
import { z } from "zod";

export const getUser = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    const user = await findUser({ where: { id: input.userId } });
    return user;
  });
