import { findUser } from "@/server/finders/user";
import { publicProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export const getUser = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    const user = await findUser({
      where: (users, { eq }) => {
        return eq(users.id, input.userId);
      },
    });
    return user;
  });
