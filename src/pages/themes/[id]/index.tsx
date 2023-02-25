import { useRouter } from "next/router";
import { themeJoinQueryKey } from "../../../client/features/theme/useThemeJoin";
import { themeLikedQueryKey } from "../../../client/features/theme/useThemeLike";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../client/features/theme/useThemeQuery";
import { themeCommentsQueryKey } from "../../../client/features/themeComment/useThemeComments";
import { ThemeDetailPage } from "../../../client/pageComponents/ThemeDetailPage";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers";
import NotFoundPage from "../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session, callerContext }) => {
    const { id: themeId, page } = query;

    if (typeof themeId !== "string") {
      return { notFound: true };
    }

    if (typeof page === "object") {
      throw new Error();
    }

    const caller = appRouter.createCaller(callerContext);

    // テーマがなければ404に飛ばす
    const theme = await caller.theme.get({ themeId });
    if (!theme) {
      return { notFound: true };
    }

    // お題情報のプリフェッチ
    queryClient.setQueryData(themeQueryKey(themeId), theme);

    // ログインユーザーのいいね状況のプリフェッチ
    await queryClient.prefetchQuery(
      themeLikedQueryKey(themeId, session?.user.id),
      () => caller.theme.liked({ themeId })
    );

    // ログインユーザーの参加情報のプリフェッチ
    await queryClient.prefetchQuery(
      themeJoinQueryKey(themeId, session?.user.id),
      () => caller.theme.joined({ themeId })
    );

    // コメントのプリフェッチ
    await queryClient.prefetchQuery(themeCommentsQueryKey(themeId), () =>
      caller.themeComment.getAllComments({ themeId })
    );
  }
);

const ThemeDetail = () => {
  const router = useRouter();
  const themeId = router.query.id as string;
  const { theme } = useThemeQuery(themeId);

  if (!theme) {
    return <NotFoundPage />;
  }

  return <ThemeDetailPage theme={theme} />;
};
export default ThemeDetail;
