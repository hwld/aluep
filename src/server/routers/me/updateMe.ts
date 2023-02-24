import { profileFormSchema } from "../../../share/schema";
import { db } from "../../prismadb";
import { requireLoggedInProcedure } from "../../trpc";

export const updateMe = requireLoggedInProcedure
  .input(profileFormSchema)
  .mutation(async ({ input, ctx }) => {
    await db.user.update({
      where: { id: ctx.session.user.id },
      data: { name: input.name, profile: input.profile },
    });
  });
