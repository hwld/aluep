import { db } from "../../prismadb";
import { requireLoggedInProcedure } from "../../trpc";

export const deleteMe = requireLoggedInProcedure.mutation(async ({ ctx }) => {
  await db.user.delete({ where: { id: ctx.session.user.id } });
});
