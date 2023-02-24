import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

export const deleteMe = requireLoggedInProcedure.mutation(async ({ ctx }) => {
  await db.user.delete({ where: { id: ctx.session.user.id } });
});
