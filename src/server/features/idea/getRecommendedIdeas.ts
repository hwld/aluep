import { findManyIdeas } from "@/server/finders/idea";
import { db } from "@/server/lib/prismadb";
import { publicProcedure } from "@/server/lib/trpc";

export const getRecommendedIdeas = publicProcedure.query(async ({ ctx }) => {
  const recommendedIdeas = await db.recommendedIdea.findMany({ take: 2 });
  const ids = recommendedIdeas.map((r) => r.ideaId);

  const ideas = await findManyIdeas({
    args: { where: (ideas, { inArray }) => inArray(ideas.id, ids) },
    loggedInUserId: ctx.session?.user.id,
  });

  return ideas;
});
