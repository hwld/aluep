import { z } from "zod";
import { publicProcedure } from "../../lib/trpc";
import { findManyUsers } from "../../models/user";

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
