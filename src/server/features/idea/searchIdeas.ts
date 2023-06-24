import { pageLimit } from "../../../share/consts";
import { searchIdeaPageSchema } from "../../../share/schema/idea";
import { publicProcedure } from "../../lib/trpc";
import { findSearchedIdeas, Idea } from "../../models/idea";

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
