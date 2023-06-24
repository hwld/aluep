import { publicProcedure } from "@/server/lib/trpc";
import { Idea, findSearchedIdeas } from "@/server/models/idea";
import { pageLimit } from "@/share/consts";
import { searchIdeaPageSchema } from "@/share/schema/idea";

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
