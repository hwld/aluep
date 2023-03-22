import { NextPage } from "next";
import { pickedUpIdeasQueryKey } from "../client/features/idea/usePickedUpIdeasQuery";
import {
  top10LikesDevelopmentsInThisMonthQueryKey,
  top10LikesIdeasInThisMonthQueryKey,
  top10LikesPostersInThisMonthQueryKey,
} from "../client/features/user/useRankingQuery";
import { HomePage } from "../client/ui/HomePage";
import { withReactQueryGetServerSideProps } from "../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../server/router";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ queryClient, callerContext }) => {
    const caller = appRouter.createCaller(callerContext);

    // ランキング
    await queryClient.prefetchQuery(top10LikesIdeasInThisMonthQueryKey, () =>
      caller.aggregate.getTop10LikesIdeasInThisMonth()
    );
    await queryClient.prefetchQuery(
      top10LikesDevelopmentsInThisMonthQueryKey,
      () => caller.aggregate.getTop10LikesDevelopmentsInThisMonth()
    );
    await queryClient.prefetchQuery(top10LikesPostersInThisMonthQueryKey, () =>
      caller.aggregate.getTop10LikesPostersInThisMonth()
    );

    //　ピックアップされたお題
    await queryClient.prefetchQuery(pickedUpIdeasQueryKey("createdDesc"), () =>
      caller.aggregate.getPickedIdeas({ order: "createdDesc" })
    );
    await queryClient.prefetchQuery(pickedUpIdeasQueryKey("likeDesc"), () =>
      caller.aggregate.getPickedIdeas({ order: "likeDesc" })
    );
    await queryClient.prefetchQuery(
      pickedUpIdeasQueryKey("developmentDesc"),
      () => caller.aggregate.getPickedIdeas({ order: "developmentDesc" })
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
