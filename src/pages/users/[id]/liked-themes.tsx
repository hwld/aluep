import { NextPage } from "next";
import { useRouter } from "next/router";
import { themeDeveloperLikesQueryKey } from "../../../client/features/developer/useThemeDeveloperLikesQuery";
import { likedThemesQueryKey } from "../../../client/features/theme/useLikedThemesQuery";
import { sumThemeLikesQueryKey } from "../../../client/features/theme/useSumThemeLikesQuery";
import { favoritedUserQueryKey } from "../../../client/features/user/useFavoriteUser";
import { favoriteUsersCountQueryKey } from "../../../client/features/user/useFavoriteUsersCountQuery";
import {
  userQueryKey,
  useUserQuery,
} from "../../../client/features/user/useUserQuery";
import { UserLikedThemesPage } from "../../../client/pageComponents/UserLikedThemesPage";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session, callerContext }) => {
    const caller = appRouter.createCaller(callerContext);
    const { page } = query;

    const { id: userId } = query;

    if (typeof userId !== "string") {
      return { notFound: true };
    }
    if (typeof page === "object") {
      throw new Error();
    }

    const user = await caller.user.get({ userId });
    if (!user) {
      return { notFound: true };
    }

    await queryClient.prefetchQuery(userQueryKey(userId), () => user);

    await queryClient.prefetchQuery(
      likedThemesQueryKey(userId, Number(page)),
      () => caller.theme.getLikedThemesByUser({ userId, page })
    );

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
 *  ユーザーがいいねしたお題一覧を表示する
 */
const UserDetail: NextPage = () => {
  const router = useRouter();
  const userId = router.query.id as string;
  const { user } = useUserQuery(userId);

  if (!user) {
    return null;
  } else {
    return <UserLikedThemesPage user={user} />;
  }
};
export default UserDetail;
