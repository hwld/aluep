import { themeJoinFormSchema } from "../../../share/schema";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

export const joinTheme = requireLoggedInProcedure
  .input(themeJoinFormSchema)
  .mutation(async ({ input, ctx }) => {
    await db.appThemeDevelopment.create({
      data: {
        appTheme: { connect: { id: input.themeId } },
        user: { connect: { id: ctx.session.user.id } },
        githubUrl: input.githubUrl,
        comment: input.comment ?? "",
      },
    });
  });
