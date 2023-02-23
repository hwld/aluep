import { z } from "zod";
import { prisma } from "../../prismadb";
import { publicProcedure } from "../../trpc";

export const getUser = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    const user = await prisma.user.findFirst({ where: { id: input.userId } });
    return user;
  });
