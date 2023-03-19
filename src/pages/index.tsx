import { NextPage } from "next";
import { pickedUpThemesQueryKey } from "../client/features/theme/usePickedUpThemesQuery";
import {
  top10LikesDevelopmentsInThisMonthQueryKey,
  top10LikesPostersInThisMonthQueryKey,
  top10LikesThemesInThisMonthQueryKey,
} from "../client/features/user/useRankingQuery";
import { HomePage } from "../client/ui/HomePage";
import { withReactQueryGetServerSideProps } from "../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../server/router";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ queryClient, callerContext }) => {
    const caller = appRouter.createCaller(callerContext);

    // ランキング
    await queryClient.prefetchQuery(top10LikesThemesInThisMonthQueryKey, () =>
      caller.aggregate.getTop10LikesThemesInThisMonth()
    );
    await queryClient.prefetchQuery(
      top10LikesDevelopmentsInThisMonthQueryKey,
      () => caller.aggregate.getTop10LikesDevelopmentsInThisMonth()
    );
    await queryClient.prefetchQuery(top10LikesPostersInThisMonthQueryKey, () =>
      caller.aggregate.getTop10LikesPostersInThisMonth()
    );

    //　ピックアップされたお題
    await queryClient.prefetchQuery(pickedUpThemesQueryKey("createdDesc"), () =>
      caller.aggregate.getPickedThemes({ order: "createdDesc" })
    );
    await queryClient.prefetchQuery(pickedUpThemesQueryKey("likeDesc"), () =>
      caller.aggregate.getPickedThemes({ order: "likeDesc" })
    );
    await queryClient.prefetchQuery(
      pickedUpThemesQueryKey("developmentDesc"),
      () => caller.aggregate.getPickedThemes({ order: "developmentDesc" })
    );
  }
);

// ユーザーランキングとピックアップされたお題の取得をアクセスが行われるたびに計算しているため、DBに負荷がかかりそう。
// こういった集計はリアルタイム性を必要としないから、バッチ処理として集計用のテーブルに追加していった方が良い？
// 負荷がかかってから対処する
const Home: NextPage = () => {
  return <HomePage />;
};
export default Home;
