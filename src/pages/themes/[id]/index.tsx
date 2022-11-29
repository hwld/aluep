import { dehydrate, QueryClient } from "@tanstack/react-query";
import { unstable_getServerSession } from "next-auth";
import { ThemeDetailPage } from "../../../client/components/ThemeDetailPage";
import { themeDevelopersQueryKey } from "../../../client/hooks/useThemeDevelopersQuery";
import { themeLikedQueryKey } from "../../../client/hooks/useThemeLike";
import { themeQueryKey } from "../../../client/hooks/useThemeQuery";
import { GetServerSidePropsWithReactQuery } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers/_app";
import { authOptions } from "../../api/auth/[...nextauth]";

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
  const theme = await caller.theme.get({ themeId });
  // ログインユーザーが表示するテーマにいいねしているか
  const liked = await caller.theme.liked({ themeId });
  // 表示するテーマの参加者
  const developers = await caller.theme.getAllDevelopers({ themeId });

  const queryClient = new QueryClient();
  queryClient.setQueryData(themeQueryKey(themeId), theme);
  queryClient.setQueryData(
    themeLikedQueryKey(themeId, session?.user.id),
    liked
  );
  queryClient.setQueryData(themeDevelopersQueryKey(themeId), developers);

  const dehydratedState = dehydrate(queryClient);

  return { props: { dehydratedState } };
};

export const ThemeDetail = () => {
  return <ThemeDetailPage />;
};
export default ThemeDetail;
