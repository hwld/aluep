import { useRouter } from "next/router";
import { themeDevelopedQueryKey } from "../../../client/features/theme/useThemeDevelop";
import { themeLikedQueryKey } from "../../../client/features/theme/useThemeLike";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../client/features/theme/useThemeQuery";
import { themeCommentsQueryKey } from "../../../client/features/themeComment/useThemeComments";
import { ThemeDetailPage } from "../../../client/pageComponents/ThemeDetailPage";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers";
import { assertString } from "../../../share/utils";
import NotFoundPage from "../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session, callerContext }) => {
    const themeId = assertString(query.id);

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

    // ログインユーザーの開発情報のプリフェッチ
    await queryClient.prefetchQuery(
      themeDevelopedQueryKey(themeId, session?.user.id),
      () => caller.theme.developed({ themeId })
    );

    // コメントのプリフェッチ
    await queryClient.prefetchQuery(themeCommentsQueryKey(themeId), () =>
      caller.themeComment.getAllComments({ themeId })
    );
  }
);

const ThemeDetail = () => {
  const router = useRouter();
  const themeId = assertString(router.query.id);
  const { theme, isLoading } = useThemeQuery(themeId);

  if (isLoading) {
    return <></>;
  } else if (!theme) {
    return <NotFoundPage />;
  }

  return <ThemeDetailPage theme={theme} />;
};
export default ThemeDetail;
