import { createIdeaInputSchema } from "@/models/idea";
import { transformIdeaDescription } from "@/server/features/idea/transformIdeaDescription";
import { db } from "@/server/lib/prismadb";
import { requireLoggedInProcedure } from "@/server/lib/trpc";

export const createIdea = requireLoggedInProcedure
  .input(createIdeaInputSchema)
  .mutation(async ({ input, ctx }) => {
    const descriptionHtml = transformIdeaDescription(input.descriptionHtml);

    const idea = await db.idea.create({
      data: {
        title: input.title,
        description: descriptionHtml,
        tags: { create: input.tags.map((id) => ({ tagId: id })) },
        userId: ctx.session.user.id,
      },
    });

    return { ideaId: idea.id };
  });
