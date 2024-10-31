import { Home } from "@/client/pageComponents/Home/Home";
import { AppImage } from "@/client/ui/AppImage/AppImage";
import { PageProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { NextPage } from "next";
import dynamic from "next/dynamic";

// ユーザーランキングとピックアップされたお題の取得をアクセスが行われるたびに計算しているため、DBに負荷がかかりそう。
// こういった集計はリアルタイム性を必要としないから、バッチ処理として集計用のテーブルに追加していった方が良い？
// 負荷がかかってから対処する
const HomePage: NextPage<PageProps> = ({ welcomeMessageHidden }) => {
  return <Home welcomeMessageHidden={welcomeMessageHidden} />;
};
export default HomePage;

const HomePageLoading = () => {
  // MantineProviderを読み込む前に表示するので、Mantineは使えない
  return (
    <div
      style={{
        width: "100%",
        height: "100dvh",
        display: "grid",
        placeItems: "center",
        placeContent: "center",
        gap: "16px",
      }}
    >
      <AppImage
        src="/app-logo.svg"
        alt="app-log"
        width={100}
        height={100}
        style={{ marginTop: "2px" }}
        priority={true}
      />
      <div
        style={{
          width: "36px",
          aspectRatio: 1,
          borderRadius: "50%",
          border: "5px solid rgba(0,0,0,0.1)",
          borderRightColor: "#ef4444",
          animation: "spin 1s infinite linear",
        }}
      />
    </div>
  );
};

/**
 * コールドスタート時にNode.js側でページコンポーネントが読み込まれる際の遅延をなくすために、
 * トップページはSSRをせずに、クライアント側でレンダリングする。
 */
const DynamicPageLayout = dynamic(
  () =>
    // 一瞬だけちらつくのを防ぐために待たせているんだけど、どっちが良いのかは分からない・・・
    new Promise((res) => setTimeout(() => res(undefined), 250)).then(() =>
      import("../client/ui/PageLayout").then((mod) => mod.PageLayout)
    ),
  { ssr: false, loading: HomePageLoading }
);

HomePage.getLayout = (page) => {
  return <DynamicPageLayout>{page}</DynamicPageLayout>;
};
