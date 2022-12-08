import { dehydrate, QueryClient } from "@tanstack/react-query";
import { NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { ThemeLikelistPage } from "../../../client/components/ThemeLikelistPage";
import { themeLikedQueryKey } from "../../../client/hooks/useThemeLike";
import { themelikesQueryKey } from "../../../client/hooks/useThemeLikesQuery";
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
  // TODO prefecthQueryの仕様を調べて、awaitが必要か考える
  const theme = await caller.theme.get({ themeId });
  // ログインユーザーが表示するテーマにいいねしているか
  const liked = await caller.theme.liked({ themeId });
  // 表示するテーマの参加者
  const developers = await caller.theme.getAllDevelopers({ themeId });
  // 表示するテーマをいいねしたユーザー
  const users = await caller.theme.getLikedUsers({ themeId });

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(themeQueryKey(themeId), () => theme);
  await queryClient.prefetchQuery(
    themeLikedQueryKey(themeId, session?.user.id),
    () => liked
  );
  await queryClient.prefetchQuery(
    [`theme-${themeId}-developers`],
    () => developers
  );
  await queryClient.prefetchQuery(
    themelikesQueryKey(themeId),
    () => users
  );

  const dehydratedState = dehydrate(queryClient);

  return { props: { dehydratedState } };
};

const ThemeLikelist: NextPage = () => {
  return <ThemeLikelistPage />;
};
export default ThemeLikelist;