import { Idea, searchIdeaPageSchema } from "@/models/idea";
import { publicProcedure } from "@/server/lib/trpc";
import { findSearchedIdeas } from "@/server/repositories/idea";
import { pageLimit } from "@/share/consts";

export const searchIdeas = publicProcedure
  .input(searchIdeaPageSchema)
  .query(async ({ input }): Promise<{ ideas: Idea[]; allPages: number }> => {
    const paginatedIdeas = await findSearchedIdeas(
      {
        keyword: input.keyword,
        tagIds: input.tagIds,
        order: input.order,
        period: input.period,
      },
      { page: input.page, limit: pageLimit.searchedIdeas }
    );

    return paginatedIdeas;
  });
