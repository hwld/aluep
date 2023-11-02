import { Idea } from "@/models/idea";
import { publicProcedure } from "@/server/lib/trpc";

export const getRecommendedIdeas = publicProcedure.query(
  async (): Promise<Idea[]> => {
    // TODO:
    // const recommendedIdeas = await db.recommendedIdea.findMany({ take: 2 });
    // const ids = recommendedIdeas.map((r) => r.ideaId);
    // const ideas =
    //   ids.length === 0
    //     ? []
    //     : await findManyIdeas({
    //         args: { where: (ideas, { inArray }) => inArray(ideas.id, ids) },
    //         loggedInUserId: ctx.session?.user.id,
    //       });
    // return ideas;
    return [];
  }
);
