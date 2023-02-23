import sanitize from "sanitize-html";
import { themeFormSchema } from "../../../share/schema";
import { prisma } from "../../prismadb";
import { requireLoggedInProcedure } from "../../trpc";
import { themeDescriptionSanitizeOptions } from "./themeDescriptionSanitizeOptions";

export const createTheme = requireLoggedInProcedure
  .input(themeFormSchema)
  .mutation(async ({ input, ctx }) => {
    const sanitizedThemeDescriptionHtml = sanitize(
      input.descriptionHtml,
      themeDescriptionSanitizeOptions
    );

    const theme = await prisma.appTheme.create({
      data: {
        title: input.title,
        description: sanitizedThemeDescriptionHtml,
        tags: { create: input.tags.map((id) => ({ tagId: id })) },
        userId: ctx.session.user.id,
      },
    });

    return { themeId: theme.id };
  });
