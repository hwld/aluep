import { NextPage } from "next";
import { useRouter } from "next/router";
import { ThemeEditPage } from "../../../client/components/ThemeEditPage";
import { allTagsQueryKey } from "../../../client/hooks/useAllTagsQuery";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../client/hooks/useThemeQuery";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers/_app";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query, res }, queryClient, session }) => {
    if (!session) {
      return { redirect: { destination: "/", permanent: false } };
    }

    const { id: themeId } = query;
    if (typeof themeId !== "string") {
      return { notFound: true };
    }

    const caller = appRouter.createCaller({ session });
    const theme = await caller.theme.get({ themeId });

    // お題の作成者とログインユーザーが異なれば404にする
    if (theme.user.id !== session.user.id) {
      return { notFound: true };
    }

    await queryClient.prefetchQuery(themeQueryKey(themeId), () => theme);
    await queryClient.prefetchQuery(allTagsQueryKey, () =>
      caller.theme.getAllTags()
    );
  }
);

const UpdateTheme: NextPage = () => {
  const router = useRouter();
  const themeId = router.query.id as string;
  const { theme } = useThemeQuery(themeId);

  if (!theme) {
    // テーマが取得できないときはサーバー側でエラーが出るから、
    // ここには到達しない？
    return <div>Error</div>;
  }

  return <ThemeEditPage theme={theme} />;
};

export default UpdateTheme;
