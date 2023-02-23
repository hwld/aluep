import { z } from "zod";
import { prisma } from "../../prismadb";
import { publicProcedure } from "../../trpc";

export const searchUser = publicProcedure
  .input(
    z.object({
      userName: z.string(),
    })
  )
  .query(async ({ input }) => {
    if (input.userName === "") {
      return [];
    } else {
      const searchUsers = await prisma.user.findMany({
        where: { name: { contains: input.userName } },
        take: 30,
      });

      return searchUsers;
    }
  });
