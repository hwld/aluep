import { NextPage } from "next";
import { useRouter } from "next/router";
import { UserJoinedThemesPage } from "../../../client/components/UserDetail/UserJoinedThemesPage";
import { favoriteAnotherSumQueryKey } from "../../../client/hooks/useFavoriteAnother";
import { favoriteUserQueryKey } from "../../../client/hooks/useFavoriteUser";
import { joinedThemesQueryKey } from "../../../client/hooks/useJoinedThemesQuery";
import { sumThemeLikesQueryKey } from "../../../client/hooks/useSumThemeLikesQuery";
import { themeDeveloperLikesQueryKey } from "../../../client/hooks/useThemeDeveloperLikesQuery";
import { userQueryKey, useUserQuery } from "../../../client/hooks/useUserQuery";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers/_app";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session }) => {
    const caller = appRouter.createCaller({ session });
    const { page } = query;

    const { id: userId } = query;

    if (typeof userId !== "string") {
      return;
    }
    if (typeof page === "object") {
      throw new Error();
    }

    await queryClient.prefetchQuery(userQueryKey(userId), () =>
      caller.user.get({ userId })
    );

    await queryClient.prefetchQuery(
      joinedThemesQueryKey(userId, Number(page)),
      () => caller.user.getJoinTheme({ userId, page })
    );

    await queryClient.prefetchQuery(sumThemeLikesQueryKey, () =>
      caller.user.getThemeLike({ userId })
    );

    await queryClient.prefetchQuery(themeDeveloperLikesQueryKey, () =>
      caller.user.getThemeDeveloperLike({ userId })
    );

    //お気に入りのちらつきを無くす
    if (!session) {
      return;
    }
    const favoriteUserId = session.user.id;

    await queryClient.prefetchQuery(favoriteAnotherSumQueryKey(userId), () =>
      caller.user.favoritedAnotherSum({ userId })
    );

    await queryClient.prefetchQuery(
      favoriteUserQueryKey(userId, favoriteUserId),
      () => caller.user.favorited({ userId, favoriteUserId })
    );
  }
);

/**
 *  ユーザーの詳細ページ
 *  ユーザーが参加したお題一覧を表示する
 */
const UserDetail: NextPage = () => {
  const router = useRouter();
  const userId = router.query.id as string;
  const { user } = useUserQuery(userId);

  if (user === undefined) {
    return null;
  } else {
    return <UserJoinedThemesPage user={user} />;
  }
};
export default UserDetail;
