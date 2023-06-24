import sanitize from "sanitize-html";
import { ideaFormSchema } from "../../../share/schema/idea";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";
import { ideaDescriptionSanitizeOptions } from "./ideaDescriptionSanitizeOptions";

export const createIdea = requireLoggedInProcedure
  .input(ideaFormSchema)
  .mutation(async ({ input, ctx }) => {
    const sanitizedIdeaDescriptionHtml = sanitize(
      input.descriptionHtml,
      ideaDescriptionSanitizeOptions
    );

    const idea = await db.idea.create({
      data: {
        title: input.title,
        description: sanitizedIdeaDescriptionHtml,
        tags: { create: input.tags.map((id) => ({ tagId: id })) },
        userId: ctx.session.user.id,
      },
    });

    return { ideaId: idea.id };
  });
