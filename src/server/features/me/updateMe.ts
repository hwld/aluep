import { profileFormSchema } from "../../../share/schema/user";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

export const updateMe = requireLoggedInProcedure
  .input(profileFormSchema)
  .mutation(async ({ input, ctx }) => {
    await db.user.update({
      where: { id: ctx.session.user.id },
      data: { name: input.name, profile: input.profile },
    });
  });
