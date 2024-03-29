import { findManyUsers } from "@/server/finders/user";
import { publicProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export const searchUser = publicProcedure
  .input(z.object({ userName: z.string() }))
  .query(async ({ input }) => {
    if (input.userName === "") {
      return [];
    } else {
      const searchUsers = await findManyUsers({
        where: { name: { contains: input.userName } },
      });

      return searchUsers;
    }
  });
