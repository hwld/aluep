import { NextPage } from "next";
import { useRouter } from "next/router";
import { themeDeveloperLikesQueryKey } from "../../../client/features/developer/useThemeDeveloperLikesQuery";
import { likedThemesPerPageQueryKey } from "../../../client/features/theme/useLikedThemesPerPage";
import { sumThemeLikesQueryKey } from "../../../client/features/theme/useSumThemeLikesQuery";
import { favoritedUserQueryKey } from "../../../client/features/user/useFavoriteUser";
import { favoriteUsersCountQueryKey } from "../../../client/features/user/useFavoriteUsersCountQuery";
import {
  userQueryKey,
  useUserQuery,
} from "../../../client/features/user/useUserQuery";
import { UserLikedThemesPage } from "../../../client/pageComponents/UserLikedThemesPage";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { urlParamToString } from "../../../server/lib/urlParam";
import { appRouter } from "../../../server/routers";
import { assertString } from "../../../share/utils";
import NotFoundPage from "../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session, callerContext }) => {
    const caller = appRouter.createCaller(callerContext);
    const page = urlParamToString(query.page, "1");

    const userId = assertString(query.id);

    const user = await caller.user.get({ userId });
    if (!user) {
      return { notFound: true };
    }

    await queryClient.prefetchQuery(userQueryKey(userId), () => user);

    await queryClient.prefetchQuery(
      likedThemesPerPageQueryKey(userId, Number(page)),
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
  const userId = assertString(router.query.id);
  const { user, isLoading } = useUserQuery(userId);

  if (isLoading) {
    return <></>;
  } else if (!user) {
    return <NotFoundPage />;
  }

  return <UserLikedThemesPage user={user} />;
};
export default UserDetail;
