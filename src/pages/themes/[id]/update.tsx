import { NextPage } from "next";
import { useRouter } from "next/router";
import { allTagsQueryKey } from "../../../client/features/theme/useAllTagsQuery";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../client/features/theme/useThemeQuery";
import { ThemeEditPage } from "../../../client/pageComponents/ThemeEditPage";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers";
import { Routes } from "../../../share/routes";
import { assertString } from "../../../share/utils";
import NotFoundPage from "../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session, callerContext }) => {
    if (!session) {
      return { redirect: { destination: Routes.home, permanent: false } };
    }

    const themeId = assertString(query.id);

    const caller = appRouter.createCaller(callerContext);
    const theme = await caller.theme.get({ themeId });

    // お題が存在しないか、お題の作成者とログインユーザーが異なれば404にする
    if (theme === undefined || theme.user.id !== session.user.id) {
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
  const themeId = assertString(router.query.id);
  const { theme } = useThemeQuery(themeId);

  if (!theme) {
    return <NotFoundPage />;
  }

  return <ThemeEditPage theme={theme} />;
};

export default UpdateTheme;
