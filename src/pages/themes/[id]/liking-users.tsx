import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../client/features/theme/useThemeQuery";
import { themeLikingUsersQueryKey } from "../../../client/features/user/useThemeLikingUsersQuery";
import { ThemeLikingUsersPage } from "../../../client/pageComponents/ThemeLikingUsersPage";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers";
import { assertString } from "../../../share/utils";
import NotFoundPage from "../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, callerContext }) => {
    // TODO
    const { page } = query;
    const themeId = assertString(query.id);

    if (typeof page === "object") {
      throw new Error();
    }

    const caller = appRouter.createCaller(callerContext);
    const theme = await caller.theme.get({ themeId });
    if (!theme) {
      return { notFound: true };
    }

    await queryClient.prefetchQuery(themeQueryKey(themeId), () =>
      caller.theme.get({ themeId })
    );
    await queryClient.prefetchQuery(
      themeLikingUsersQueryKey(themeId, Number(page)),
      () => caller.user.getThemeLikingUsers({ themeId, page })
    );
  }
);

/**
 * お題にいいねしているユーザー一覧を表示するページ
 */
const LikingUsers: NextPage = () => {
  const router = useRouter();
  const themeId = assertString(router.query.id);
  const { theme } = useThemeQuery(themeId);

  if (!theme) {
    return <NotFoundPage />;
  }

  return <ThemeLikingUsersPage theme={theme} />;
};
export default LikingUsers;
