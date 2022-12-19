import { NextPage } from "next";
import { HomePage } from "../client/components/HomePage";
import { paginatedThemesQueryKey } from "../client/hooks/usePaginatedThemesQuery";
import {
  top10LikesDevelopersInThisMonthQueryKey,
  top10LikesPostersInThisMonthQueryKey,
  top10LikesThemesInThisMonthQueryKey,
} from "../client/hooks/useRankingQuery";
import { withReactQueryGetServerSideProps } from "../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../server/routers/_app";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session }) => {
    const caller = appRouter.createCaller({ session });

    const { page } = query;
    if (typeof page === "object") {
      throw new Error();
    }

    const paginatedThemes = await caller.theme.getMany({ page });
    if (page !== undefined && paginatedThemes.themes.length === 0) {
      return { notFound: true };
    }

    queryClient.setQueryData(
      paginatedThemesQueryKey(Number(page)),
      paginatedThemes
    );

    await queryClient.prefetchQuery(top10LikesThemesInThisMonthQueryKey, () =>
      caller.theme.getTop10LikesThemesInThisMonth()
    );
    await queryClient.prefetchQuery(
      top10LikesDevelopersInThisMonthQueryKey,
      () => caller.theme.getTop10LikesDevelopersInThisMonth()
    );
    await queryClient.prefetchQuery(top10LikesPostersInThisMonthQueryKey, () =>
      caller.theme.getTop10LikesPostersInThisMonth()
    );
  }
);

const Home: NextPage = () => {
  return <HomePage />;
};
export default Home;
