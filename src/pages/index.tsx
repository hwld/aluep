import { NextPage } from "next";
import { pickedUpThemesQueryKey } from "../client/features/theme/usePickedUpThemesQuery";
import {
  top10LikesDevelopersInThisMonthQueryKey,
  top10LikesPostersInThisMonthQueryKey,
  top10LikesThemesInThisMonthQueryKey,
} from "../client/features/user/useRankingQuery";
import { HomePage } from "../client/ui/HomePage";
import { withReactQueryGetServerSideProps } from "../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../server/routers";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ queryClient, callerContext }) => {
    const caller = appRouter.createCaller(callerContext);

    // ランキング
    await queryClient.prefetchQuery(top10LikesThemesInThisMonthQueryKey, () =>
      caller.aggregate.getTop10LikesThemesInThisMonth()
    );
    await queryClient.prefetchQuery(
      top10LikesDevelopersInThisMonthQueryKey,
      () => caller.aggregate.getTop10LikesDevelopersInThisMonth()
    );
    await queryClient.prefetchQuery(top10LikesPostersInThisMonthQueryKey, () =>
      caller.aggregate.getTop10LikesPostersInThisMonth()
    );

    //　ピックアップされたお題
    await queryClient.prefetchQuery(pickedUpThemesQueryKey("createdDesc"), () =>
      caller.aggregate.pickUpThemes({ order: "createdDesc" })
    );
    await queryClient.prefetchQuery(pickedUpThemesQueryKey("likeDesc"), () =>
      caller.aggregate.pickUpThemes({ order: "likeDesc" })
    );
    await queryClient.prefetchQuery(
      pickedUpThemesQueryKey("developerDesc"),
      () => caller.aggregate.pickUpThemes({ order: "developerDesc" })
    );
  }
);

// TODO:
// ユーザーランキングとピックアップされたお題の取得をアクセスが行われるたびに計算しているため、DBに負荷がかかりそう。
// こういった集計はリアルタイム性を必要としないから、バッチ処理として集計用のテーブルに追加していった方が良い？
const Home: NextPage = () => {
  return <HomePage />;
};
export default Home;
