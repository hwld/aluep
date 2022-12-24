import { NextPage } from "next";
import { useRouter } from "next/router";
import { ThemeLikingUsersPage } from "../../../client/components/ThemeLikingUsersPage";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../client/hooks/useThemeQuery";
import { themelikesQueryKey } from "../../../client/hooks/useUsersLikedThemeQuery";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers/_app";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session }) => {
    const { id: themeId, page } = query;
    if (typeof themeId !== "string") {
      return { notFound: true };
    }
    if (typeof page === "object") {
      throw new Error();
    }

    const caller = appRouter.createCaller({ session });
    const theme = await caller.theme.get({ themeId });
    if (!theme) {
      return { notFound: true };
    }

    await queryClient.prefetchQuery(themeQueryKey(themeId), () =>
      caller.theme.get({ themeId })
    );
    await queryClient.prefetchQuery(
      themelikesQueryKey(themeId, Number(page)),
      () => caller.theme.getLikedUsers({ themeId, page })
    );
  }
);

/**
 * お題にいいねしているユーザー一覧を表示するページ
 */
const LikingUsers: NextPage = () => {
  const router = useRouter();
  const themeId = router.query.id as string;
  const { theme } = useThemeQuery(themeId);

  if (!theme) {
    return <></>;
  }

  return <ThemeLikingUsersPage theme={theme} />;
};
export default LikingUsers;
