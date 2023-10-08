import { useUserQuery } from "@/client/features/user/useUserQuery";
import { UserDetailPage } from "@/client/pageComponents/UserDetailPage/UserDetailPage";
import { userDetailPageSchame } from "@/models/user";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { assertNever, assertString } from "@/share/utils";
import { useRouter } from "next/router";
import NotFoundPage from "../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, trpcStore }) => {
    const parseUserDetailResult = userDetailPageSchame.safeParse(query);
    if (!parseUserDetailResult.success) {
      return { notFound: true };
    }

    const { tab, page } = parseUserDetailResult.data;
    const userId = assertString(query.id);

    const user = await trpcStore.user.get.fetch({ userId });
    if (!user) {
      return { notFound: true };
    }

    let prefetching: Promise<void>;
    // タブに応じたデータをプリフェッチする
    switch (tab) {
      case "postedIdeas":
        // ユーザーが投稿したお題
        prefetching = trpcStore.idea.getPostedIdeasByUser.prefetch({
          userId,
          page,
        });
        break;
      case "developments":
        // ユーザーの開発情報
        prefetching = trpcStore.development.getDevelopmentsByUser.prefetch({
          userId,
          page,
        });
        break;
      case "likedIdeas":
        // ユーザーがいいねしたお題
        prefetching = trpcStore.idea.getLikedIdeasByUser.prefetch({
          userId,
          page,
        });
        break;
      case "likedDevelopments":
        // ユーザーがいいねいた開発情報
        prefetching = trpcStore.development.getLikedDevelopmentsByUser.prefetch(
          { userId, page }
        );
        break;
      default:
        assertNever(tab);
        throw new Error("");
    }

    await Promise.all([
      prefetching,
      trpcStore.user.get.prefetch({ userId }),
      trpcStore.user.getReceivedLikeCount.prefetch({ userId }),
      trpcStore.user.isFavoritedByLoggedInUser.prefetch({ userId }),
      trpcStore.user.getFavoriteCountByUser.prefetch({ userId }),
      trpcStore.user.getUserActivity.prefetch({ userId }),
    ]);
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
