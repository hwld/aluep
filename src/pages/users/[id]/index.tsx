import { useRouter } from "next/router";
import { themeDeveloperLikesQueryKey } from "../../../client/features/developer/useThemeDeveloperLikesQuery";
import { joinedThemesPerPageQueryKey } from "../../../client/features/theme/useJoinedThemesPerPage";
import { likedThemesPerPageQueryKey } from "../../../client/features/theme/useLikedThemesPerPage";
import { postedThemesPerPageQueryKey } from "../../../client/features/theme/usePostedThemesQuery";
import { sumThemeLikesQueryKey } from "../../../client/features/theme/useSumThemeLikesQuery";
import { favoritedUserQueryKey } from "../../../client/features/user/useFavoriteUser";
import { favoriteUsersCountQueryKey } from "../../../client/features/user/useFavoriteUsersCountQuery";
import {
  userQueryKey,
  useUserQuery,
} from "../../../client/features/user/useUserQuery";
import { UserDetailPage } from "../../../client/pageComponents/UserDetailPage";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers";
import { userDetailSchame } from "../../../share/schema";
import { assertNever, assertString } from "../../../share/utils";
import NotFoundPage from "../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, callerContext, queryClient, session }) => {
    const caller = appRouter.createCaller(callerContext);

    //　TODO: dynamic routesのパラメータもスキーマに含めて、パースに失敗したら404を返すようにする
    const parseUserDetailResult = userDetailSchame.safeParse(query);
    if (!parseUserDetailResult.success) {
      return { notFound: true };
    }
    const { tab, page } = parseUserDetailResult.data;

    const userId = assertString(query.id);

    const user = await caller.user.get({ userId });
    if (!user) {
      return { notFound: true };
    }

    // タブに応じたデータをプリフェッチする
    switch (tab) {
      case "postedThemes":
        await queryClient.prefetchQuery(
          postedThemesPerPageQueryKey(userId, page),
          () => caller.theme.getPostedThemesByUser({ userId, page })
        );
        break;
      case "joinedThemes":
        await queryClient.prefetchQuery(
          joinedThemesPerPageQueryKey(userId, page),
          () => caller.theme.getJoinedThemesByUser({ userId, page })
        );
        break;
      case "likedThemes":
        await queryClient.prefetchQuery(
          likedThemesPerPageQueryKey(userId, page),
          () => caller.theme.getLikedThemesByUser({ userId, page })
        );
        break;
      default:
        assertNever(tab);
    }

    await queryClient.prefetchQuery(userQueryKey(userId), () => user);
    await queryClient.prefetchQuery(sumThemeLikesQueryKey(userId), () =>
      caller.theme.getLikeCountByUser({ userId })
    );
    await queryClient.prefetchQuery(themeDeveloperLikesQueryKey(userId), () =>
      caller.developer.getLikeCountByUser({ userId })
    );
    await queryClient.prefetchQuery(
      favoritedUserQueryKey(userId, session?.user.id),
      () => caller.user.favorited({ userId })
    );
    await queryClient.prefetchQuery(favoriteUsersCountQueryKey(userId), () =>
      caller.user.favoriteUsersCount({ userId })
    );
  }
);

/**
 *  ユーザーの詳細ページ
 */
function UserDetail() {
  const router = useRouter();
  const userId = assertString(router.query.id);
  const { user, isLoading } = useUserQuery(userId);

  if (isLoading) {
    return <></>;
  } else if (!user) {
    return <NotFoundPage />;
  }

  return <UserDetailPage user={user} />;
}
export default UserDetail;
