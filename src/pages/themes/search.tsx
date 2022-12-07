import { dehydrate, QueryClient } from "@tanstack/react-query";
import { NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { ThemeSearchPage } from "../../client/components/ThemeSearchPage";
import { allTagsQueryKey } from "../../client/hooks/useAllTagsQuery";
import { searchedThemesQueryKey } from "../../client/hooks/useSearchedThemesQuery";
import { sessionQuerykey } from "../../client/hooks/useSessionQuery";
import { GetServerSidePropsWithReactQuery } from "../../server/lib/GetServerSidePropsWithReactQuery";
import {
  urlParamToString,
  urlParamToStringArray,
} from "../../server/lib/urlParam";
import { appRouter } from "../../server/routers/_app";
import { authOptions } from "../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSidePropsWithReactQuery = async ({
  req,
  res,
  query,
}) => {
  const caller = appRouter.createCaller({ session: null });

  const session = await unstable_getServerSession(req, res, authOptions);
  const allTags = await caller.theme.getAllTags();

  // URLパラメータからkeyword,tagIds,pageを取得する
  const keyword = urlParamToString(query.keyword, "");
  const tagIds = urlParamToStringArray(query.tagIds, []);
  const page = urlParamToString(query.page, "1");

  const searchedThemesResult = await caller.theme.search({
    keyword,
    tagIds,
    page,
  });

  const queryClient = new QueryClient();
  queryClient.setQueryData(sessionQuerykey, session);
  queryClient.setQueryData(allTagsQueryKey, allTags);
  queryClient.setQueryData(
    searchedThemesQueryKey({ keyword, tagIds, page: Number(page) }),
    searchedThemesResult
  );
  const dehydratedState = dehydrate(queryClient);

  return {
    props: {
      dehydratedState,
    },
  };
};

const SearchTheme: NextPage = () => {
  return <ThemeSearchPage />;
};
export default SearchTheme;
