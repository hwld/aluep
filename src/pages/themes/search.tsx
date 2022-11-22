import { dehydrate, QueryClient } from "@tanstack/react-query";
import { NextPage } from "next";
import { ThemeSearchPage } from "../../client/components/ThemeSearchPage";
import { allTagsQueryKey } from "../../client/hooks/useAllTagsQuery";
import { GetServerSidePropsWithReactQuery } from "../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../server/routers/_app";

export const getServerSideProps: GetServerSidePropsWithReactQuery =
  async () => {
    const caller = appRouter.createCaller({ session: null });
    const allTags = caller.theme.getAllTags();

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(allTagsQueryKey, () => allTags);
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
