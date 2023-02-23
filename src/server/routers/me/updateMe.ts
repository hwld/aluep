import { profileFormSchema } from "../../../share/schema";
import { prisma } from "../../prismadb";
import { requireLoggedInProcedure } from "../../trpc";

export const updateMe = requireLoggedInProcedure
  .input(profileFormSchema)
  .mutation(async ({ input, ctx }) => {
    await prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { name: input.name, profile: input.profile },
    });
  });
