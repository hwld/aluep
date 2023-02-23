import { prisma } from "../../prismadb";
import { requireLoggedInProcedure } from "../../trpc";

export const deleteMe = requireLoggedInProcedure.mutation(async ({ ctx }) => {
  await prisma.user.delete({ where: { id: ctx.session.user.id } });
});
