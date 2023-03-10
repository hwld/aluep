import sanitize from "sanitize-html";
import { themeFormSchema } from "../../../share/schema";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";
import { themeDescriptionSanitizeOptions } from "./themeDescriptionSanitizeOptions";

export const createTheme = requireLoggedInProcedure
  .input(themeFormSchema)
  .mutation(async ({ input, ctx }) => {
    const sanitizedThemeDescriptionHtml = sanitize(
      input.descriptionHtml,
      themeDescriptionSanitizeOptions
    );

    const theme = await db.appTheme.create({
      data: {
        title: input.title,
        description: sanitizedThemeDescriptionHtml,
        tags: { create: input.tags.map((id) => ({ tagId: id })) },
        userId: ctx.session.user.id,
      },
    });

    return { themeId: theme.id };
  });
