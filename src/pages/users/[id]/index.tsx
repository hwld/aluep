import { useRouter } from "next/router";
import { likedDevelopmentsPerPageQueryKey } from "../../../client/features/development/useLikedDevelopmentsPerPage";
import { userDevelopmentsPerPageQueryKey } from "../../../client/features/development/useUserDevelopmentsPerPage";
import { likedIdeasPerPageQueryKey } from "../../../client/features/idea/useLikedIdeasPerPage";
import { postedIdeasPerPageQueryKey } from "../../../client/features/idea/usePostedIdeasQuery";
import { favoritedUserQueryKey } from "../../../client/features/user/useFavoriteUser";
import { favoriteUserCountQueryKey } from "../../../client/features/user/useFavoriteUserCountQuery";
import { receivedLikeCountQueryKey } from "../../../client/features/user/useReceivedLikeCountQuery";
import { userActivityQueryKey } from "../../../client/features/user/useUserActivityQuery";
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
        // ユーザーが投稿したお題
        await queryClient.prefetchQuery(
          postedIdeasPerPageQueryKey(userId, page),
          () => caller.idea.getPostedIdeasByUser({ userId, page })
        );
        break;
      case "developments":
        // ユーザーの開発情報
        await queryClient.prefetchQuery(
          userDevelopmentsPerPageQueryKey(userId, page),
          () => caller.development.getDevelopmentsByUser({ userId, page })
        );
        break;
      case "likedIdeas":
        // ユーザーがいいねしたお題
        await queryClient.prefetchQuery(
          likedIdeasPerPageQueryKey(userId, page),
          () => caller.idea.getLikedIdeasByUser({ userId, page })
        );
        break;
      case "likedDevelopments":
        // ユーザーがいいねいた開発情報
        await queryClient.prefetchQuery(
          likedDevelopmentsPerPageQueryKey(userId, page),
          () => caller.development.getLikedDevelopmentsByUser({ userId, page })
        );
        break;
      default:
        assertNever(tab);
    }

    // ユーザーの情報
    await queryClient.prefetchQuery(userQueryKey(userId), () => user);

    // ユーザーがもらったいいねの数
    await queryClient.prefetchQuery(receivedLikeCountQueryKey(userId), () =>
      caller.user.getReceivedLikeCount({ userId })
    );

    // ログインユーザーがユーザーをお気に入り登録しているか
    await queryClient.prefetchQuery(
      favoritedUserQueryKey(userId, session?.user.id),
      () => caller.user.isFavoritedByLoggedInUser({ userId })
    );

    // ユーザーがいいねしたユーザーの数
    await queryClient.prefetchQuery(favoriteUserCountQueryKey(userId), () =>
      caller.user.getFavoriteCountByUser({ userId })
    );

    // ユーザーのアクティビティ
    await queryClient.prefetchQuery(userActivityQueryKey(userId), () =>
      caller.user.getUserActivity({ userId })
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
