import { db } from "@/server/lib/prismadb";
import { requireLoggedInProcedure } from "@/server/lib/trpc";

export const deleteMe = requireLoggedInProcedure.mutation(async ({ ctx }) => {
  await db.user.delete({ where: { id: ctx.session.user.id } });
});
