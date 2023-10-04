import { developmentKeys } from "@/client/features/development/queryKeys";
import { ideaKeys } from "@/client/features/idea/queryKeys";
import { userKeys } from "@/client/features/user/queryKeys";
import { useUserQuery } from "@/client/features/user/useUserQuery";
import { UserDetailPage } from "@/client/pageComponents/UserDetailPage/UserDetailPage";
import { userDetailPageSchame } from "@/models/user";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "@/server/router";
import { assertNever, assertString } from "@/share/utils";
import { useRouter } from "next/router";
import NotFoundPage from "../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, callerContext, queryClient, session }) => {
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
        await queryClient.prefetchQuery(ideaKeys.postedList(userId, page), () =>
          caller.idea.getPostedIdeasByUser({ userId, page })
        );
        break;
      case "developments":
        // ユーザーの開発情報
        await queryClient.prefetchQuery(
          developmentKeys.listByUser(userId, page),
          () => caller.development.getDevelopmentsByUser({ userId, page })
        );
        break;
      case "likedIdeas":
        // ユーザーがいいねしたお題
        await queryClient.prefetchQuery(ideaKeys.likedList(userId, page), () =>
          caller.idea.getLikedIdeasByUser({ userId, page })
        );
        break;
      case "likedDevelopments":
        // ユーザーがいいねいた開発情報
        await queryClient.prefetchQuery(
          developmentKeys.likedList(userId, page),
          () => caller.development.getLikedDevelopmentsByUser({ userId, page })
        );
        break;
      default:
        assertNever(tab);
    }

    // ユーザーの情報
    await queryClient.prefetchQuery(userKeys.detail(userId), () => user);

    // ユーザーがもらったいいねの数
    await queryClient.prefetchQuery(userKeys.receivedLikeCount(userId), () =>
      caller.user.getReceivedLikeCount({ userId })
    );

    // ログインユーザーがユーザーをお気に入り登録しているか
    await queryClient.prefetchQuery(
      userKeys.isFavorited(userId, session?.user.id),
      () => caller.user.isFavoritedByLoggedInUser({ userId })
    );

    // ユーザーがいいねしたユーザーの数
    await queryClient.prefetchQuery(userKeys.favoriteCount(userId), () =>
      caller.user.getFavoriteCountByUser({ userId })
    );

    // ユーザーのアクティビティ
    await queryClient.prefetchQuery(userKeys.activity(userId), () =>
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
  const { user, isLoading } = useUserQuery({ userId });

  if (isLoading) {
    return <></>;
  } else if (!user) {
    return <NotFoundPage />;
  }

  return <UserDetailPage user={user} />;
}
export default UserDetail;
