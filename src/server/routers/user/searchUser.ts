import { z } from "zod";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";

export const searchUser = publicProcedure
  .input(z.object({ userName: z.string() }))
  .query(async ({ input }) => {
    if (input.userName === "") {
      return [];
    } else {
      const searchUsers = await db.user.findMany({
        where: { name: { contains: input.userName } },
        take: 30,
      });

      return searchUsers;
    }
  });
