import { IdeaSearchPage } from "@/client/pageComponents/IdeaSearchPage/IdeaSearchPage";
import { searchIdeaPageSchema } from "@/models/idea";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { NextPage } from "next";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, trpcStore }) => {
    const parseQueryResult = searchIdeaPageSchema.safeParse(query);
    if (!parseQueryResult.success) {
      return { notFound: true };
    }
    const { keyword, tagIds, page, order, period } = parseQueryResult.data;

    const searchedIdeas = await trpcStore.idea.search.fetch({
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

    await Promise.all([
      trpcStore.idea.getAllTags.prefetch(),
      trpcStore.idea.search.prefetch({ keyword, tagIds, order, period, page }),
    ]);
  }
);

const SearchIdea: NextPage = () => {
  return <IdeaSearchPage />;
};
export default SearchIdea;
