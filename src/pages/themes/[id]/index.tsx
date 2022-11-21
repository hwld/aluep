import { dehydrate, QueryClient } from "@tanstack/react-query";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { GetServerSidePropsWithReactQuery } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers/_app";
import { ThemeDetailPage } from "../../../client/components/ThemeDetailPage";

export const getServerSideProps: GetServerSidePropsWithReactQuery = async ({
  req,
  res,
  query,
}) => {
  const { id: themeId } = query;
  if (typeof themeId !== "string") {
    return { notFound: true };
  }

  // セッションを取得する
  const session = await unstable_getServerSession(req, res, authOptions);
  const caller = appRouter.createCaller({ session });

  // 表示するテーマ
  // TODO prefecthQueryの仕様を調べて、awaitが必要か考える
  const theme = await caller.themes.get({ themeId });
  // ログインユーザーが表示するテーマにいいねしているか
  const liked = await caller.themes.liked({ themeId });
  // 表示するテーマの参加者
  const developers = await caller.themes.getAllDevelopers({ themeId });

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([`theme-${themeId}`], () => theme);
  await queryClient.prefetchQuery(
    [`theme-${themeId}-liked-${session?.user.id}`],
    () => liked
  );
  await queryClient.prefetchQuery(
    [`theme-${themeId}-developers`],
    () => developers
  );

  const dehydratedState = dehydrate(queryClient);

  return { props: { dehydratedState } };
};

export const ThemeDetail = () => {
  return <ThemeDetailPage />;
};
export default ThemeDetail;
