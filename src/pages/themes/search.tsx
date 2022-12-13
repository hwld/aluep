import { NextPage } from "next";
import { ThemeSearchPage } from "../../client/components/ThemeSearchPage";
import { allTagsQueryKey } from "../../client/hooks/useAllTagsQuery";
import { searchedThemesQueryKey } from "../../client/hooks/useSearchedThemesQuery";
import { withReactQueryGetServerSideProps } from "../../server/lib/GetServerSidePropsWithReactQuery";
import {
  urlParamToString,
  urlParamToStringArray,
} from "../../server/lib/urlParam";
import { appRouter } from "../../server/routers/_app";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session }) => {
    const caller = appRouter.createCaller({ session });

    // URLパラメータからkeyword,tagIds,pageを取得する
    const keyword = urlParamToString(query.keyword, "");
    const tagIds = urlParamToStringArray(query.tagIds, []);
    const page = urlParamToString(query.page, "1");

    await queryClient.prefetchQuery(allTagsQueryKey, () =>
      caller.theme.getAllTags()
    );
    await queryClient.prefetchQuery(
      searchedThemesQueryKey({ keyword, tagIds, page: Number(page) }),
      () => caller.theme.search({ keyword, tagIds, page })
    );
  }
);

const SearchTheme: NextPage = () => {
  return <ThemeSearchPage />;
};
export default SearchTheme;
