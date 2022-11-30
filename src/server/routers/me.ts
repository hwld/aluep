import { profileFormSchema } from "../../share/schema";
import { prisma } from "../prismadb";
import { requireLoggedInProcedure, router } from "../trpc";

export const meRoute = router({
  update: requireLoggedInProcedure
    .input(profileFormSchema)
    .mutation(async ({ input, ctx }) => {
      await prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { name: input.name },
      });
    }),
  delete: requireLoggedInProcedure.mutation(async ({ ctx }) => {
    await prisma.user.delete({ where: { id: ctx.session.user.id } });
  }),
});
