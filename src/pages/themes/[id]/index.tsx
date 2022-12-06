import { dehydrate, QueryClient } from "@tanstack/react-query";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { ThemeDetailPage } from "../../../client/components/ThemeDetailPage";
import { sessionQuerykey } from "../../../client/hooks/useSessionQuery";
import { themeDevelopersQueryKey } from "../../../client/hooks/useThemeDevelopersQuery";
import { themeJoinQueryKey } from "../../../client/hooks/useThemeJoinedQuery";
import { themeLikedQueryKey } from "../../../client/hooks/useThemeLike";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../client/hooks/useThemeQuery";
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
  // ログインユーザーが表示するテーマに参加しているか
  const joined = await caller.theme.joined({ themeId });
  // 表示するテーマの参加者
  const developers = await caller.theme.getAllDevelopers({ themeId });

  const queryClient = new QueryClient();
  queryClient.setQueryData(sessionQuerykey, session);
  queryClient.setQueryData(themeQueryKey(themeId), theme);
  queryClient.setQueryData(
    themeLikedQueryKey(themeId, session?.user.id),
    liked
  );
  queryClient.setQueryData(
    themeJoinQueryKey(themeId, session?.user.id),
    joined
  );
  queryClient.setQueryData(themeDevelopersQueryKey(themeId), developers);

  const dehydratedState = dehydrate(queryClient);

  return { props: { dehydratedState } };
};

export const ThemeDetail = () => {
  const router = useRouter();
  const themeId = router.query.id as string;
  const { theme } = useThemeQuery(themeId);

  if (!theme) {
    return <div>Error</div>;
  }

  return <ThemeDetailPage theme={theme} />;
};
export default ThemeDetail;
