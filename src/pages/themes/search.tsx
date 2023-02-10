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
import {
  ThemeOrder,
  themeOrderSchema,
  ThemePeriod,
  themePeriodSchema,
} from "../../share/schema";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, callerContext }) => {
    const caller = appRouter.createCaller(callerContext);

    // URLパラメータからkeyword,tagIds,order,pageを取得する
    const keyword = urlParamToString(query.keyword, "");
    const tagIds = urlParamToStringArray(query.tagIds, []);
    const rawOrder = urlParamToString(
      query.order,
      "createdDesc" satisfies ThemeOrder
    );
    const rawPeriod = urlParamToString(
      query.period,
      "all" satisfies ThemePeriod
    );
    const page = urlParamToString(query.page, "1");

    // orderが正しくない場合は404にする
    const parseOrderResult = themeOrderSchema.safeParse(rawOrder);
    if (!parseOrderResult.success) {
      return { notFound: true };
    }
    const order = parseOrderResult.data;

    // periodが正しくない場合は404にする
    const parsePeriodResult = themePeriodSchema.safeParse(rawPeriod);
    if (!parsePeriodResult.success) {
      return { notFound: true };
    }
    const period = parsePeriodResult.data;

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
        page: Number(page),
      }),
      () => searchedThemes
    );
  }
);

const SearchTheme: NextPage = () => {
  return <ThemeSearchPage />;
};
export default SearchTheme;
