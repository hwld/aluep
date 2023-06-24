import { ideaDescriptionSanitizeOptions } from "@/server/features/idea/ideaDescriptionSanitizeOptions";
import { db } from "@/server/lib/prismadb";
import { requireLoggedInProcedure } from "@/server/lib/trpc";
import { createIdeaInputSchema } from "@/share/schema/idea";
import sanitize from "sanitize-html";

export const createIdea = requireLoggedInProcedure
  .input(createIdeaInputSchema)
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
