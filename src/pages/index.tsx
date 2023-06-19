import { NextPage } from "next";
import { ideaKeys } from "../client/features/idea/queryKeys";
import { userKeys } from "../client/features/user/queryKeys";
import { HomePage } from "../client/pageComponents/HomePage";
import { withReactQueryGetServerSideProps } from "../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../server/router";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ queryClient, callerContext }) => {
    const caller = appRouter.createCaller(callerContext);

    // ランキング
    await queryClient.prefetchQuery(ideaKeys.top10LikesIdeasInThisMonth, () =>
      caller.aggregate.getTop10LikesIdeasInThisMonth()
    );
    await queryClient.prefetchQuery(
      userKeys.top10LikesDevelopmentsInThisMonth,
      () => caller.aggregate.getTop10LikesDevelopmentsInThisMonth()
    );
    await queryClient.prefetchQuery(userKeys.top10LikesPostersInThisMonth, () =>
      caller.aggregate.getTop10LikesPostersInThisMonth()
    );

    //　ピックアップされたお題
    await queryClient.prefetchQuery(ideaKeys.pickedUpList("createdDesc"), () =>
      caller.aggregate.getPickedIdeas({ order: "createdDesc" })
    );
    await queryClient.prefetchQuery(ideaKeys.pickedUpList("likeDesc"), () =>
      caller.aggregate.getPickedIdeas({ order: "likeDesc" })
    );
    await queryClient.prefetchQuery(
      ideaKeys.pickedUpList("developmentDesc"),
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
