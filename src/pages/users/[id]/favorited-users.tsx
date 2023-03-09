import { NextPage } from "next";
import { useRouter } from "next/router";
import { favoritedUsersPerPageQueryKey } from "../../../client/features/user/useFavoritedUsersPerPage";
import { FavoritedUsersPage } from "../../../client/pageComponents/FavoritedUsersPage";

import {
  userQueryKey,
  useUserQuery,
} from "../../../client/features/user/useUserQuery";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers";
import { paginatedPageSchema } from "../../../share/schema";
import { assertString } from "../../../share/utils";
import NotFoundPage from "../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, callerContext }) => {
    const caller = appRouter.createCaller(callerContext);

    const parsePageObjResult = paginatedPageSchema.safeParse(query);
    if (!parsePageObjResult.success) {
      return { notFound: true };
    }
    const { page } = parsePageObjResult.data;

    const userId = assertString(query.id);
    const user = caller.user.get({ userId });
    if (!user) {
      return { notFound: true };
    }

    await queryClient.prefetchQuery(
      favoritedUsersPerPageQueryKey(userId, page),
      () =>
        caller.user.getFavoritedUsers({
          favoriteByUserId: userId,
          page,
        })
    );

    await queryClient.prefetchQuery(userQueryKey(userId), () => user);
  }
);

const UserDetail: NextPage = () => {
  const router = useRouter();
  const userId = assertString(router.query.id);
  const { user, isLoading } = useUserQuery(userId);

  if (isLoading) {
    return <></>;
  } else if (!user) {
    return <NotFoundPage />;
  }

  return <FavoritedUsersPage user={user} />;
};
export default UserDetail;
