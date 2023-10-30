import { HomePage } from "@/client/pageComponents/HomePage/HomePage";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { getAppConfigCookie } from "@/share/cookie";
import { NextPage } from "next";

export type HomePageProps = {
  welcomeMessageHidden: boolean | null;
};

export const getServerSideProps =
  withReactQueryGetServerSideProps<HomePageProps>(
    async ({ trpcStore, gsspContext: { req } }) => {
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

      const config = getAppConfigCookie(req.cookies);

      return {
        props: { welcomeMessageHidden: config.welcomeMessageHidden ?? null },
      };
    }
  );

// ユーザーランキングとピックアップされたお題の取得をアクセスが行われるたびに計算しているため、DBに負荷がかかりそう。
// こういった集計はリアルタイム性を必要としないから、バッチ処理として集計用のテーブルに追加していった方が良い？
// 負荷がかかってから対処する
const Home: NextPage<HomePageProps> = ({ welcomeMessageHidden }) => {
  return <HomePage welcomeMessageHidden={welcomeMessageHidden ?? undefined} />;
};
export default Home;
