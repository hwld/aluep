import { HomePage } from "@/client/pageComponents/HomePage/HomePage";
import { __new_db__ } from "@/server/lib/db";
import {
  PageProps,
  withReactQueryGetServerSideProps,
} from "@/server/lib/GetServerSidePropsWithReactQuery";
import { NextPage } from "next";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ trpcStore }) => {
    await Promise.all([
      trpcStore.idea.getRecommendedIdeas.prefetch(),

      // ランキング
      trpcStore.aggregate.getPopularIdeas.prefetch({ limit: 10 }),
      trpcStore.aggregate.getPopularDevelopers.prefetch({ limit: 10 }),
      trpcStore.aggregate.getPopularIdeaAuthors.prefetch({ limit: 10 }),
      trpcStore.aggregate.getPopularIdeaTags.prefetch({ limit: 10 }),

      //　ピックアップされたお題
      trpcStore.aggregate.getPickedIdeas.prefetch({ order: "createdDesc" }),
      trpcStore.aggregate.getPickedIdeas.prefetch({ order: "likeDesc" }),
      trpcStore.aggregate.getPickedIdeas.prefetch({ order: "devDesc" }),
    ]);
  }
);

// ユーザーランキングとピックアップされたお題の取得をアクセスが行われるたびに計算しているため、DBに負荷がかかりそう。
// こういった集計はリアルタイム性を必要としないから、バッチ処理として集計用のテーブルに追加していった方が良い？
// 負荷がかかってから対処する
const Home: NextPage<PageProps> = ({ welcomeMessageHidden }) => {
  return <HomePage welcomeMessageHidden={welcomeMessageHidden} />;
};
export default Home;
