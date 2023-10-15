import { Idea, searchIdeaPageSchema } from "@/models/idea";
import { findSearchedIdeas } from "@/server/finders/idea";
import { publicProcedure } from "@/server/lib/trpc";
import { pageLimit } from "@/share/consts";

export const searchIdeas = publicProcedure
  .input(searchIdeaPageSchema)
  .query(
    async ({ input, ctx }): Promise<{ ideas: Idea[]; allPages: number }> => {
      const paginatedIdeas = await findSearchedIdeas({
        searchArgs: {
          keyword: input.keyword,
          tagIds: input.tagIds,
          order: input.order,
          period: input.period,
        },
        pagingData: { page: input.page, limit: pageLimit.searchedIdeas },
        loggedInUserId: ctx.session?.user.id,
      });

      return paginatedIdeas;
    }
  );
