import { pageLimit } from "../../../share/consts";
import { searchIdeaPageSchema } from "../../../share/schema";
import { publicProcedure } from "../../lib/trpc";
import { Idea, searchIdeas } from "../../models/idea";

export const search = publicProcedure
  .input(searchIdeaPageSchema)
  .query(async ({ input }): Promise<{ ideas: Idea[]; allPages: number }> => {
    const paginatedIdeas = await searchIdeas(
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
