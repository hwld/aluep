import { NextPage } from "next";
import { allTagsQueryKey } from "../../client/features/idea/useAllTagsQuery";
import { searchedIdeasQueryKey } from "../../client/features/idea/useSearchedIdeasQuery";
import { IdeaSearchPage } from "../../client/pageComponents/IdeaSearchPage";
import { withReactQueryGetServerSideProps } from "../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../server/router";
import { searchIdeaPageSchema } from "../../share/schema";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, callerContext }) => {
    const caller = appRouter.createCaller(callerContext);

    const parseQueryResult = searchIdeaPageSchema.safeParse(query);
    if (!parseQueryResult.success) {
      return { notFound: true };
    }
    const { keyword, tagIds, page, order, period } = parseQueryResult.data;

    const searchedIdeas = await caller.idea.search({
      keyword,
      tagIds,
      page,
      order,
      period,
    });

    //　検索結果は存在するが、指定されたページが存在しない場合は404にする
    if (searchedIdeas.allPages > 0 && searchedIdeas.ideas.length === 0) {
      return { notFound: true };
    }

    await queryClient.prefetchQuery(allTagsQueryKey, () =>
      caller.idea.getAllTags()
    );
    await queryClient.prefetchQuery(
      searchedIdeasQueryKey({
        keyword,
        tagIds,
        order,
        period,
        page,
      }),
      () => searchedIdeas
    );
  }
);

const SearchIdea: NextPage = () => {
  return <IdeaSearchPage />;
};
export default SearchIdea;