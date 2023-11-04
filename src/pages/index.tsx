import { Home } from "@/client/pageComponents/Home/Home";
import { PageProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { NextPage } from "next";

// ユーザーランキングとピックアップされたお題の取得をアクセスが行われるたびに計算しているため、DBに負荷がかかりそう。
// こういった集計はリアルタイム性を必要としないから、バッチ処理として集計用のテーブルに追加していった方が良い？
// 負荷がかかってから対処する
const HomePage: NextPage<PageProps> = ({ welcomeMessageHidden }) => {
  return <Home welcomeMessageHidden={welcomeMessageHidden} />;
};
export default HomePage;
