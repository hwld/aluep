import { profileFormSchema } from "@/models/user";
import { requireLoggedInProcedure } from "@/server/lib/trpc";

export const updateMe = requireLoggedInProcedure
  .input(profileFormSchema)
  .mutation(async () => {
    // await db.user.update({
    //   where: { id: ctx.session.user.id },
    //   data: {
    //     name: input.name,
    //     profile: input.profile,
    //     welcomeMessageHidden: input.welcomeMessageHidden,
    //   },
    // });
  });
