import { NextPage } from "next";
import { allTagsQueryKey } from "../../client/features/theme/useAllTagsQuery";
import { searchedThemesQueryKey } from "../../client/features/theme/useSearchedThemesQuery";
import { ThemeSearchPage } from "../../client/pageComponents/ThemeSearchPage";
import { withReactQueryGetServerSideProps } from "../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../server/routers";
import { searchThemeSchema } from "../../share/schema";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, callerContext }) => {
    const caller = appRouter.createCaller(callerContext);

    const parseQueryResult = searchThemeSchema.safeParse(query);
    if (!parseQueryResult.success) {
      return { notFound: true };
    }
    const { keyword, tagIds, page, order, period } = parseQueryResult.data;

    const searchedThemes = await caller.theme.search({
      keyword,
      tagIds,
      page,
      order,
      period,
    });

    //　検索結果は存在するが、指定されたページが存在しない場合は404にする
    if (searchedThemes.allPages > 0 && searchedThemes.themes.length === 0) {
      return { notFound: true };
    }

    await queryClient.prefetchQuery(allTagsQueryKey, () =>
      caller.theme.getAllTags()
    );
    await queryClient.prefetchQuery(
      searchedThemesQueryKey({
        keyword,
        tagIds,
        order,
        period,
        page,
      }),
      () => searchedThemes
    );
  }
);

const SearchTheme: NextPage = () => {
  return <ThemeSearchPage />;
};
export default SearchTheme;
