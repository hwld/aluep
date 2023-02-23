import { themeJoinFormSchema } from "../../../share/schema";
import { prisma } from "../../prismadb";
import { requireLoggedInProcedure } from "../../trpc";

export const joinTheme = requireLoggedInProcedure
  .input(themeJoinFormSchema)
  .mutation(async ({ input, ctx }) => {
    await prisma.appThemeDeveloper.create({
      data: {
        appTheme: { connect: { id: input.themeId } },
        user: { connect: { id: ctx.session.user.id } },
        githubUrl: input.githubUrl,
        comment: input.comment ?? "",
      },
    });
  });
