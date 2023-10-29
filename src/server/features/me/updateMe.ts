import { profileFormSchema } from "@/models/user";
import { db } from "@/server/lib/prismadb";
import { requireLoggedInProcedure } from "@/server/lib/trpc";

export const updateMe = requireLoggedInProcedure
  .input(profileFormSchema)
  .mutation(async ({ input, ctx }) => {
    await db.user.update({
      where: { id: ctx.session.user.id },
      data: {
        name: input.name,
        profile: input.profile,
        welcomeMessageHidden: input.welcomeMessageHidden,
      },
    });
  });
