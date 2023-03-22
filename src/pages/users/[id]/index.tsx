import { useRouter } from "next/router";
import { developmentLikesQueryKey } from "../../../client/features/development/useDevelopmentLikesQuery";
import { developedIdeasPerPageQueryKey } from "../../../client/features/idea/useDevelopedIdeasPerPage";
import { likedIdeasPerPageQueryKey } from "../../../client/features/idea/useLikedIdeasPerPage";
import { postedIdeasPerPageQueryKey } from "../../../client/features/idea/usePostedIdeasQuery";
import { sumIdeaLikesQueryKey } from "../../../client/features/idea/useSumIdeaLikesQuery";
import { favoritedUserQueryKey } from "../../../client/features/user/useFavoriteUser";
import { favoriteUsersCountQueryKey } from "../../../client/features/user/useFavoriteUsersCountQuery";
import {
  userQueryKey,
  useUserQuery,
} from "../../../client/features/user/useUserQuery";
import { UserDetailPage } from "../../../client/pageComponents/UserDetailPage";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/router";
import { userDetailPageSchame } from "../../../share/schema";
import { assertNever, assertString } from "../../../share/utils";
import NotFoundPage from "../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, callerContext, queryClient, session }) => {
    const caller = appRouter.createCaller(callerContext);

    const parseUserDetailResult = userDetailPageSchame.safeParse(query);
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
      case "postedIdeas":
        await queryClient.prefetchQuery(
          postedIdeasPerPageQueryKey(userId, page),
          () => caller.idea.getPostedIdeasByUser({ userId, page })
        );
        break;
      case "developedIdeas":
        await queryClient.prefetchQuery(
          developedIdeasPerPageQueryKey(userId, page),
          () => caller.idea.getDevelopedIdeasByUser({ userId, page })
        );
        break;
      case "likedIdeas":
        await queryClient.prefetchQuery(
          likedIdeasPerPageQueryKey(userId, page),
          () => caller.idea.getLikedIdeasByUser({ userId, page })
        );
        break;
      default:
        assertNever(tab);
    }

    await queryClient.prefetchQuery(userQueryKey(userId), () => user);
    await queryClient.prefetchQuery(sumIdeaLikesQueryKey(userId), () =>
      caller.idea.getLikeCountByUser({ userId })
    );
    await queryClient.prefetchQuery(developmentLikesQueryKey(userId), () =>
      caller.development.getLikeCountByUser({ userId })
    );
    await queryClient.prefetchQuery(
      favoritedUserQueryKey(userId, session?.user.id),
      () => caller.user.isFavoritedByLoggedInUser({ userId })
    );
    await queryClient.prefetchQuery(favoriteUsersCountQueryKey(userId), () =>
      caller.user.getFavoriteCountByUser({ userId })
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
