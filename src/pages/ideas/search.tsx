import { IdeaSearchPage } from "@/client/pageComponents/IdeaSearchPage/IdeaSearchPage";
import { searchIdeaPageSchema } from "@/models/idea";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { NextPage } from "next";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, trpcStore }) => {
    const parseQueryResult = searchIdeaPageSchema.safeParse(query);
    if (!parseQueryResult.success) {
      console.trace("不正なquery");
      return { notFound: true };
    }
    const { keyword, tagIds, page, order, period } = parseQueryResult.data;

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
